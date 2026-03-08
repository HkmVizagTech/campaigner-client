import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { MapPin } from "lucide-react";

const CustomCard = ({ campainer, index }) => {
  const today = new Date();

  const diffDays = campainer?.campaignId?.endDate
    ? Math.max(
        Math.ceil(
          (new Date(campainer.campaignId.endDate) - today) /
            (1000 * 60 * 60 * 24),
        ),
        0,
      )
    : 0;

  const sevaBadges = [
    "SEVA SHIROMANI",
    "SEVA RATNA",
    "SEVA BHUSHAN",
    "SEVA VIBHUSHAN",
    "SEVA VIBHAVA",
    "SEVA SHRESHTA",
    "SEVA PRAMUKH",
    "SEVA SAMARPIT",
    "SEVA SADHAK",
    "SEVA BANDHU",
  ];

  return (
    <Link to={`/campaigner/${campainer?._id}/${campainer?.name}`}>
      <Card
        className="
        relative 
        flex 
        flex-col 
        rounded-2xl 
        bg-card 
        shadow-md 
        transition-all 
        duration-300
        hover:shadow-xl
        hover:-translate-y-1
        py-0
      "
      >
        {/* IMAGE */}
        <div className="relative w-[96%] mx-auto mt-3 h-80 rounded-xl overflow-hidden bg-secondary">
          {index < 10 && campainer?.raisedAmount >= 100 && (
            <div className="absolute top-3 left-4 z-10 h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground text-lg font-bold">
                {index + 1}
              </span>
            </div>
          )}

          {index < 10 && campainer?.raisedAmount >= 100 && (
            <div
              className="
      absolute 
      top-3 
      right-3 
      z-10
      rounded-full 
      bg-linear-to-r 
      from-primary 
      to-secondary
      px-4 
      py-1.5 
      text-xs 
      font-bold 
      text-primary-foreground 
      shadow-md
    "
            >
              {sevaBadges[index]}
            </div>
          )}

          <img
            src={campainer?.image?.url}
            alt={`Campaigner-${campainer?.image?.filename}`}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 h-15 bg-linear-to-t from-card to-transparent" />
        </div>

        {/* CONTENT */}
        <CardContent className="flex-1 px-5 py-1 space-y-2">
          <h3 className="text-sm font-medium leading-relaxed text-foreground">
            <span className="font-bold uppercase tracking-wide">
              {campainer?.name}&apos;S
            </span>{" "}
            campaign to build a magnificent{" "}
            <span className="text-primary font-semibold">
              Sri Srinivasa Govinda Temple
            </span>{" "}
            and cultural complex in Visakhapatnam
          </h3>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-secondary">ISKCON VIZAG</span>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Gambiram
            </div>
          </div>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="relative px-5 pt-6 pb-7 overflow-hidden rounded-b-2xl border-t border-border">
          {/* PREMIUM GRADIENT */}
          <div
            className="
            absolute inset-0
            bg-linear-to-br
            from-secondary
            via-secondary/95
            to-secondary/80
          "
          />

          {/* DEPTH OVERLAY */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          {/* LIGHT HIGHLIGHT */}
          <div
            className="
            absolute inset-0
            bg-linear-to-t
            from-black/20
            via-transparent
            to-white/10
          "
          />

          <div className="relative z-10 w-full text-primary-foreground space-y-5">
            {/* RAISED + GOAL */}
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs uppercase tracking-wider opacity-80">
                  Raised
                </div>

                <div className="text-2xl font-bold">
                  ₹{campainer?.raisedAmount?.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs uppercase tracking-wider opacity-80">
                  Goal
                </div>

                <div className="text-xl font-semibold opacity-90">
                  ₹{campainer?.targetAmount?.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="relative">
              <div className="h-3 rounded-full bg-white/25 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${campainer?.percentage}%` }}
                />
              </div>
            </div>

            {/* PERCENTAGE + DAYS */}
            <div className="flex items-center justify-between">
              <span
                className="
                px-5 py-2
                rounded-xl
                text-sm font-semibold
                bg-white/12
                backdrop-blur-md
                border border-white/30
                shadow-[0_6px_16px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.35)]
              "
              >
                {campainer?.percentage?.toFixed(2)}%
              </span>

              <div className="w-10 h-3 rounded-full bg-blue-900/40 shadow-inner" />

              <span
                className="
                px-5 py-2
                rounded-xl
                text-sm font-semibold
                bg-white/12
                backdrop-blur-md
                border border-white/30
                shadow-[0_6px_16px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.35)]
              "
              >
                {diffDays} Days
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CustomCard;
