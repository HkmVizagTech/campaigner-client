import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordInputs({
  oldPassword,
  newPassword,
  onChange,
}) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="space-y-6">
      {/* OLD PASSWORD */}

      <div className="space-y-2">
        <Label htmlFor="oldPassword">Old Password</Label>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

          <Input
            id="oldPassword"
            name="oldPassword"
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={onChange}
            placeholder="Enter old password"
            className="pl-9 pr-10"
            required
          />

          <button
            type="button"
            onClick={() => setShowOld(!showOld)}
            className="absolute right-3 top-3 text-muted-foreground"
          >
            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* NEW PASSWORD */}

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

          <Input
            id="newPassword"
            name="newPassword"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={onChange}
            placeholder="Enter new password"
            className="pl-9 pr-10"
            required
          />

          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-3 text-muted-foreground"
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
