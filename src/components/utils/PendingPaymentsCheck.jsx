import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import api from "@/api/api";
import { toast } from "@/utils/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Each donation is checked against Razorpay one by one, so allow far more
// than the default API timeout.
const TIMEOUT_MS = 5 * 60 * 1000;
const BATCH = 50;

const OUTCOME_LABELS = {
  success: { text: "Paid → success", className: "bg-green-100 text-green-800" },
  failed: { text: "Failed → mark failed", className: "bg-red-100 text-red-800" },
  no_payment_attempted: { text: "No payment attempt", className: "bg-muted text-muted-foreground" },
  authorized_not_captured: { text: "Authorized, not captured", className: "bg-amber-100 text-amber-800" },
  needs_manual_review: { text: "Check manually", className: "bg-amber-100 text-amber-800" },
  could_not_verify: { text: "Could not verify", className: "bg-amber-100 text-amber-800" },
  already_failed: { text: "Already failed", className: "bg-muted text-muted-foreground" },
};

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function PendingPaymentsCheck() {
  const [includeFailed, setIncludeFailed] = useState(false);
  const [rows, setRows] = useState([]);
  const [nextBefore, setNextBefore] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [checking, setChecking] = useState(false);
  const [applying, setApplying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [appliedOnce, setAppliedOnce] = useState(false);

  const toSettle = rows.filter(
    (r) => !r.applied && (r.outcome === "success" || r.outcome === "failed"),
  );
  const willSucceed = toSettle.filter((r) => r.outcome === "success");
  const willFail = toSettle.filter((r) => r.outcome === "failed");
  const updatedCount = rows.filter((r) => r.applied).length;

  const check = async (before = null) => {
    setChecking(true);
    try {
      const res = await api.post(
        "/dashboard/reconcile-pending",
        { apply: false, before, limit: BATCH, includeFailed },
        { timeout: TIMEOUT_MS },
      );
      const data = res.data?.data;
      setRows((prev) => (before ? [...prev, ...(data?.rows ?? [])] : data?.rows ?? []));
      setNextBefore(data?.nextBefore ?? null);
      setRemaining(data?.remaining ?? 0);
      if (!before) setAppliedOnce(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not check pending payments");
    } finally {
      setChecking(false);
    }
  };

  const apply = async (event) => {
    event.preventDefault();
    setApplying(true);
    try {
      // The server applies at most 100 per request.
      const ids = toSettle.map((r) => r.donationId);
      const results = new Map();
      let message = "";
      for (let i = 0; i < ids.length; i += 100) {
        const res = await api.post(
          "/dashboard/reconcile-pending",
          { apply: true, donationIds: ids.slice(i, i + 100), includeFailed, limit: 100 },
          { timeout: TIMEOUT_MS },
        );
        for (const row of res.data?.data?.rows ?? []) results.set(row.donationId, row);
        message = res.data?.message;
      }
      setRows((prev) => prev.map((r) => results.get(r.donationId) ?? r));
      setAppliedOnce(true);
      const notApplied = [...results.values()].filter((r) => !r.applied).length;
      if (notApplied) {
        toast.warning(`${results.size - notApplied} updated, ${notApplied} left unchanged — see table`);
      } else {
        toast.success(message || `Updated ${results.size}`);
      }
      setConfirmOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reconcile failed");
    } finally {
      setApplying(false);
    }
  };

  return (
    <Card className="p-4 space-y-3 border-primary/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Verify pending payments with Razorpay
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="include-failed"
              checked={includeFailed}
              onCheckedChange={(v) => setIncludeFailed(v === true)}
              disabled={checking || applying}
            />
            <Label htmlFor="include-failed" className="text-xs font-normal">
              Also re-check failed donations
            </Label>
          </div>
          <Button size="sm" onClick={() => check()} disabled={checking || applying}>
            {checking && rows.length === 0 ? "Checking…" : "Check now"}
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Checks every Razorpay order for each pending online donation (older
        than 30 minutes). Nothing changes until you press Apply. Then only
        payments Razorpay shows as <strong>captured</strong> become success
        (receipt, WhatsApp and DCC go out), and donations where{" "}
        <strong>every attempt failed</strong> are marked failed with nothing
        sent. Everything else stays as it is for you to check.
      </p>

      {rows.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>
              Checked {rows.length}
              {remaining > 0 && ` · ${remaining} older still to check`}:{" "}
              {updatedCount > 0 && (
                <>
                  <strong>{updatedCount}</strong> updated,{" "}
                </>
              )}
              <strong>{willSucceed.length}</strong> paid and{" "}
              <strong>{willFail.length}</strong> failed to apply,{" "}
              {rows.length - toSettle.length - updatedCount} unchanged
            </span>
            <div className="flex gap-2">
              {nextBefore && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => check(nextBefore)}
                  disabled={checking || applying}
                >
                  {checking ? "Checking…" : `Check next ${BATCH}`}
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => setConfirmOpen(true)}
                disabled={toSettle.length === 0 || checking || applying}
              >
                Apply ({toSettle.length})
              </Button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-auto rounded-md border">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted text-left">
                <tr>
                  <th className="p-2 font-medium">Donor</th>
                  <th className="p-2 font-medium text-right">Amount</th>
                  <th className="p-2 font-medium">Created</th>
                  <th className="p-2 font-medium">Razorpay</th>
                  <th className="p-2 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const label = OUTCOME_LABELS[r.outcome] ?? { text: r.outcome, className: "bg-muted" };
                  return (
                    <tr key={r.donationId} className="border-t align-top">
                      <td className="p-2">
                        <div className="font-medium">{r.donorName}</div>
                        <div className="text-muted-foreground">{r.donorPhone}</div>
                      </td>
                      <td className="p-2 text-right">₹{fmt(r.amount)}</td>
                      <td className="p-2 whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="p-2">
                        <span className={`inline-block rounded px-2 py-0.5 font-medium ${label.className}`}>
                          {r.applied ? "✓ " : ""}
                          {label.text}
                        </span>
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {r.result || r.reason}
                        {r.attempts?.length > 0 && (
                          <div className="mt-0.5 font-mono text-[10px]">
                            {r.attempts.map((a) => `${a.id} ${a.status}`).join(" · ")}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {appliedOnce && (
            <p className="text-xs text-muted-foreground">
              Applied. Press Check now again to see what is still pending.
            </p>
          )}
        </>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={(open) => !applying && setConfirmOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply Razorpay results?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">{willSucceed.length}</strong>{" "}
                  paid donations become success. Each is re-checked with Razorpay
                  first, then its receipt, WhatsApp and DCC entry go out.
                </p>
                <p>
                  <strong className="text-foreground">{willFail.length}</strong>{" "}
                  donations are marked failed. No receipt or message is sent.
                </p>
                {applying && <p>Working… keep this window open.</p>}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={applying}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={apply} disabled={applying}>
              {applying ? "Applying…" : "Apply"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
