import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "@/store/auth/auth.service";
import { toast } from "react-toastify";
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-b from-background to-muted/40">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT SIDE */}
        <div className="hidden lg:block space-y-6">
          <img
            src="https://storage.googleapis.com/campaigners-images/Temple%20Images/govindaFrontView.jpg"
            className="rounded-2xl shadow-xl w-full h-105 object-cover"
          />

          <div className="bg-card border rounded-xl p-5">
            <p className="italic text-muted-foreground">
              “By serving the Lord and helping others serve Him, one attains the
              highest perfection.”
            </p>

            <p className="text-sm text-primary font-semibold mt-3">
              — Srila Prabhupada
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <Card className="border shadow-xl rounded-2xl">
          <CardContent className="p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold">Admin Login</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to manage temple campaigns
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div className="space-y-1">
                <Label>Email</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />

                  <Input
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>

                {errors.email && (
                  <p className="text-destructive text-xs">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <Label>Password</Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    className="pl-9 pr-9"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3.5 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password}</p>
                )}
              </div>

              {/* LOGIN BUTTON */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-semibold"
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

            <p className="text-xs text-muted-foreground text-center mt-6">
              Hare Krishna 🙏 Secure admin access
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
