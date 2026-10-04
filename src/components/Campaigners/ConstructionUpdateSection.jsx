import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:shorts\/|watch\?(?:.*&)?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

const getYoutubeId = (url) => url?.match(YOUTUBE_ID_PATTERN)?.[1] ?? null;

// Monthly construction update: the campaign's YouTube Short beside a short
// pitch and a Donate button. Hidden until an admin sets the video link on
// the campaign.
const ConstructionUpdateSection = ({ onDonate }) => {
  const { currentCampaign } = useSelector((state) => state.campaign);
  const videoId = getYoutubeId(currentCampaign?.updateVideoUrl);
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

  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`;

  return (
    <section ref={sectionRef} className="py-6">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 rounded-3xl bg-[#F4F6FC] px-5 py-10 sm:px-10 md:grid-cols-[minmax(0,400px)_1fr] md:gap-16 md:py-12 lg:px-16">
        <div className="mx-auto w-full max-w-[320px] md:max-w-[400px]">
          <div className="relative aspect-9/16 overflow-hidden rounded-[28px] bg-black shadow-2xl shadow-slate-900/15">
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
          <span className="rounded-full bg-[#26357F] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            Monthly Construction Update
          </span>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#1D1B16] sm:text-4xl lg:text-5xl">
            Watch The Temple Rise, Brick by Brick
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-[#5F584B] sm:text-lg">
            Every seva you offer becomes real progress on site. Watch our latest
            monthly update and see exactly how your contribution is shaping the
            Hare Krishna Vaikuntham Temple — foundation to framework, floor by
            floor.
          </p>

          <button
            type="button"
            onClick={onDonate}
            className="mt-1 rounded-xl bg-linear-to-b from-[#EDC75A] to-[#D9A62E] px-10 py-4 text-lg font-semibold text-[#1D1B16] shadow-lg shadow-amber-600/20 transition hover:shadow-xl hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26357F]"
          >
            Donate Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConstructionUpdateSection;
