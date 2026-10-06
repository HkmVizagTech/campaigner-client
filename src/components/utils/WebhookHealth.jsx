import { useEffect, useState } from "react";
import { Activity, RefreshCw } from "lucide-react";
import api from "@/api/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WEBHOOK_URL = `${(import.meta.env.VITE_APP_BASE_URL || "").replace(/\/+$/, "")}/webhooks/razorpay`;

const OK_OUTCOMES = new Set(["ok", "already_processed", "ignored", "not_found_logged", "accepted"]);

const timeAgo = (date) => {
  if (!date) return "never";
  const minutes = Math.round((Date.now() - new Date(date)) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours} h ago` : `${Math.round(hours / 24)} days ago`;
};

// Turns the last 24h of deliveries into one plain-language verdict.
const diagnose = (health) => {
  const counts = health?.last24h?.counts ?? {};
  if (!health) return null;
  if (!health.secretsConfigured || counts.not_configured) {
    return {
      tone: "bad",
      text: "The server has no webhook secret (RAZORPAY_WEBHOOK_SECRET), so it cannot check deliveries. Set it on the server to the secret shown for this webhook in Razorpay.",
    };
  }
  if (counts.invalid_signature) {
    return {
      tone: "bad",
      text: `${counts.invalid_signature} deliveries in the last 24 hours had the wrong signature: the secret saved for this webhook in Razorpay is not the one in RAZORPAY_WEBHOOK_SECRET. Make them the same (you can list old and new secrets separated by a comma during a change).`,
    };
  }
  if (counts.error_logged || counts.retry) {
    return {
      tone: "warn",
      text: `${(counts.error_logged || 0) + (counts.retry || 0)} deliveries hit an error in the last 24 hours (see below). Run Verify pending payments to settle any donation they missed.`,
    };
  }
  if (!health.last24h?.total) {
    return {
      tone: "warn",
      text: `No deliveries received in the last 24 hours. In Razorpay → Webhooks, check the webhook is enabled and its URL is exactly ${WEBHOOK_URL}`,
    };
  }
  return {
    tone: "good",
    text: `Working. Last payment processed ${timeAgo(health.lastProcessed?.receivedAt)}.`,
  };
};

const TONE_CLASSES = {
  good: "border-green-300 bg-green-50 text-green-900",
  warn: "border-amber-300 bg-amber-50 text-amber-900",
  bad: "border-red-300 bg-red-50 text-red-900",
};

export default function WebhookHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/dashboard/webhook-health");
      setHealth(res.data?.data ?? null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load webhook health");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verdict = diagnose(health);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Razorpay webhook health
        </h3>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading} aria-label="Refresh webhook health">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {verdict && (
        <div className={`rounded-md border px-3 py-2 text-sm ${TONE_CLASSES[verdict.tone]}`}>
          {verdict.text}
        </div>
      )}

      {health && (
        <>
          <p className="text-xs text-muted-foreground">
            Last delivery {timeAgo(health.lastReceivedAt)} · {health.last24h?.total ?? 0} in the
            last 24 hours · Webhook URL: <span className="font-mono">{WEBHOOK_URL}</span>
          </p>

          {health.recent?.length > 0 && (
            <div className="max-h-64 overflow-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted text-left">
                  <tr>
                    <th className="p-2 font-medium">Received</th>
                    <th className="p-2 font-medium">Event</th>
                    <th className="p-2 font-medium">Payment</th>
                    <th className="p-2 font-medium">Result</th>
                    <th className="p-2 font-medium text-right">Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {health.recent.map((row) => (
                    <tr key={row._id} className="border-t align-top">
                      <td className="p-2 whitespace-nowrap">
                        {new Date(row.receivedAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })}
                      </td>
                      <td className="p-2">{row.event || "—"}</td>
                      <td className="p-2 font-mono">{row.paymentId || "—"}</td>
                      <td className="p-2">
                        <span className={OK_OUTCOMES.has(row.outcome) ? "" : "font-medium text-red-700"}>
                          {row.outcome}
                        </span>
                        {row.error && <div className="text-muted-foreground">{row.error}</div>}
                      </td>
                      <td className="p-2 text-right whitespace-nowrap">
                        {row.httpStatus} · {row.durationMs} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
