import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { forgotPassword, resetPasswordWithOtp } from "@/store/auth/auth.service";
import { toast } from "@/utils/toast";
import { useNavigate, Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // "email" | "otp"
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Enter a valid email" });
      return;
    }

    setLoading(true);
    try {
      await dispatch(forgotPassword({ email: email.trim().toLowerCase() })).unwrap();
      setStep("otp");
    } catch {
      // toast already shown by the thunk
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!otp.trim() || otp.trim().length !== 6) {
      newErrors.otp = "Enter the 6-digit OTP";
    }
    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await dispatch(
        resetPasswordWithOtp({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
        }),
      ).unwrap();
      toast.success("Password reset successfully. Please log in.");
      navigate("/admin/login");
    } catch {
      // toast already shown by the thunk
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await dispatch(forgotPassword({ email: email.trim().toLowerCase() })).unwrap();
    } catch {
      // toast already shown
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
              Forgot Password
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              {step === "email" ? "Reset your password" : "Enter OTP"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "email"
                ? "We'll send a one-time code to the phone number linked to your account."
                : `A 6-digit code was sent via WhatsApp to the phone linked to ${email}`}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({});
                    }}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs">{errors.email}</p>
                )}
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
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-1.5">
                <Label>OTP</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="otp"
                    placeholder="6-digit code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    className="h-11 rounded-xl pl-9 tracking-widest"
                  />
                </div>
                {errors.otp && (
                  <p className="text-destructive text-xs">{errors.otp}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 rounded-xl pl-9 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-destructive text-xs">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl text-base font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Didn't get the code? Resend OTP
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-primary hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
