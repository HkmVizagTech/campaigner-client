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
import { toast } from "@/utils/toast";

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

const navigateToPaymentError = (navigate, message) => {
  navigate("/payment-error", {
    state: { message },
  });
};

const openRazorPay = async (
  payload,
  navigate,
  setLoading,
  setIsProcessingPayment,
  onOpenChange,
) => {
  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    toast.error("Payment service failed to load");
    return;
  }
  setLoading(true);
  let res;

  try {
    res = await api.post("/donations/create-order", payload);
  } catch (error) {
    const message =
      error?.response?.status === 400
        ? error?.response?.data?.message || "Invalid request"
        : "Payment initialization failed. Please try again.";

    toast.error(message);
    setLoading(false);
    onOpenChange(false);
    return;
  }

  const { orderId, amount, currency, key, donationId } = res.data.data;
  setLoading(false);
  onOpenChange(false);

  const options = {
    key,
    amount,
    currency,
    order_id: orderId,
    name: "HARE KRISHNA MOMENT",
    description: "Donation",
    modal: {
      ondismiss: function () {
        setLoading(false);
        setIsProcessingPayment(false);
        toast.info("Payment cancelled.");
      },
    },
    prefill: {
      name: payload.donorName,
      contact: payload.donorPhone,
    },
    hidden: {
      email: true,
    },
    notes: {
      donationId,
    },
    handler: async function (res) {
      setIsProcessingPayment(true);

      try {
        const result = await api.post("/payment/verify", {
          razorpay_order_id: res?.razorpay_order_id,
          razorpay_payment_id: res?.razorpay_payment_id,
          razorpay_signature: res?.razorpay_signature,
        });

        const isVerified =
          result?.status === 200 &&
          result?.data?.success !== false &&
          [
            "Payment verified successfully",
            "Payment already processed",
          ].includes(result?.data?.message);

        if (isVerified) {
          navigate(`/thankyou/${donationId}`);
          return;
        }

        navigateToPaymentError(
          navigate,
          "Your payment was received, but we could not confirm it immediately. If the amount was debited, the donation status will be updated shortly.",
        );
      } catch {
        navigateToPaymentError(
          navigate,
          "We could not confirm your payment immediately. If the amount was debited, the status will be updated shortly.",
        );
      } finally {
        setIsProcessingPayment(false);
      }
    },
    theme: {
      color: "#ffdf20",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", function (response) {
    setLoading(false);
    setIsProcessingPayment(false);
    navigateToPaymentError(
      navigate,
      response?.error?.description || "Payment failed. Please try again.",
    );
  });

  rzp.open();
};

export function DonationDialog({
  open,
  onOpenChange,
  inputValue,
  sevaId,
  selectedSeva,
  loading,
  setLoading,
  setIsProcessingPayment,
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

    if (!formData.name.trim()) {
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
    const payload = {
      donorName: formData.name,
      donorPhone: formData.phoneNumber,
      amount: inputValue,
      campaignId: currentCampaign?._id,
      slug,
      isAnonymous: formData.anonymous,
      prasadam: formData.prasadam,
    };

    if (sevaId) {
      payload.sevaId = sevaId;
    }

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

    await openRazorPay(
      payload,
      navigate,
      setLoading,
      setIsProcessingPayment,
      onOpenChange,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100vw-1rem)] max-w-2xl flex-col overflow-hidden rounded-[28px] border border-border/70 bg-background p-0 shadow-2xl">
        <DialogHeader className="border-b border-border/60 bg-linear-to-b from-muted/60 to-background px-4 py-4 sm:px-6 sm:py-5">
          <DialogTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
            Donation Summary
          </DialogTitle>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Donation Amount
              </p>
              <p className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
                ₹{Number(inputValue || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Seva
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {selectedSeva?.sevaName || "General donation"}
              </p>
              {selectedSeva && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Recommended ₹
                  {Number(selectedSeva?.sevaAmount || 0).toLocaleString(
                    "en-IN",
                  )}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="custom-scroll flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {/* Personal Info */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Donor Information
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter the details needed for payment confirmation and receipt.
              </p>
            </div>

            <Input
              placeholder="Full Name *"
              className="h-11 rounded-xl"
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-z\s]*$/.test(value)) {
                  handleChange("name", value);
                }
              }}
            />
            {error.name && (
              <p className="text-destructive text-sm">{error.name}</p>
            )}

            <Input
              placeholder="Mobile Number *"
              className="h-11 rounded-xl"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
            {error.phoneNumber && (
              <p className="text-destructive text-sm">{error.phoneNumber}</p>
            )}

            <Input
              placeholder="Email (Optional)"
              className="h-11 rounded-xl"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Donation Preferences
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-3">
              <Checkbox
                checked={formData.tax}
                onCheckedChange={(v) => handleChange("tax", v === true)}
              />
              <Label className="text-sm">Claim 80G Tax Exemption</Label>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-3">
              <Checkbox
                checked={formData.anonymous}
                onCheckedChange={(v) => handleChange("anonymous", v === true)}
              />
              <Label className="text-sm">Make my donation anonymous</Label>
            </div>

            {inputValue >= 999 && (
              <div className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-3">
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
            <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
              <p className="font-semibold text-sm">Address Details</p>

              {formData.tax && (
                <>
                  <Input
                    className="h-11 rounded-xl"
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
                className="h-11 rounded-xl"
                placeholder="Full Address *"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              {error.address && (
                <p className="text-destructive text-sm">{error.address}</p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    className="h-11 rounded-xl"
                    placeholder="City *"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                  {error.city && (
                    <p className="text-destructive text-sm">{error.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <select
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
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
                  {error.state && (
                    <p className="text-destructive text-sm">{error.state}</p>
                  )}
                </div>
              </div>

              <Input
                className="h-11 rounded-xl"
                placeholder="Pincode *"
                value={formData.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
              />
              {error.pincode && (
                <p className="text-destructive text-sm">{error.pincode}</p>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:px-6">
          <div className="flex items-center justify-between gap-3 pb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Payable Now
              </p>
              <p className="text-lg font-semibold text-foreground">
                ₹{Number(inputValue || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <p className="text-right text-xs text-muted-foreground">
              Secure checkout
              <br />
              Razorpay payment gateway
            </p>
          </div>

          <Button
            className="h-12 w-full rounded-xl bg-linear-to-r from-primary via-primary to-yellow-400 text-base font-semibold text-primary-foreground shadow-md hover:shadow-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Securely"
            )}
          </Button>

          {loading && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Processing payment... please do not refresh or close this page
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
