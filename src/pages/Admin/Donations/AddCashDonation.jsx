import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { getCampainer } from "@/store/campaigners/campaigners.service";
import { getCurrentCampaign } from "@/store/campaign/campaign.service";
import { addOfflineDonation } from "@/store/Donations/donations.service";
import { toast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "cheque", label: "Cheque" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

const AddCashDonation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentCampaign } = useSelector((state) => state.campaign);
  const { campaginers } = useSelector((state) => state.campaginer);
  const { details } = useSelector((state) => state.auth);

  const [submitting, setSubmitting] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCampaigner, setSelectedCampaigner] = useState(null);
  const [formData, setFormData] = useState({
    campaignerId: "",
    donorName: "",
    donorPhone: "",
    donorEmail: "",
    amount: "",
    pan: "",
    paymentMode: "cash",
    isAnonymous: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(getCurrentCampaign());
  }, [dispatch]);

  useEffect(() => {
    if (!currentCampaign?._id || !details?.role) return;

    dispatch(
      getCampainer({
        id: currentCampaign._id,
        status: "active",
        campStatus: "active",
        page: 1,
        pageSize: 50,
        search: debouncedSearch,
        isDevotee: true, // authed route — devotees get own, admins get all
      }),
    );
  }, [currentCampaign?._id, details?.role, debouncedSearch, dispatch]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.campaignerId) {
      toast.error("Please select a campaigner");
      return;
    }
    if (!formData.donorName.trim()) {
      toast.error("Donor name is required");
      return;
    }
    const phone = formData.donorPhone.replace(/\D/g, "");
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (
      formData.pan.trim() &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.pan.trim())
    ) {
      toast.error("Please enter a valid PAN number");
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        addOfflineDonation({
          campaignerId: formData.campaignerId,
          donorName: formData.donorName.trim(),
          donorPhone: phone,
          donorEmail: formData.donorEmail.trim() || undefined,
          amount: Number(formData.amount),
          pan: formData.pan.trim() || undefined,
          paymentMode: formData.paymentMode,
          isAnonymous: formData.isAnonymous,
        }),
      ).unwrap();

      setFormData({
        campaignerId: "",
        donorName: "",
        donorPhone: "",
        donorEmail: "",
        amount: "",
        pan: "",
        paymentMode: "cash",
        isAnonymous: false,
      });
      setSelectedCampaigner(null);
      setSearch("");
      navigate("/admin/funders");
    } catch {
      // toast already shown by the thunk
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-xl p-6 space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Add Cash Donation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Record an offline donation (cash, UPI, cheque, or bank transfer)
            received directly from a donor.
          </p>
        </div>

        <div className="space-y-2">
          <Label>
            Campaigner <span className="text-red-500">*</span>
          </Label>
          <Popover open={comboOpen} onOpenChange={setComboOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboOpen}
                className="w-full justify-between h-12"
              >
                {selectedCampaigner ? (
                  <span className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={selectedCampaigner.image?.url}
                        alt={selectedCampaigner.name}
                      />
                      <AvatarFallback>
                        {selectedCampaigner.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{selectedCampaigner.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {selectedCampaigner.phoneNumber}
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Search campaigner by name or phone
                  </span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Type name or phone number..."
                  value={search}
                  onValueChange={setSearch}
                />
                <CommandList>
                  <CommandEmpty>No campaigner found.</CommandEmpty>
                  <CommandGroup>
                    {(campaginers || []).map((c) => (
                      <CommandItem
                        key={c._id}
                        value={c._id}
                        onSelect={() => {
                          setSelectedCampaigner(c);
                          handleChange("campaignerId", c._id);
                          setComboOpen(false);
                        }}
                        className="flex items-center gap-3 py-2"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={c.image?.url} alt={c.name} />
                          <AvatarFallback>
                            {c.name?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex flex-col min-w-0">
                          <span className="font-medium truncate">
                            {c.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {c.phoneNumber}
                          </span>
                        </span>
                        {formData.campaignerId === c._id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>
            Donor Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Full name of the donor"
            value={formData.donorName}
            onChange={(e) => handleChange("donorName", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="10-digit mobile number"
              maxLength={10}
              value={formData.donorPhone}
              onChange={(e) =>
                handleChange("donorPhone", e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              Amount (₹) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min="1"
              placeholder="Donation amount"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(value) => handleChange("paymentMode", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Email (optional)</Label>
            <Input
              type="email"
              placeholder="Donor email"
              value={formData.donorEmail}
              onChange={(e) => handleChange("donorEmail", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>PAN (optional, for 80G receipt)</Label>
          <Input
            placeholder="ABCDE1234F"
            maxLength={10}
            value={formData.pan}
            onChange={(e) =>
              handleChange("pan", e.target.value.toUpperCase())
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="isAnonymous"
            checked={formData.isAnonymous}
            onCheckedChange={(checked) =>
              handleChange("isAnonymous", Boolean(checked))
            }
          />
          <Label htmlFor="isAnonymous" className="cursor-pointer">
            Donor wants to remain anonymous publicly
          </Label>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add Donation"}
        </Button>
      </Card>
    </div>
  );
};

export default AddCashDonation;
