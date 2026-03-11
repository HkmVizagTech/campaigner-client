import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import api from "@/api/api";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};
const openRazorPay = async (payload, navigate, setLoading) => {
  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    alert("Payment service failed to load");
    return;
  }
  setLoading(true);
  let res;

  try {
    res = await api.post("/donations/create-order", payload);
  } catch (error) {
    toast.error("Payment initialization failed. Please try again.");
    setLoading(false);
    return;
  }

  const { orderId, amount, currency, key, donationId } = res.data.data;

  const options = {
    key,
    amount,
    currency,
    order_id: orderId,
    name: "ISKCON VIZAG CAMPAIGN",
    description: "Donation",
    prefill: {
      name: payload.donorName,
      contact: payload.donorPhone,
      email: payload.email || "",
    },
    notes: {
      donationId,
    },
    handler: async function (res) {
      try {
        const result = await api.post("/payment/verify", {
          razorpay_order_id: res?.razorpay_order_id,
          razorpay_payment_id: res?.razorpay_payment_id,
          razorpay_signature: res?.razorpay_signature,
        });

        if (result?.status === 200) {
          toast.success("Payment successful. Thank you for your donation!");
          navigate(`/thankyou/${donationId}`);
        }
      } finally {
        setLoading(false);
      }
    },
    theme: {
      color: "#ffdf20",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", function (response) {
    setLoading(false);
    toast.error("Payment service failed to load");
  });

  rzp.open();
};

export function DonationDialog({
  open,
  onOpenChange,
  inputValue,
  sevaId,
  loading,
  setLoading,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    pan: "",
    tax: false,
    anonymous: false,
    prasadam: inputValue >= 999,
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState({});

  const { currentCampaign } = useSelector((state) => state.campaign);
  const { slug } = useParams();
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    setError((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;
    const newErrors = {};

    if (!formData?.anonymous && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter valid 10 digit mobile number";
    }

    if (formData.tax) {
      if (!formData.pan.trim()) {
        newErrors.pan = "PAN number is required for 80G exemption";
      } else if (!/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(formData.pan)) {
        newErrors.pan = "Enter valid PAN number";
      }
    }

    if (formData.tax || formData.prasadam) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }

      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }

      if (!formData.state) {
        newErrors.state = "State is required";
      }

      if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = "Enter valid 6 digit pincode";
      }
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    toast.info("Processing payment. Please don't refresh or close the page.");
    onOpenChange(false);

    const payload = {
      donorName: formData.name,
      donorPhone: formData.phoneNumber,
      amount: inputValue,
      campaignId: currentCampaign?._id,
      slug,
      isAnonymous: formData.anonymous,
      sevaId,
      prasadam: formData.prasadam,
    };

    if (formData.pan) payload.pan = formData.pan;
    if (formData.email) payload.email = formData.email;

    if (formData.tax || formData.prasadam) {
      payload.address = {
        fullAddress: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };
    }

    await openRazorPay(payload, navigate, setLoading);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-1 max-h-150 overflow-hidden">
        <DialogHeader className="px-6 py-5 bg-muted">
          <DialogTitle className="text-lg font-semibold">
            Donation Summary
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            You are contributing
            <span className="font-bold text-primary ml-1">₹{inputValue}</span>
          </p>
        </DialogHeader>

        <div className="px-2 py-6 pb-10 space-y-6 overflow-y-auto max-h-130 pr-2 custom-scroll">
          {/* Personal Info */}
          <div className="space-y-3">
            <Input
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {error.name && (
              <p className="text-destructive text-sm">{error.name}</p>
            )}

            <Input
              placeholder="Mobile Number *"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
            {error.phoneNumber && (
              <p className="text-destructive text-sm">{error.phoneNumber}</p>
            )}

            <Input
              placeholder="Email (Optional)"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="space-y-4 rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={formData.tax}
                onCheckedChange={(v) => handleChange("tax", v === true)}
              />
              <Label className="text-sm">Claim 80G Tax Exemption</Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                checked={formData.anonymous}
                onCheckedChange={(v) => handleChange("anonymous", v === true)}
              />
              <Label className="text-sm">Make my donation anonymous</Label>
            </div>

            {inputValue >= 999 && (
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={formData.prasadam}
                  onCheckedChange={(v) => handleChange("prasadam", v === true)}
                />
                <Label className="text-sm">
                  Receive Prasadam for this donation
                </Label>
              </div>
            )}
          </div>

          {/* Certificate / Address Details */}
          {(formData.tax || formData.prasadam) && (
            <div className="space-y-4 rounded-2xl border border-border p-4">
              <p className="font-semibold text-sm">Address Details</p>

              {formData.tax && (
                <>
                  <Input
                    placeholder="PAN Number *"
                    value={formData.pan}
                    onChange={(e) =>
                      handleChange("pan", e.target.value.toUpperCase())
                    }
                  />
                  {error.pan && (
                    <p className="text-destructive text-sm">{error.pan}</p>
                  )}
                </>
              )}

              <Input
                placeholder="Full Address *"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              {error.address && (
                <p className="text-destructive text-sm">{error.address}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City *"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                {error.city && (
                  <p className="text-destructive text-sm">{error.city}</p>
                )}

                <select
                  className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                >
                  <option value="">Select State *</option>

                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                placeholder="Pincode *"
                value={formData.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
              />
              {error.pincode && (
                <p className="text-destructive text-sm">{error.pincode}</p>
              )}
            </div>
          )}

          <Button
            className="
              w-full h-12 text-base font-semibold rounded-xl
              bg-linear-to-r from-primary to-primary/90
              text-primary-foreground
              shadow-md hover:shadow-lg
            "
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              "🔒 Pay Securely"
            )}
          </Button>
          {loading && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Processing payment... please do not refresh or close this page
            </p>
          )}

          <p className="text-xs text-muted-foreground text-center">
            100% secure payments
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
