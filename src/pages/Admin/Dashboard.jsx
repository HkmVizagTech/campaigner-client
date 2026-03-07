import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Wallet, Users, HeartHandshake, Target } from "lucide-react";
import api from "@/api/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [campaigners, setCampaigners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryRes, trendRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/donation-trend"),
      ]);

      setSummary(summaryRes.data?.data || {});
      setTrend(trendRes.data?.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* PAGE TITLE */}

      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Campaign performance overview
        </p>
      </div>

      {/* CARDS */}

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Target Amount</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `₹${summary?.targetAmount?.toLocaleString("en-IN") || 0}`}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Raised</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `₹${summary?.totalRaised?.toLocaleString("en-IN") || 0}`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Donations</CardTitle>
            <HeartHandshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : summary?.totalDonations || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Active Campaigners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : summary?.activeCampaigners || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DONATION TREND CHART */}

      <Card>
        <CardHeader>
          <CardTitle>Daily Donation Trend</CardTitle>
        </CardHeader>

        <CardContent>
          {trend.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 text-sm">
              No donation data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-chart-1)"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* TOP CAMPAIGNERS TABLE */}

      <Card>
        <CardHeader>
          <CardTitle>Top Campaigners</CardTitle>
        </CardHeader>

        <CardContent>
          {campaigners.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 text-sm">
              No campaigner performance data
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Raised</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {campaigners.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{c.name}</TableCell>

                    <TableCell>₹{c.targetAmount}</TableCell>

                    <TableCell>₹{c.raisedAmount}</TableCell>

                    <TableCell>{c.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
