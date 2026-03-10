import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DonationDialog } from "./DonationDialog";
import { useRef, useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem } from "../ui/command";

const CampaignDonatePanel = ({ details, sevas = [], sevaLoading }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [selectedSeva, setSelectedSeva] = useState(null);

  const inputRef = useRef(null);

  const today = new Date();

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

  const filteredSevas = useMemo(() => {
    const num = Number(inputValue);

    if (!num) return [];

    return [...sevas]
      .sort((a, b) => a.sevaAmount - b.sevaAmount)
      .filter((s) => s.sevaAmount >= num);
  }, [inputValue, sevas]);

  const handleInputChange = (value) => {
    const num = Number(value);

    setInputValue(value);
    setOpenPopover(true);

    if (!num) {
      setSelectedSeva(null);
      return;
    }

    const sorted = [...sevas].sort((a, b) => a.sevaAmount - b.sevaAmount);

    let matched = null;

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      if (num >= current.sevaAmount && (!next || num < next.sevaAmount)) {
        matched = current;
        break;
      }
    }

    setSelectedSeva(matched);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleSelect = (seva) => {
    setInputValue(seva.sevaAmount);
    setSelectedSeva(seva);
    setOpenPopover(false);
  };

  return (
    <>
      <div
        id="donation-card"
        className="h-full w-full flex flex-col rounded-3xl overflow-hidden bg-card shadow-xl border border-border"
      >
        {/* TOP GOLD SECTION */}
        <div className="relative px-6 py-8 bg-linear-to-br from-yellow-300 via-yellow-400 to-amber-500 text-black shadow-[0_10px_40px_rgba(250,204,21,0.25)]">
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          <div className="relative space-y-7">
            {/* AMOUNT + GOAL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/30 border border-white/40 px-5 py-4 backdrop-blur-md shadow-sm">
                <p className="text-xs uppercase tracking-wide text-black/70">
                  Amount Raised
                </p>

                <p className="text-2xl font-bold mt-1">
                  ₹{details?.campaginers?.raisedAmount?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-2xl bg-white/30 border border-white/40 px-5 py-4 text-right backdrop-blur-md shadow-sm">
                <p className="text-xs uppercase tracking-wide text-black/70">
                  Campaign Goal
                </p>

                <p className="text-xl font-semibold mt-1">
                  ₹{details?.campaginers?.targetAmount?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="space-y-3">
              <Progress
                value={details?.campaginers?.percentage}
                className="
      h-4
      rounded-full
      bg-white/40
      border border-white/50
      shadow-inner
      [&>div]:bg-linear-to-r
      [&>div]:from-orange-700
      [&>div]:to-amber-600
    "
              />

              <p className="text-sm text-black/80">
                {details?.campaginers?.percentage?.toFixed(2)}% achieved
              </p>
            </div>

            {/* DAYS + FUNDERS */}
            <div className="rounded-2xl bg-white/30 border border-white/40 px-6 py-5 backdrop-blur-md shadow-sm">
              <div className="grid grid-cols-2 divide-x divide-black/20 text-center">
                <div>
                  <p className="text-xs uppercase tracking-wide text-black/70">
                    Days Left
                  </p>

                  <p className="text-3xl font-bold mt-2">{diffDays}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-black/70">
                    Funders
                  </p>

                  <p className="text-3xl font-bold mt-2">{details?.count}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SPIRITUAL QUOTE */}
        <div className="px-6 pt-5">
          <div className="rounded-xl border border-border bg-muted/40 px-5 py-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
            <p className="font-semibold text-foreground mb-1">
              ✨ Lord Krishna says in Bhagavad-Gita 9.27
            </p>

            <p className="italic">
              “Whatever you give in charity – do that as an offering unto Me.”
            </p>

            <p className="text-xs mt-2">
              Every contribution becomes a sacred offering toward building Lord
              Krishna’s temple.
            </p>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col gap-5 px-6 py-8 mt-auto">
          {/* NOTICE */}
          <div className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground bg-muted/60 shadow-sm">
            🇮🇳 Accepts funds from Indian Passport / ID holders only
          </div>

          {/* INPUT + SUGGESTIONS */}
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
              <Input
                ref={inputRef}
                type="number"
                placeholder="Enter Amount (Min ₹100)"
                className="h-12 text-base"
                value={inputValue || ""}
                onFocus={() => setOpenPopover(true)}
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </PopoverTrigger>

            {filteredSevas.length > 0 && (
              <PopoverContent
                className="p-0 w-full"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command>
                  <CommandGroup>
                    {filteredSevas.map((seva) => (
                      <CommandItem
                        key={seva._id}
                        onSelect={() => handleSelect(seva)}
                        className={
                          selectedSeva?._id === seva._id ? "bg-muted" : ""
                        }
                      >
                        ₹ {seva.sevaAmount} — {seva.sevaName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            )}
          </Popover>

          {/* SEVA DETAILS */}
          {selectedSeva && (
            <div className="rounded-xl border border-border p-4 bg-muted/60 text-sm shadow-sm">
              <p className="font-semibold mb-2">{selectedSeva.sevaName}</p>

              <ul className="space-y-1 text-muted-foreground">
                {selectedSeva.sevaPoints.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* DONATE BUTTON */}
          <Button
            onClick={() => setOpen(true)}
            size="lg"
            disabled={numericValue < 100}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-linear-to-r from-primary via-primary to-yellow-400 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            🙏 Contribute Now
          </Button>
        </div>
      </div>

      {/* DONATION MODAL */}
      {open && (
        <DonationDialog
          open={open}
          onOpenChange={setOpen}
          inputValue={numericValue}
          sevaId={selectedSeva?._id}
        />
      )}
    </>
  );
};

export default CampaignDonatePanel;
