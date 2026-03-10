import { useSelector } from "react-redux";
import CampaignDonatePanel from "./CampaignerDonatePanel";

const CampaignSideBySide = () => {
  const { singleCampaignerDetails } = useSelector((state) => state.campaginer);
  const { sevaList, sevaLoading } = useSelector((state) => state.seva);

  return (
    <section className="py-6 w-full">
      <div
        className="
        w-full mx-auto max-w-7xl
        grid grid-cols-1 lg:grid-cols-2
        gap-8 lg:gap-12
        items-stretch
      "
      >
        {/* LEFT CARD */}
        <div
          className="
          h-full flex flex-col
          rounded-3xl overflow-hidden
          bg-card shadow-xl
          border border-border
          transition hover:shadow-2xl
        "
        >
          {/* IMAGE */}
          <div className="relative h-85 md:h-95 bg-muted shrink-0">
            <div
              className="
              absolute inset-0
              bg-linear-to-br
              from-primary/10
              via-transparent
              to-secondary/10
            "
            />

            <img
              src={singleCampaignerDetails?.campaginers?.image?.url}
              alt={`Campaigner-${singleCampaignerDetails?.campaginers?.image?.filename}`}
              loading="lazy"
              className="
              relative z-10
              h-full w-full
              object-contain
              px-6 pt-4
            "
            />

            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card to-transparent" />
          </div>

          {/* CONTENT */}
          <div className="flex flex-col flex-1 p-7 md:p-8 space-y-5">
            {/* NAME */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {singleCampaignerDetails?.campaginers?.name}
              </h3>

              <p className="text-sm font-semibold text-primary mt-1">
                ISKCON • DEVOTEE
              </p>
            </div>

            {/* DESCRIPTION */}
            <p className="text-muted-foreground leading-relaxed">
              As a devoted well-wisher, I am leading this sacred campaign to
              support the creation of a magnificent ISKCON{" "}
              <span className="text-primary font-semibold">
                Sri Srinivasa Govinda Temple
              </span>{" "}
              and Cultural Complex in Visakhapatnam.
            </p>

            <p className="text-muted-foreground leading-relaxed mt-2">
              This temple will become a spiritual home for devotees, a place for
              devotional gatherings, cultural programs, and sharing the
              teachings of Lord Krishna with future generations.
            </p>

            <p className="text-muted-foreground leading-relaxed mt-2">
              Your contribution helps bring this divine vision to life.
            </p>

            {/* TAGS */}
            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <span
                className="
                rounded-full
                bg-muted
                px-4 py-1.5
                text-xs font-medium
                text-muted-foreground
                shadow-sm
              "
              >
                📍 Visakhapatnam, Gambiram
              </span>

              <span
                className="
                rounded-full
                bg-muted
                px-4 py-1.5
                text-xs font-medium
                text-muted-foreground
                shadow-sm
              "
              >
                🛕 Temple Construction
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <CampaignDonatePanel
          details={singleCampaignerDetails}
          sevas={sevaList}
          sevaLoading={sevaLoading}
        />
      </div>
    </section>
  );
};

export default CampaignSideBySide;
