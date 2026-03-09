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

import {
  Wallet,
  Users,
  HeartHandshake,
  Target,
  Crown,
  Award,
  Medal,
} from "lucide-react";
import api from "@/api/api";
import { useDispatch, useSelector } from "react-redux";
import { getCampainer } from "@/store/campaigners/campaigners.service";
import { getCurrentCampaign } from "@/store/campaign/campaign.service";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const { campaginers } = useSelector((state) => state.campaginer);
  const { currentCampaign } = useSelector((state) => state.campaign);

  useEffect(() => {
    dispatch(getCurrentCampaign());
  }, [dispatch]);

  useEffect(() => {
    if (!currentCampaign?._id) return;

    dispatch(
      getCampainer({
        id: currentCampaign?._id,
        status: "active",
        campStatus: "active",
        page: 1,
        pageSize: 10,
        sort: "raised_desc",
      }),
    );
  }, [currentCampaign?._id, dispatch]);
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

  const sevaBadges = [
    "SEVA SHIROMANI", // Top 1
    "SEVA RATNA", // Top 2
    "SEVA BHUSHAN", // Top 3
    "SEVA VIBHUSHAN", // Top 4
    "SEVA VIBHAVA", // Top 5
    "SEVA SHRESHTA", // Top 6
    "SEVA PRAMUKH", // Top 7
    "SEVA SAMARPIT", // Top 8
    "SEVA SADHAK", // Top 9
    "SEVA BANDHU", // Top 10
  ];

  const topThreeIcons = [<Crown />, <Award />, <Medal />];
  const rankStyles = [
    "text-yellow-500", // 🥇 Gold
    "text-gray-400", // 🥈 Silver
    "text-amber-700", // 🥉 Bronze
  ];

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

      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Target Amount</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "..."
                : `₹${summary?.targetAmount?.toLocaleString("en-IN") || 0}`}
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
              {loading
                ? "..."
                : `₹${summary?.totalRaised?.toLocaleString("en-IN") || 0}`}
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Pending Campaigners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : summary?.pendingCampaigners || 0}
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
          {campaginers?.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 text-sm">
              No campaigner performance data
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-17.5">Rank</TableHead>
                  <TableHead className="w-40">Name</TableHead>
                  <TableHead className="w-40">Target</TableHead>
                  <TableHead className="w-40">Raised</TableHead>
                  <TableHead className="w-65">Progress</TableHead>
                  <TableHead className="w-65">Badge</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {campaginers?.map((c, i) => {
                  const isTop = i < 3;

                  return (
                    <TableRow
                      key={i}
                      className={isTop ? "bg-primary/5 font-medium" : ""}
                    >
                      <TableCell className="font-semibold">#{i + 1}</TableCell>

                      <TableCell className="font-medium">{c.name}</TableCell>

                      <TableCell>
                        ₹{c.targetAmount?.toLocaleString("en-IN")}
                      </TableCell>

                      <TableCell className="font-semibold text-primary">
                        ₹{c.raisedAmount?.toLocaleString("en-IN")}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 w-55">
                          <Progress
                            value={c?.percentage}
                            className="h-2 bg-muted"
                          />
                          <span className="text-xs text-muted-foreground">
                            {c?.percentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {i < 3 && c.raisedAmount >= 100 && (
                            <span className={`text-lg ${rankStyles[i]}`}>
                              {topThreeIcons[i]}
                            </span>
                          )}
                          {c.raisedAmount >= 100 ? (
                            <Badge variant="secondary">{sevaBadges[i]}</Badge>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
