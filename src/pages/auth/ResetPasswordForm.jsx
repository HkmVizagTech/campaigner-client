import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/store/auth/auth.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ResetPasswordInputs from "./ResetPasswordInputs";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(resetPassword(form)).unwrap();
      if (response?.success) {
        toast.success("Password reset successfully");
        sessionStorage.clear();
        navigate("/admin/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 p-6 bg-card rounded-lg shadow"
      >
        <ResetPasswordInputs
          oldPassword={form.oldPassword}
          newPassword={form.newPassword}
          onChange={handleChange}
        />

        <Button disabled={loginLoading} type="submit" className="w-full">
          {loginLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
}
