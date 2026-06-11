import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Download, Package } from "lucide-react";
import { getCampaignsList } from "@/store/campaign/campaign.service";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const PrasadamReport = () => {
  const dispatch = useDispatch();
  const { campaignsList } = useSelector((state) => state.campaign);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignId, setCampaignId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [donors, setDonors] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getCampaignsList({ page: 1, pageSize: 50 }));
    fetchReport({ page: 1 });
  }, [dispatch]);

  const fetchReport = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      const p = params.page || page;
      query.set("page", p);
      query.set("pageSize", 50);
      if (params.fromDate ?? fromDate) query.set("fromDate", params.fromDate ?? fromDate);
      if (params.toDate ?? toDate) query.set("toDate", params.toDate ?? toDate);
      if ((params.campaignId ?? campaignId) !== "all")
        query.set("campaignId", params.campaignId ?? campaignId);

      const res = await api.get(`/dashboard/reports/prasadam?${query.toString()}`);
      setDonors(res.data?.data?.donors || []);
      setPagination(res.data?.data?.pagination || null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch prasadam donors");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast.error("From date cannot be after To date");
      return;
    }
    setPage(1);
    fetchReport({ fromDate, toDate, campaignId, page: 1 });
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setCampaignId("all");
    setPage(1);
    fetchReport({ fromDate: "", toDate: "", campaignId: "all", page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchReport({ page: newPage });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const query = new URLSearchParams();
      query.set("page", 1);
      query.set("pageSize", 10000); // fetch all
      if (fromDate) query.set("fromDate", fromDate);
      if (toDate) query.set("toDate", toDate);
      if (campaignId !== "all") query.set("campaignId", campaignId);

      const res = await api.get(`/dashboard/reports/prasadam?${query.toString()}`);
      const allDonors = res.data?.data?.donors || [];

      if (!allDonors.length) {
        toast.error("No data to export");
        return;
      }

      const rows = [
        ["#", "Donor Name", "Phone", "Email", "Amount (₹)", "Campaigner", "Address", "City", "State", "Pincode", "Receipt No.", "Date"],
      ];

      allDonors.forEach((d, i) => {
        rows.push([
          i + 1,
          d.donorName,
          d.donorPhone,
          d.donorEmail || "",
          d.amount,
          d.campaigner?.name || "",
          d.address?.fullAddress || "",
          d.address?.city || "",
          d.address?.state || "",
          d.address?.pincode || "",
          d.receiptNumber || "",
          new Date(d.createdAt).toLocaleDateString("en-IN"),
        ]);
      });

      const csv = rows
        .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prasadam-donors-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
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
            <Label>Campaign</Label>
            <Select value={campaignId} onValueChange={setCampaignId}>
              <SelectTrigger>
                <SelectValue placeholder="All campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All campaigns</SelectItem>
                {(campaignsList || []).map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name || c.title || c._id}
                  </SelectItem>
                ))}
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

      {/* Summary + Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>
            {pagination?.total ?? 0} donor{pagination?.total !== 1 ? "s" : ""} opted for Prasadam
          </span>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={!donors.length || exporting}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : donors.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No prasadam donors found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground text-xs border-b">
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">Donor</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Campaigner</th>
                  <th className="text-left px-4 py-3">Address</th>
                  <th className="text-left px-4 py-3">Receipt No.</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((d, i) => (
                  <tr
                    key={d._id}
                    className="border-t border-muted/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {((page - 1) * 50) + i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{d.donorName}</p>
                      {d.donorEmail && (
                        <p className="text-xs text-muted-foreground">{d.donorEmail}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">{d.donorPhone}</td>
                    <td className="px-4 py-3 text-right font-medium text-green-700">
                      ₹{fmt(d.amount)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {d.campaigner?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {d.address?.fullAddress ? (
                        <div>
                          <p className="text-xs leading-snug">{d.address.fullAddress}</p>
                          <p className="text-xs text-muted-foreground">
                            {[d.address.city, d.address.state, d.address.pincode]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">No address</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {d.receiptNumber || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || loading}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.pages || loading}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrasadamReport;
