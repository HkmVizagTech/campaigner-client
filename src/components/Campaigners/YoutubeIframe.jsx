import { Card } from "@/components/ui/card";
import { useState, useCallback } from "react";

const YoutubeIframe = () => {
  const [play, setPlay] = useState(false);

  const sectionRef = useCallback((node) => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPlay(entry.isIntersecting);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        py-20 sm:py-28 md:py-36
        bg-linear-to-b
        from-primary/95
        via-primary/70
        to-background
        overflow-hidden
        rounded-2xl
      "
    >
      {/* Radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-6xl text-center">
        <p className="text-primary-foreground/130 text-xs sm:text-sm mb-2 sm:mb-3 tracking-wide">
          That’s why we build
        </p>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-muted mb-3 sm:mb-4">
          Hare Krishna Vaikuntam
        </h2>

        <p className="text-primary-foreground/130 text-sm sm:text-base max-w-2xl mx-auto mb-2 sm:mb-3">
          (Project by Hare Krishna Movement Visakhapatnam, an affiliate of
          ISKCON)
        </p>

        <p className="text-primary-foreground/130 text-sm sm:text-base max-w-xl mx-auto mb-12 sm:mb-20">
          A sacred cultural complex to uplift society through devotion, heritage
          & values.
        </p>

        {/* VIDEO */}
        <div className="flex justify-center">
          <Card
            className="
              relative
              w-full
              max-w-full sm:max-w-4xl
              overflow-hidden
              rounded-2xl sm:rounded-3xl
              bg-black
              shadow-2xl
              ring-1 ring-white/10
            "
          >
            {/* Glow */}
            <div className="absolute -inset-6 bg-primary/30 blur-3xl opacity-30 -z-10" />

            <div className="relative aspect-video">
              <iframe
                key={play ? "play" : "pause"}
                src={`https://www.youtube.com/embed/7I-zT8P7QB8?autoplay=${
                  play ? 1 : 0
                }&mute=1&rel=0`}
                className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default YoutubeIframe;
