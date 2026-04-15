import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DonationDialog } from "./DonationDialog";
import PaymentProcessingOverlay from "./PaymentProcessingOverlay";
import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Check, ChevronDown, Loader2 } from "lucide-react";

const CampaignDonatePanel = ({ details, sevas = [], sevaLoading }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [selectedSeva, setSelectedSeva] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const today = new Date();
  const quickAmounts = [501, 1001, 2501, 5001];

  const diffDays = details?.campaginers?.campaignId?.endDate
    ? Math.max(
        Math.ceil(
          (new Date(details?.campaginers?.campaignId.endDate) - today) /
            (1000 * 60 * 60 * 24),
        ),
        0,
      )
    : 0;

  const numericValue = Number(inputValue);
  const isValidAmount = Number.isFinite(numericValue) && numericValue >= 1;

  const sortedSevas = useMemo(() => {
    return [...sevas].sort((a, b) => a.sevaAmount - b.sevaAmount);
  }, [sevas]);

  const handleInputChange = (value) => {
    if (selectedSeva) return;
    setInputValue(value);
  };

  const handleSelect = (seva) => {
    setSelectedSeva(seva);
    setInputValue(String(seva.sevaAmount || ""));
    setOpenPopover(false);
  };

  const handleClearSeva = () => {
    setSelectedSeva(null);
    setInputValue("");
  };

  return (
    <>
      {isProcessingPayment && <PaymentProcessingOverlay />}

      <div
        id="donation-card"
        className="h-full w-full flex flex-col rounded-3xl overflow-hidden bg-card shadow-xl border border-border"
      >
        {/* TOP GOLD SECTION */}
        <div className="relative px-5 py-6 bg-linear-to-br from-yellow-300 via-yellow-400 to-amber-500 text-black shadow-[0_10px_40px_rgba(250,204,21,0.25)]">
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          <div className="relative space-y-5">
            {/* AMOUNT + GOAL */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/30 border border-white/40 px-4 py-3 backdrop-blur-md shadow-sm">
                <p className="text-xs uppercase tracking-wide text-black/70">
                  Amount Raised
                </p>

                <p className="mt-1 text-xl font-bold">
                  ₹{details?.campaginers?.raisedAmount?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-2xl bg-white/30 border border-white/40 px-4 py-3 text-right backdrop-blur-md shadow-sm">
                <p className="text-xs uppercase tracking-wide text-black/70">
                  Campaign Goal
                </p>

                <p className="mt-1 text-lg font-semibold">
                  ₹{details?.campaginers?.targetAmount?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="space-y-2">
              <Progress
                value={details?.campaginers?.percentage}
                className="
      h-3
      rounded-full
      bg-white/40
      border border-white/50
      shadow-inner
      [&>div]:bg-linear-to-r
      [&>div]:from-yellow-500
      [&>div]:to-amber-400
    "
              />

              <p className="text-xs text-black/80">
                {details?.campaginers?.percentage?.toFixed(2)}% achieved
              </p>
            </div>

            {/* DAYS + FUNDERS */}
            <div className="rounded-2xl bg-white/30 border border-white/40 px-4 py-3 backdrop-blur-md shadow-sm">
              <div className="grid grid-cols-2 divide-x divide-black/20 text-center">
                <div>
                  <p className="text-xs uppercase tracking-wide text-black/70">
                    Days Left
                  </p>

                  <p className="mt-1 text-2xl font-bold">{diffDays}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-black/70">
                    Funders
                  </p>

                  <p className="mt-1 text-2xl font-bold">{details?.count}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-auto flex flex-col gap-4 px-5 py-5">
          {/* NOTICE */}
          <div className="rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-xs text-muted-foreground shadow-sm">
            🇮🇳 Accepts funds from Indian Passport / ID holders only
          </div>

          <div className="rounded-2xl border border-border bg-linear-to-br from-background via-muted/30 to-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Donation Amount
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Seva selection stays separate from the amount.
                </p>
              </div>

              <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Min ₹100
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <Input
                type="number"
                min="100"
                placeholder={
                  selectedSeva
                    ? "Amount locked to selected seva"
                    : "Enter donation amount"
                }
                disabled={Boolean(selectedSeva)}
                className="h-12 rounded-2xl border-border/70 bg-background text-base font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-80"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
              />

              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    disabled={Boolean(selectedSeva)}
                    onClick={() => setInputValue(String(amount))}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      Number(inputValue) === amount
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5"
                    } ${selectedSeva ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    ₹{amount.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>

              {selectedSeva && (
                <p className="text-xs text-muted-foreground">
                  Amount is locked to the selected seva. Clear the seva to enter
                  a custom donation amount.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Seva</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Optional. Select a seva if you want to attach this donation.
                </p>
              </div>

              {selectedSeva && (
                <button
                  type="button"
                  onClick={handleClearSeva}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-left shadow-sm transition-colors hover:border-primary/40"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {selectedSeva?.sevaName || "Enter amount of seva"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedSeva
                        ? `${selectedSeva.sevaCategory} • Recommended ₹${Number(
                            selectedSeva.sevaAmount || 0,
                          ).toLocaleString("en-IN")}`
                        : "Leave it empty if this is a general donation"}
                    </p>
                  </div>

                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>

              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command>
                  <CommandGroup>
                    {sevaLoading && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        Loading seva options...
                      </div>
                    )}

                    {!sevaLoading && sortedSevas.length === 0 && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        No seva options available right now.
                      </div>
                    )}

                    {!sevaLoading &&
                      sortedSevas.map((seva) => (
                        <CommandItem
                          key={seva._id}
                          onSelect={() => handleSelect(seva)}
                          className="flex items-start justify-between gap-3 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {seva.sevaName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {seva.sevaCategory} • ₹
                              {Number(seva.sevaAmount || 0).toLocaleString(
                                "en-IN",
                              )}
                            </p>
                          </div>

                          {selectedSeva?._id === seva._id && (
                            <Check className="mt-0.5 h-4 w-4 text-primary" />
                          )}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* SEVA DETAILS */}
          {selectedSeva && (
            <div className="rounded-2xl border border-primary/15 bg-linear-to-br from-primary/5 via-background to-yellow-50 p-4 text-sm shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Selected Seva
                  </p>
                  <p className="mt-1.5 text-base font-semibold text-foreground">
                    {selectedSeva.sevaName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {selectedSeva.sevaCategory}
                  </p>
                </div>

                <div className="rounded-full border border-primary/20 bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                  Recommended ₹
                  {Number(selectedSeva.sevaAmount || 0).toLocaleString("en-IN")}
                </div>
              </div>

              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                {(selectedSeva.sevaPoints || []).map((point, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-3 rounded-2xl border border-border bg-muted/40 p-3 shadow-sm sm:grid-cols-2">
            <div className="rounded-xl bg-background px-4 py-2.5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Donation Amount
              </p>
              <p className="mt-1.5 text-lg font-semibold text-foreground">
                ₹{isValidAmount ? numericValue.toLocaleString("en-IN") : "0"}
              </p>
            </div>

            <div className="rounded-xl bg-background px-4 py-2.5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Seva
              </p>
              <p className="mt-1.5 text-sm font-semibold text-foreground">
                {selectedSeva?.sevaName || "General donation"}
              </p>
              {selectedSeva && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Recommended ₹
                  {Number(selectedSeva.sevaAmount || 0).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>

          {/* DONATE BUTTON */}
          <Button
            onClick={() => setOpen(true)}
            size="lg"
            disabled={!isValidAmount || loading}
            className="h-12 w-full rounded-xl bg-linear-to-r from-primary via-primary to-yellow-400 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              "🙏 Contribute Now"
            )}
          </Button>

          {loading && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Processing payment... please do not refresh or close this page
            </p>
          )}
        </div>
      </div>

      {/* DONATION MODAL */}
      {open && (
        <DonationDialog
          open={open}
          onOpenChange={setOpen}
          inputValue={numericValue}
          sevaId={selectedSeva?._id}
          selectedSeva={selectedSeva}
          loading={loading}
          setLoading={setLoading}
          setIsProcessingPayment={setIsProcessingPayment}
        />
      )}
    </>
  );
};

export default CampaignDonatePanel;
