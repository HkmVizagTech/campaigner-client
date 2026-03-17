import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentErrorPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const message =
    state?.message ||
    "We could not confirm your payment right now. If the amount was debited, the status will be updated shortly.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-xl md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-foreground">
          Payment Verification Pending
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {message}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={() => navigate(-1)}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
