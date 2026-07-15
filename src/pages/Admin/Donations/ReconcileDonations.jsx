import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/api";
import { toast } from "@/utils/toast";
import { RefreshCw, Search, CheckCircle2, Clock, ShieldAlert } from "lucide-react";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const ReconcileDonations = () => {
  const [donationId, setDonationId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [looking, setLooking] = useState(false);
  const [reconciling, setReconciling] = useState(false);

  const [pending, setPending] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditFromDate, setAuditFromDate] = useState("");
  const [auditToDate, setAuditToDate] = useState("");
  const [correctingId, setCorrectingId] = useState(null);

  const fetchPending = async () => {
    setLoadingPending(true);
    try {
      const res = await api.get("/dashboard/pending-donations");
      setPending(res.data?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch pending donations");
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleLookup = async () => {
    if (!donationId.trim()) {
      toast.error("Enter a donation ID");
      return;
    }
    setLooking(true);
    setLookupResult(null);
    try {
      const res = await api.get(`/dashboard/donation-lookup/${donationId.trim()}`);
      setLookupResult(res.data?.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Donation not found");
    } finally {
      setLooking(false);
    }
  };

  const handleReconcile = async () => {
    if (!donationId.trim() || !paymentId.trim()) {
      toast.error("Both Donation ID and Razorpay Payment ID are required");
      return;
    }
    setReconciling(true);
    try {
      const res = await api.post("/dashboard/reconcile-donation", {
        donationId: donationId.trim(),
        paymentId: paymentId.trim(),
      });
      toast.success(res.data?.message || "Donation reconciled successfully");
      setLookupResult((prev) =>
        prev
          ? { ...prev, donation: { ...prev.donation, ...res.data?.data } }
          : null,
      );
      fetchPending();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reconcile failed");
    } finally {
      setReconciling(false);
    }
  };

  const selectPendingRow = (row) => {
    setDonationId(row._id);
    setPaymentId("");
    setLookupResult(null);
  };

  const handleAudit = async () => {
    setAuditing(true);
    setAuditResult(null);
    try {
      const query = new URLSearchParams();
      if (auditFromDate) query.set("fromDate", auditFromDate);
      if (auditToDate) query.set("toDate", auditToDate);

      const res = await api.get(`/dashboard/audit-donations?${query.toString()}`, {
        timeout: 60000, // this checks each donation against Razorpay, can take longer than default
      });
      setAuditResult(res.data?.data);

      const { totalMismatches } = res.data?.data || {};
      if (totalMismatches > 0) {
        toast.error(`Found ${totalMismatches} donation(s) marked success that Razorpay disputes`);
      } else {
        toast.success("All checked donations match Razorpay records");
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        toast.error("Audit timed out — try a narrower date range");
      } else {
        toast.error(err?.response?.data?.message || err.message || "Audit failed");
      }
    } finally {
      setAuditing(false);
    }
  };

  const useAuditMismatch = (m) => {
    setDonationId(m.donationId);
    setPaymentId(m.gatewayPaymentId || "");
    setLookupResult(null);
  };

  const handleCorrect = async (m) => {
    if (
      !window.confirm(
        `Mark ${m.donorName}'s donation (₹${fmt(m.amount)}) as failed and reverse the raised amount from ${m.campaigner || "the campaigner"}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setCorrectingId(m.donationId);
    try {
      const res = await api.post("/dashboard/correct-mismatched-donation", {
        donationId: m.donationId,
      });
      toast.success(res.data?.message || "Corrected successfully");
      setAuditResult((prev) => ({
        ...prev,
        mismatches: prev.mismatches.filter((x) => x.donationId !== m.donationId),
        totalMismatches: prev.totalMismatches - 1,
      }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Correction failed");
    } finally {
      setCorrectingId(null);
    }
  };

  return (
    <div className="p-4 space-y-5 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold">Reconcile Donations</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Use this when a payment succeeded on Razorpay but the donation
          wasn't captured (donor closed the browser, webhook missed it, etc.)
        </p>
      </div>

      {/* Lookup + Reconcile form */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Donation ID</Label>
            <Input
              placeholder="e.g. 6a3f57a52d53aa4b51f3471c"
              value={donationId}
              onChange={(e) => setDonationId(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Razorpay Payment ID</Label>
            <Input
              placeholder="e.g. pay_T6WzRiNiYtzlFN"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleLookup}
            disabled={looking}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {looking ? "Looking up..." : "Lookup Donation"}
          </Button>
          <Button
            onClick={handleReconcile}
            disabled={reconciling || !lookupResult}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {reconciling ? "Reconciling..." : "Reconcile Now"}
          </Button>
        </div>

        {!lookupResult && (
          <p className="text-xs text-muted-foreground">
            Lookup the donation first to confirm it's the right one before reconciling.
          </p>
        )}

        {lookupResult && (
          <div className="rounded-md border p-3 bg-muted/30 text-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-medium">{lookupResult.donation.donorName}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  lookupResult.donation.status === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {lookupResult.donation.status}
              </span>
            </div>
            <p className="text-muted-foreground">
              ₹{fmt(lookupResult.donation.amount)} · {lookupResult.donation.donorPhone} ·{" "}
              {lookupResult.donation.campaigner?.name || "No campaigner"}
            </p>
            <p className="text-xs text-muted-foreground">
              Created: {new Date(lookupResult.donation.createdAt).toLocaleString("en-IN")}
            </p>
            {lookupResult.donation.receiptNumber && (
              <p className="text-xs text-muted-foreground">
                Receipt: {lookupResult.donation.receiptNumber}
              </p>
            )}
            {!lookupResult.payment?.gatewayOrderId && (
              <p className="text-xs text-red-600">
                ⚠ No Razorpay order found for this donation — cannot reconcile.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Audit section */}
      <Card className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            Audit Donations Against Razorpay
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Re-checks every donation currently marked "success" directly with
            Razorpay's records. Flags any that Razorpay disputes — these may
            have had a receipt/WhatsApp sent incorrectly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="space-y-1.5">
            <Label>From Date (optional)</Label>
            <Input
              type="date"
              value={auditFromDate}
              onChange={(e) => setAuditFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>To Date (optional)</Label>
            <Input
              type="date"
              value={auditToDate}
              onChange={(e) => setAuditToDate(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAudit}
            disabled={auditing}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <ShieldAlert className="h-4 w-4" />
            {auditing ? "Auditing..." : "Run Audit"}
          </Button>
        </div>

        {auditResult && (
          <div className="rounded-md border p-3 bg-muted/30 text-sm space-y-3">
            <p>
              Checked <strong>{auditResult.totalChecked}</strong> donation(s) —{" "}
              <span
                className={
                  auditResult.totalMismatches > 0
                    ? "text-red-600 font-medium"
                    : "text-green-700 font-medium"
                }
              >
                {auditResult.totalMismatches} mismatch(es) found
              </span>
            </p>

            {auditResult.mismatches?.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b">
                      <th className="py-1.5 pr-3">Donor</th>
                      <th className="py-1.5 pr-3">Amount</th>
                      <th className="py-1.5 pr-3">Campaigner</th>
                      <th className="py-1.5 pr-3">Razorpay Status</th>
                      <th className="py-1.5 pr-3">Receipt</th>
                      <th className="py-1.5 pr-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditResult.mismatches.map((m) => (
                      <tr key={m.donationId} className="border-b border-muted/50">
                        <td className="py-1.5 pr-3">{m.donorName}</td>
                        <td className="py-1.5 pr-3">₹{fmt(m.amount)}</td>
                        <td className="py-1.5 pr-3">{m.campaigner || "—"}</td>
                        <td className="py-1.5 pr-3">
                          <span
                            className={`px-1.5 py-0.5 rounded-full ${
                              m.needsManualCheck
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {m.needsManualCheck ? "Not on Razorpay — check manually" : m.razorpayStatus}
                          </span>
                        </td>
                        <td className="py-1.5 pr-3">{m.receiptNumber || "—"}</td>
                        <td className="py-1.5 pr-3 flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => useAuditMismatch(m)}
                          >
                            Investigate
                          </Button>
                          {!m.needsManualCheck && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCorrect(m)}
                              disabled={correctingId === m.donationId}
                            >
                              {correctingId === m.donationId ? "Correcting..." : "Correct"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="text-xs text-yellow-700 mt-2">
                  ⚠ Rows marked "Not on Razorpay — check manually" have no Correct
                  button on purpose. A missing payment ID is usually a test/live
                  API key mismatch on our side, not proof the donation is fake —
                  verify directly in the Razorpay dashboard before doing anything.
                </p>
              </div>
            )}

            {auditResult.transientErrors?.length > 0 && (
              <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3">
                <p className="text-xs font-medium text-yellow-800 mb-1">
                  ⚠ {auditResult.transientErrors.length} donation(s) couldn't be verified right now
                  (network/rate-limit issue) — these are NOT flagged as problems, just re-run the
                  audit to check them again:
                </p>
                <ul className="text-xs text-yellow-700 space-y-0.5">
                  {auditResult.transientErrors.map((e) => (
                    <li key={e.donationId}>
                      {e.donorName} — {e.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Pending donations list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            Pending / Failed Donations ({pending.length})
          </h3>
          <Button variant="ghost" size="sm" onClick={fetchPending} disabled={loadingPending}>
            <RefreshCw className={`h-4 w-4 ${loadingPending ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <Card className="overflow-hidden">
          {loadingPending ? (
            <div className="p-6 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              No pending donations — everything is reconciled.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground text-xs border-b">
                  <th className="text-left px-4 py-2">Donor</th>
                  <th className="text-left px-4 py-2">Campaigner</th>
                  <th className="text-right px-4 py-2">Amount</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {pending.map((row) => (
                  <tr key={row._id} className="border-t hover:bg-muted/20">
                    <td className="px-4 py-2.5">
                      <p className="font-medium">{row.donorName}</p>
                      <p className="text-xs text-muted-foreground">{row.donorPhone}</p>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {row.campaigner?.name || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium">
                      ₹{fmt(row.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {new Date(row.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectPendingRow(row)}
                      >
                        Use ID
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <p className="text-xs text-muted-foreground mt-2">
          Note: a donation stays "pending" briefly during normal checkout too —
          only reconcile ones you've confirmed as paid in the Razorpay dashboard.
        </p>
      </div>
    </div>
  );
};

export default ReconcileDonations;
