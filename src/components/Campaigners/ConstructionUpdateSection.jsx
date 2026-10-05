import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:shorts\/|watch\?(?:.*&)?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

const getYoutubeId = (url) => url?.match(YOUTUBE_ID_PATTERN)?.[1] ?? null;

// Same Short as the HKM site's sqft-seva campaign page; used until an admin
// sets a different "Monthly update video" on the campaign.
const DEFAULT_VIDEO_ID = "mPAt0gb__Hw";

// Monthly construction update: the campaign's YouTube Short beside a short
// pitch and a Donate button. Shows the campaign's video, or the default.
const ConstructionUpdateSection = ({ onDonate }) => {
  const { currentCampaign } = useSelector((state) => state.campaign);
  const videoId =
    getYoutubeId(currentCampaign?.updateVideoUrl) || DEFAULT_VIDEO_ID;
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Load the player only once the section scrolls into view.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [videoId, inView]);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`;

  return (
    <section ref={sectionRef} className="py-6">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 rounded-2xl bg-muted px-5 py-10 sm:px-10 md:grid-cols-[minmax(0,400px)_1fr] md:gap-16 md:py-12 lg:px-16">
        <div className="mx-auto w-full max-w-[320px] md:max-w-[400px]">
          <div className="relative aspect-9/16 overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-yellow-500/30">
            {inView ? (
              <iframe
                src={embedUrl}
                title="Monthly construction update"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt="Monthly construction update video"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 text-left">
          <span className="rounded-full border border-yellow-500/60 bg-linear-to-br from-yellow-300 via-yellow-400 to-amber-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-black shadow-sm">
            Monthly Construction Update
          </span>

          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Watch The Temple Rise,{" "}
            <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text font-semibold text-transparent">
              Brick by Brick
            </span>
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every seva you offer becomes real progress on site. Watch our latest
            monthly update and see exactly how your contribution is shaping the
            Hare Krishna Vaikuntham Temple — foundation to framework, floor by
            floor.
          </p>

          <Button
            size="lg"
            onClick={onDonate}
            className="mt-1 rounded-full bg-linear-to-r from-[#8C6A1D] via-[#FFD700] to-[#B8962E] px-12 font-semibold text-black shadow-[0_6px_20px_rgba(255,215,0,0.35)] transition hover:brightness-110"
          >
            Donate Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConstructionUpdateSection;
