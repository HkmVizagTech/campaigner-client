import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getCampaignsList } from "@/store/campaign/campaign.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/api";
import { toast } from "@/utils/toast";
import {
  ChevronDown,
  ChevronRight,
  Users,
  IndianRupee,
  Heart,
  Download,
} from "lucide-react";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    close: "bg-gray-100 text-gray-600",
    reject: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

const DevoteeReport = () => {
  const dispatch = useDispatch();
  const { campaignsList } = useSelector((state) => state.campaign);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignId, setCampaignId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    dispatch(getCampaignsList({ page: 1, pageSize: 50 }));
    fetchReport();
  }, [dispatch]);

  const fetchReport = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.fromDate) query.set("fromDate", params.fromDate);
      if (params.toDate) query.set("toDate", params.toDate);
      if (params.campaignId && params.campaignId !== "all")
        query.set("campaignId", params.campaignId);

      const res = await api.get(
        `/dashboard/reports/devotee-summary?${query.toString()}`,
      );
      setData(res.data?.data);

      // Expand all devotees by default
      const expandMap = {};
      (res.data?.data?.devotees || []).forEach((d) => {
        expandMap[d._id] = true;
      });
      setExpanded(expandMap);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast.error("From date cannot be after To date");
      return;
    }
    fetchReport({ fromDate, toDate, campaignId });
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setCampaignId("all");
    fetchReport();
  };

  const toggleDevotee = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleExport = () => {
    if (!data?.devotees?.length) return;

    const rows = [["Devotee", "Short Form", "Campaigner", "Status", "Raised (₹)", "Donors"]];
    data.devotees.forEach((d) => {
      d.campaigners.forEach((c, i) => {
        rows.push([
          i === 0 ? d.devoteeName : "",
          i === 0 ? d.shortForm : "",
          c.name,
          c.status,
          c.raisedAmount,
          c.donorCount,
        ]);
      });
      rows.push(["", "", "SUBTOTAL", "", d.totalRaised, d.donorCount]);
      rows.push([]);
    });
    rows.push(["GRAND TOTAL", "", "", "", data.grandTotal.totalRaised, data.grandTotal.donorCount]);

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devotee-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Devotee Report</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Donation summary grouped by devotee and their campaigners
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={!data?.devotees?.length}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1.5">
            <Label>From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
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

      {/* Summary cards */}
      {data && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Devotees</span>
            </div>
            <p className="text-2xl font-semibold">
              {data.devotees?.length || 0}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <IndianRupee className="h-4 w-4" />
              <span className="text-xs">Total Raised</span>
            </div>
            <p className="text-2xl font-semibold">
              ₹{fmt(data.grandTotal?.totalRaised)}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">Total Donors</span>
            </div>
            <p className="text-2xl font-semibold">
              {fmt(data.grandTotal?.donorCount)}
            </p>
          </Card>
        </div>
      )}

      {/* Devotee rows */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-5 bg-muted rounded w-48" />
            </Card>
          ))}
        </div>
      )}

      {!loading && data?.devotees?.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          No data found for the selected filters.
        </Card>
      )}

      {!loading &&
        data?.devotees?.map((devotee) => (
          <Card key={devotee._id} className="overflow-hidden">
            {/* Devotee header row */}
            <button
              onClick={() => toggleDevotee(devotee._id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {devotee.shortForm || devotee.devoteeName?.charAt(0)}
                </span>
                <div>
                  <p className="font-medium">{devotee.devoteeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {devotee.shortForm} · {devotee.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Raised</p>
                  <p className="font-semibold text-green-700">
                    ₹{fmt(devotee.totalRaised)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Donors</p>
                  <p className="font-semibold">{fmt(devotee.donorCount)}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Campaigners</p>
                  <p className="font-semibold">{devotee.campaigners?.length}</p>
                </div>
                {expanded[devotee._id] ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Campaigner sub-rows */}
            {expanded[devotee._id] && (
              <div className="border-t">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 text-muted-foreground text-xs">
                      <th className="text-left px-4 py-2 pl-14">Campaigner</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-right px-4 py-2">Raised</th>
                      <th className="text-right px-4 py-2">Donors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devotee.campaigners
                      .slice()
                      .sort((a, b) => b.raisedAmount - a.raisedAmount)
                      .map((c) => (
                        <tr
                          key={c._id}
                          className="border-t border-muted/50 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-2.5 pl-14 font-medium">
                            {c.name}
                          </td>
                          <td className="px-4 py-2.5">
                            <StatusBadge status={c.status} />
                          </td>
                          <td className="px-4 py-2.5 text-right text-green-700 font-medium">
                            ₹{fmt(c.raisedAmount)}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            {c.donorCount}
                          </td>
                        </tr>
                      ))}
                    {/* Devotee subtotal row */}
                    <tr className="border-t border-muted bg-muted/20 font-semibold text-sm">
                      <td className="px-4 py-2 pl-14 text-muted-foreground">
                        Subtotal
                      </td>
                      <td />
                      <td className="px-4 py-2 text-right text-green-700">
                        ₹{fmt(devotee.totalRaised)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {devotee.donorCount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ))}
    </div>
  );
};

export default DevoteeReport;

// Tab wrapper — exported as default from Reports/index.jsx
