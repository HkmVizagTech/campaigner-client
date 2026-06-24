import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "@/store/auth/auth.service";
import { toast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginLoading: loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await dispatch(adminLogin(form)).unwrap();
    console.log(result);
    if (!result?.data?.isPasswordChanged) {
      navigate("/auth/reset-password");
      return;
    }
    if (result?.success) {
      toast.success("Welcome Back!");
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.45)_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="order-1 lg:order-1">
            <div className="overflow-hidden rounded-3xl border bg-card shadow-xl">
              <div className="relative h-60 sm:h-72 lg:h-[620px]">
                <img
                  src="https://pub-f62a54aab54448388c9e16334109aea9.r2.dev/Temple%2520Images/govindaFrontView.jpg"
                  alt="ISKCON temple"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-8">
                  <div className="max-w-xl space-y-3 text-white">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/75">
                      ISKCON Visakhapatnam
                    </p>
                    <h1 className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
                      Support the sacred mission with a clear and secure admin
                      workspace.
                    </h1>
                    <p className="max-w-lg text-sm text-white/80 sm:text-base">
                      Manage campaigners, funders, sevas, and temple outreach
                      from one place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t bg-card px-5 py-4 sm:px-6">
                <p className="text-sm italic text-muted-foreground">
                  “By serving the Lord and helping others serve Him, one attains
                  the highest perfection.”
                </p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  Srila Prabhupada
                </p>
              </div>
            </div>
          </div>

          <div className="order-2 flex items-center lg:order-2">
            <Card className="w-full rounded-3xl border bg-card/95 shadow-xl backdrop-blur">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="mb-6 text-center lg:text-left">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                    Admin Sign In
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                    Access Campaign Dashboard
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Access your campaigns, donations, and temple operations
                    securely.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label>Email</Label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                      <Input
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        className="h-11 rounded-xl pl-9"
                      />
                    </div>

                    {errors.email && (
                      <p className="text-destructive text-xs">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Password</Label>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        className="h-11 rounded-xl pl-9 pr-11"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-3 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-destructive text-xs">
                        {errors.password}
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
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6 rounded-2xl border bg-muted/30 px-4 py-3 text-center lg:text-left">
                  <p className="text-xs text-muted-foreground">
                    Hare Krishna. Safe and secure access for campaign
                    operations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
