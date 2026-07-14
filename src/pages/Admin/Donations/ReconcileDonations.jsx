import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/api";
import { toast } from "@/utils/toast";
import { RefreshCw, Search, CheckCircle2, Clock } from "lucide-react";

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

      {/* Pending donations list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            Pending Donations ({pending.length})
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
