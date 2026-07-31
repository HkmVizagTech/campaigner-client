import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/api";
import { toast } from "@/utils/toast";
import { Download, Copy } from "lucide-react";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const StatusBadge = ({ status }) => {
  const map = {
    success: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const CopyableId = ({ value }) => {
  if (!value) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success("Copied");
      }}
      className="flex items-center gap-1 text-xs font-mono hover:text-primary transition-colors group"
      title="Click to copy"
    >
      {value}
      <Copy className="h-3 w-3 opacity-0 group-hover:opacity-60" />
    </button>
  );
};

const FundersWithOrderId = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [funders, setFunders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const fetchFunders = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      const p = params.page || page;
      query.set("page", p);
      query.set("pageSize", 50);
      if ((params.fromDate ?? fromDate)) query.set("fromDate", params.fromDate ?? fromDate);
      if ((params.toDate ?? toDate)) query.set("toDate", params.toDate ?? toDate);
      if ((params.status ?? status) !== "all") query.set("status", params.status ?? status);

      const res = await api.get(`/dashboard/reports/funders-with-order-id?${query.toString()}`);
      setFunders(res.data?.data?.funders || []);
      setPagination(res.data?.data?.pagination || null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch funders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunders({ page: 1 });
  }, []);

  const handleApply = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast.error("From date cannot be after To date");
      return;
    }
    setPage(1);
    fetchFunders({ fromDate, toDate, status, page: 1 });
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setStatus("all");
    setPage(1);
    fetchFunders({ fromDate: "", toDate: "", status: "all", page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchFunders({ page: newPage });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const query = new URLSearchParams();
      query.set("page", 1);
      query.set("pageSize", 10000);
      if (fromDate) query.set("fromDate", fromDate);
      if (toDate) query.set("toDate", toDate);
      if (status !== "all") query.set("status", status);

      const res = await api.get(`/dashboard/reports/funders-with-order-id?${query.toString()}`, {
        timeout: 60000,
      });
      const all = res.data?.data?.funders || [];

      if (!all.length) {
        toast.error("No data to export");
        return;
      }

      const rows = [
        ["Donor Name", "Phone", "Amount", "Donation Status", "Payment Status", "Campaigner", "Razorpay Order ID", "Razorpay Payment ID", "Receipt No.", "Date"],
      ];
      all.forEach((f) => {
        rows.push([
          f.donorName,
          f.donorPhone,
          f.amount,
          f.donationStatus,
          f.paymentStatus || "",
          f.campaigner || "",
          f.gatewayOrderId || "",
          f.gatewayPaymentId || "",
          f.receiptNumber || "",
          new Date(f.createdAt).toLocaleString("en-IN"),
        ]);
      });

      const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `funders-with-order-id-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1.5">
            <Label>From Date</Label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>To Date</Label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApply} disabled={loading} className="flex-1">
              {loading ? "Loading..." : "Apply"}
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={loading}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pagination?.total ?? 0} donation{pagination?.total !== 1 ? "s" : ""} found
        </p>
        <Button variant="outline" onClick={handleExport} disabled={exporting} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-2">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 bg-muted rounded animate-pulse" />)}
          </div>
        ) : funders.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No donations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground text-xs border-b">
                  <th className="text-left px-4 py-3">Donor</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Campaigner</th>
                  <th className="text-left px-4 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Payment ID</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {funders.map((f) => (
                  <tr key={f.donationId} className="border-t hover:bg-muted/20">
                    <td className="px-4 py-2.5">
                      <p className="font-medium">{f.donorName}</p>
                      <p className="text-xs text-muted-foreground">{f.donorPhone}</p>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium">₹{fmt(f.amount)}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={f.donationStatus} /></td>
                    <td className="px-4 py-2.5 text-muted-foreground">{f.campaigner || "—"}</td>
                    <td className="px-4 py-2.5"><CopyableId value={f.gatewayOrderId} /></td>
                    <td className="px-4 py-2.5"><CopyableId value={f.gatewayPaymentId} /></td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(f.createdAt).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Page {pagination.page} of {pagination.pages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={pagination.page <= 1 || loading} onClick={() => handlePageChange(pagination.page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages || loading} onClick={() => handlePageChange(pagination.page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundersWithOrderId;
