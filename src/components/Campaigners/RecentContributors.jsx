import { Card } from "@/components/ui/card";
import { Trophy, Clock, Heart, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Skeleton } from "../ui/skeleton";

const podium = [
  {
    icon: Medal,
    accent: "bg-yellow-400",
    ring: "ring-yellow-400/40",
    gradient: "from-yellow-50 to-transparent",
    textColor: "text-yellow-500",
  },
  {
    icon: Medal,
    accent: "bg-gray-300",
    ring: "ring-gray-300/40",
    gradient: "from-gray-50 to-transparent",
    textColor: "text-gray-400",
  },
  {
    icon: Medal,
    accent: "bg-amber-600",
    ring: "ring-amber-600/40",
    gradient: "from-amber-50 to-transparent",
    textColor: "ext-amber-700",
  },
];

export default function RecentContributors() {
  const [tab, setTab] = useState("top");
  const {
    topDonorsArr,
    lastestDonorsArr,
    topDonorsLoading,
    lastestDonorsLoading,
  } = useSelector((state) => state.campaginer);
  const isLoading = tab === "top" ? topDonorsLoading : lastestDonorsLoading;
  const donorsArr = (tab === "top" ? topDonorsArr : lastestDonorsArr) || [];

  return (
    <section className="py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-4xl font-bold">
          Recent{" "}
          <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
            Contributors
          </span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground">
          Join the growing community of devotees building this spiritual legacy.
          Your name belongs here.
        </p>

        <div className="flex justify-center mt-6">
          <div className="flex rounded-full bg-muted p-1 shadow-inner">
            <button
              onClick={() => setTab("latest")}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition",
                tab === "latest"
                  ? "bg-background shadow"
                  : "text-muted-foreground",
              )}
            >
              <Clock className="h-4 w-4" />
              Latest
            </button>

            <button
              onClick={() => setTab("top")}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition",
                tab === "top"
                  ? "bg-background shadow"
                  : "text-muted-foreground",
              )}
            >
              <Trophy className="h-4 w-4 text-primary" />
              Top Donors
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-14 max-w-4xl mx-auto">
        <Card className="p-3 sm:p-6 space-y-3 bg-muted shadow-inner gap-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-2xl p-4 bg-background shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-3 w-16 sm:self-end" />
              </div>
            ))
          ) : donorsArr.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center shadow-sm ring-1 ring-border">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-lg">No contributors yet</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Be the first to contribute and help build this spiritual
                  legacy.
                </p>
              </div>
            </div>
          ) : (
            donorsArr.map((item, index) => {
              const isTop = index < 3 && tab === "top";
              const style = podium[index];

              const days = moment().diff(moment(item.createdAt), "days");

              const label =
                days === 0
                  ? "Today"
                  : days === 1
                    ? "1 day ago"
                    : `${days} days ago`;

              return (
                <div
                  key={item?._id || index}
                  className={cn(
                    "relative flex flex-col gap-4 rounded-2xl p-4 bg-background shadow-sm transition hover:shadow-md",
                    "sm:flex-row sm:items-center sm:justify-between",
                    isTop && `bg-linear-to-r ${style.gradient}`,
                  )}
                >
                  {isTop && (
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full w-1 rounded-l-2xl",
                        style.accent,
                      )}
                    />
                  )}

                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "relative h-12 w-12 rounded-full flex items-center justify-center bg-muted font-semibold ring-1 shrink-0",
                        isTop ? style.ring : "ring-border",
                      )}
                    >
                      {isTop ? (
                        <style.icon
                          className={`h-6 w-6 text-primary ${style.textColor}`}
                        />
                      ) : (
                        item?.donorName?.charAt(0) || "?"
                      )}
                    </div>

                    <div>
                      <p className="font-semibold leading-tight">
                        {item?.donorName}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Heart className="h-4 w-4 text-primary" />
                        Donated{" "}
                        <span className="font-medium text-foreground">
                          {item.amount}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground sm:text-right">
                    {label}
                  </p>
                </div>
              );
            })
          )}
        </Card>

        <p className="text-xs mt-7 text-muted-foreground text-center">
          Every Square Feet You Donate Lives Forever
        </p>
      </div>
    </section>
  );
}
