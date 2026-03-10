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
      <Card className="relative flex flex-col h-full rounded-2xl bg-card shadow-md transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 py-0">
        {/* IMAGE */}
        <div className="relative w-[96%] mx-auto mt-3 aspect-5/6 rounded-xl overflow-hidden bg-muted">
          {/* RANK BADGE */}
          {index < 10 && campainer?.raisedAmount >= 100 && (
            <div className="absolute top-3 left-4 z-10 h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground text-lg font-bold">
                {index + 1}
              </span>
            </div>
          )}

          {/* SEVA BADGE */}
          {index < 10 && campainer?.raisedAmount >= 100 && (
            <div
              className="
              absolute top-3 right-3 z-10
              rounded-full
              bg-linear-to-r
              from-yellow-400
              via-amber-400
              to-orange-400
              px-4 py-1.5
              text-xs font-bold
              text-black
              shadow-md
            "
            >
              {sevaBadges[index]}
            </div>
          )}

          {/* IMAGE */}
          <img
            src={
              campainer?.image?.url ||
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
            }
            alt={`Campaigner-${campainer?.image?.filename}`}
            className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
          />

          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent" />
        </div>

        {/* CONTENT */}
        <CardContent className="flex flex-col flex-1 px-5 py-2 space-y-2">
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
            <span className="font-bold text-primary">ISKCON VIZAG</span>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Gambiram
            </div>
          </div>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="relative px-5 pt-6 pb-7 rounded-b-2xl overflow-hidden border-t border-border">
          {/* GOLD GRADIENT BACKGROUND */}
          <div className="absolute inset-0 bg-linear-to-br from-yellow-300 via-yellow-400 to-amber-400 shadow-[0_10px_40px_rgba(250,204,21,0.35)]" />

          {/* SOFT DEPTH */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          {/* LIGHT SHINE */}
          <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-white/20 pointer-events-none" />

          <div className="relative z-10 w-full space-y-6 text-black">
            {/* RAISED + GOAL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/35 border border-white/50 px-4 py-3 backdrop-blur-md shadow-md">
                <p className="text-xs uppercase tracking-wide text-black/70">
                  Raised
                </p>

                <p className="text-xl font-bold mt-1">
                  ₹{campainer?.raisedAmount?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-white/35 border border-white/50 px-4 py-3 text-right backdrop-blur-md shadow-md">
                <p className="text-xs uppercase tracking-wide text-black/70">
                  Goal
                </p>

                <p className="text-lg font-semibold mt-1">
                  ₹{campainer?.targetAmount?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded-full bg-white/35 backdrop-blur-md border border-white/40 shadow-inner overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-orange-700 to-amber-600 transition-all duration-700 ease-out"
                  style={{ width: `${campainer?.percentage || 0}%` }}
                />
              </div>

              <p className="text-xs text-black/70">
                {campainer?.percentage?.toFixed(2) || "0.00"}% achieved
              </p>
            </div>
            {/* DAYS + PERCENTAGE */}
            <div className="flex justify-between items-center">
              <div className="rounded-lg bg-white/40 border border-white/50 px-3 py-1.5 backdrop-blur-md shadow-md text-xs font-semibold">
                {campainer?.percentage?.toFixed(2)}%
              </div>

              <div className="rounded-lg bg-white/40 border border-white/50 px-3 py-1.5 backdrop-blur-md shadow-md text-xs font-semibold">
                {diffDays} Days
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CustomCard;
