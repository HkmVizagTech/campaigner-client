import { useState } from "react";
import { Send } from "lucide-react";
import api from "@/api/api";
import { toast } from "@/utils/toast";
import { Button } from "@/components/ui/button";
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

// Sending goes campaigner by campaigner, so allow far longer than the
// default API timeout.
const SEND_TIMEOUT_MS = 5 * 60 * 1000;

export default function ResendCampaignerLinks({ campaignId }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = (dryRun) =>
    api.post(
      "/campaigner/resend-links",
      { campaignId, dryRun },
      { timeout: dryRun ? undefined : SEND_TIMEOUT_MS },
    );

  const handleOpen = async () => {
    setPreview(null);
    setResult(null);
    setOpen(true);
    setLoading(true);
    try {
      const res = await request(true);
      setPreview(res.data?.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load campaigners");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await request(false);
      const data = res.data?.data;
      setResult(data);
      if (data?.failed?.length) {
        toast.warning(res.data?.message);
      } else {
        toast.success(res.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Sending links failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full gap-2 sm:w-auto"
        onClick={handleOpen}
        disabled={!campaignId}
      >
        <Send className="h-4 w-4" />
        Resend page links
      </Button>

      <AlertDialog open={open} onOpenChange={(next) => !loading && setOpen(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {result ? "Links sent" : "Resend page links on WhatsApp?"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm text-muted-foreground">
                {!preview && loading && <p>Counting approved campaigners…</p>}

                {preview && !result && (
                  <p>
                    Every approved campaigner of{" "}
                    <span className="font-medium text-foreground">
                      {preview.campaign}
                    </span>{" "}
                    will get their campaign page link on WhatsApp again:{" "}
                    <span className="font-medium text-foreground">
                      {preview.total}
                    </span>{" "}
                    {preview.total === 1 ? "message" : "messages"}.
                    {loading && " Sending… keep this window open."}
                  </p>
                )}

                {result && (
                  <>
                    <p>
                      Sent {result.sent} of {result.total}.
                    </p>
                    {result.failed?.length > 0 && (
                      <div className="max-h-48 overflow-y-auto rounded-md border p-2">
                        <p className="mb-1 font-medium text-foreground">
                          Not sent ({result.failed.length})
                        </p>
                        <ul className="space-y-1">
                          {result.failed.map((item) => (
                            <li key={item.id}>
                              <span className="text-foreground">
                                {item.name}
                              </span>
                              : {item.reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {result ? (
              <AlertDialogAction onClick={() => setOpen(false)}>
                Done
              </AlertDialogAction>
            ) : (
              <>
                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSend}
                  disabled={loading || !preview?.total}
                >
                  {loading && preview ? "Sending…" : `Send ${preview?.total ?? ""}`}
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
