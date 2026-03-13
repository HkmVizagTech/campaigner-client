import { Link } from "react-router-dom";
import { Trophy, Clock } from "lucide-react";
import { Card } from "../ui/card";

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

const CustomCard = ({ campainer, index }) => {
  const raised = campainer?.raisedAmount || 0;
  const goal = campainer?.targetAmount || 0;

  const percentage = goal ? (raised / goal) * 100 : 0;

  const today = new Date();

  const daysLeft = campainer?.campaignId?.endDate
    ? Math.max(
        Math.ceil(
          (new Date(campainer.campaignId.endDate) - today) /
            (1000 * 60 * 60 * 24),
        ),
        0,
      )
    : 0;

  return (
    <Link to={`/${campainer?.slug}`}>
      <Card
        className="
        relative
        h-full
        flex flex-col
        rounded-3xl
        border border-yellow-200
        bg-linear-to-r from-[#faf6e6] via-[#f6eed2] to-[#f2e6b8]
        shadow-lg
        hover:shadow-xl
        transition
        py-0
      "
      >
        {/* IMAGE */}
        <div className="relative p-4">
          {/* SEVA BADGE */}
          {index < 10 && raised > 100 && (
            <div
              className="
              absolute
              top-6
              left-6
              z-10
              px-3
              py-1.5
              rounded-full
              text-[10px]
              font-bold
              tracking-wide
              text-black
              bg-linear-to-r
              from-[#fde68a]
              via-[#facc15]
              to-[#f59e0b]
              shadow-md
              backdrop-blur
            "
            >
              #{index + 1} {sevaBadges[index]}
            </div>
          )}

          <img
            src={campainer?.image?.url}
            alt={campainer?.name}
            className="w-full aspect-3/3 object-cover rounded-xl"
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 px-5 pb-5 space-y-4">
          {/* TITLE */}
          <h3 className="text-sm leading-relaxed font-medium">
            <span className="font-bold uppercase">{campainer?.name}'s</span>{" "}
            campaign to build a magnificent{" "}
            <span className="font-semibold text-amber-600">
              Sri Srinivasa Govinda Temple
            </span>{" "}
            in Visakhapatnam
          </h3>

          {/* LOCATION + DAYS */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="font-semibold text-amber-600">
              ISKCON Gambiram
            </span>

            <div className="flex items-center gap-1">
              <Clock size={14} className="text-amber-600" />
              {daysLeft} Days left
            </div>
          </div>

          {/* RAISED */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              ₹{raised.toLocaleString("en-IN")}
              <span className="text-gray-600 font-normal">
                {" "}
                raised of ₹{goal.toLocaleString("en-IN")}
              </span>
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 rounded-full bg-white/70 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#facc15] via-[#fbbf24] to-[#f59e0b]"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="text-xs font-semibold text-amber-700">
                {percentage.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* TOP DEVOTEES */}
          <div className="space-y-2 flex flex-col">
            {campainer?.topDonors?.length > 0 && (
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Trophy size={16} className="text-amber-500" />
                Top Donors
              </div>
            )}

            {campainer?.topDonors?.length > 0 ? (
              campainer.topDonors.map((donor, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {i === 0 && <span>🥇</span>}
                    {i === 1 && <span>🥈</span>}
                    {i === 2 && <span>🥉</span>}
                    <span>
                      {donor?.isAnonymous ? "Anonymous Donor" : donor.name}
                    </span>
                  </div>

                  <span className="font-semibold text-amber-700">
                    ₹{donor.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-600 leading-relaxed pt-1">
                🙏 Be the first devotee to support this campaign
                <div className="text-gray-500">
                  Your contribution can inspire others.
                </div>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <div className="mt-auto pt-2">
            <button
              className="
              w-full
              py-3
              rounded-xl
              text-sm
              font-semibold
              text-black
              bg-linear-to-r from-[#facc15] via-[#fbbf24] to-[#f59e0b]
              shadow-md
              hover:shadow-lg
              transition
            "
            >
              Donate Now
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CustomCard;
