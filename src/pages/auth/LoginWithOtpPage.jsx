import { useState } from "react";
import { Loader2, Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { forgotPassword, adminLoginWithOtp } from "@/store/auth/auth.service";
import { toast } from "@/utils/toast";
import { useNavigate, Link } from "react-router-dom";

const LoginWithOtpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // "email" | "otp"
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setLoading(true);
    try {
      // Same endpoint as forgot-password: it just sends the WhatsApp OTP.
      await dispatch(
        forgotPassword({ email: email.trim().toLowerCase() }),
      ).unwrap();
      setStep("otp");
    } catch {
      // toast already shown by the thunk
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    sendOtp();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await dispatch(
        adminLoginWithOtp({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      ).unwrap();
      if (result?.success) {
        toast.success("Welcome Back!");
        navigate("/admin/dashboard");
      }
    } catch {
      // toast already shown by the thunk
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md rounded-3xl border bg-card/95 shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              OTP Login
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              {step === "email" ? "Login with WhatsApp OTP" : "Enter OTP"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "email"
                ? "We'll send a one-time code to the WhatsApp number linked to your account."
                : `A 6-digit code was sent to the WhatsApp number linked to ${email}`}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
                {error && <p className="text-destructive text-xs">{error}</p>}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl text-base font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-1.5">
                <Label>OTP</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="6-digit code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      setError("");
                    }}
                    className="h-11 rounded-xl pl-9 tracking-widest"
                  />
                </div>
                {error && <p className="text-destructive text-xs">{error}</p>}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl text-base font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Didn't get the code? Resend OTP
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/admin/login" className="text-sm text-primary hover:underline">
              Back to password login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginWithOtpPage;
