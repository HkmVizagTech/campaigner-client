import sketchTemple from "../../assets/Temple-Images/sketch.png";
import { Landmark, Building2, Maximize2, CheckCircle2 } from "lucide-react";

const highlights = [
  {
    icon: Landmark,
    title: "Tallest Temple in Visakhapatnam",
    desc: "A grand landmark rising above the city skyline.",
  },
  {
    icon: Building2,
    title: "Dravidian Architecture",
    desc: "Inspired by traditional stone-carved South Indian architecture.",
  },
  {
    icon: Maximize2,
    title: "67,000 Sq Ft Complex",
    desc: "A cultural & spiritual campus serving thousands daily.",
  },
  {
    icon: CheckCircle2,
    title: "1st Phase Under Construction",
    desc: "Your support helps complete the remaining works.",
  },
];

const TempleHighlights = () => {
  return (
    <section id="temple-section" className="relative py-6 md:py-7 bg-white overflow-hidden">
      <div
        className="
          relative 
          w-full 
          md:w-[70%] 
          lg:w-[65%]
          xl:w-[50%]
          mx-auto 
          px-4 sm:px-6
          max-w-6xl
        "
      >
        {/* BACKGROUND SKETCH */}
        <img
          src={sketchTemple}
          alt="Temple Sketch"
          className="
            absolute 
            left-1/2 
            bottom-0 
            -translate-x-1/2 
            w-full 
            h-[80%] sm:h-[90%]
            opacity-25 sm:opacity-35
            pointer-events-none 
            select-none
          "
        />

        {/* TITLE */}
        <h2
          className="
            relative z-10 
            text-center 
            text-3xl sm:text-4xl 
            font-bold 
            mb-14 sm:mb-20
          "
        >
          Temple <span className="text-primary">Highlights</span>
        </h2>

        {/* TIMELINE */}
        <div className="relative z-10">
          {/* Vertical Line */}
          <div
            className="
              absolute 
              left-5 sm:left-6 
              top-0 
              bottom-0 
              w-px 
              bg-primary/40
            "
          />

          <div className="space-y-8 sm:space-y-10">
            {highlights.map((item, index) => (
              <div key={index} className="relative flex gap-5 sm:gap-8">
                {/* ICON */}
                <div
                  className="
                    relative z-10 
                    flex 
                    h-11 w-11 sm:h-14 sm:w-14
                    items-center justify-center 
                    rounded-full 
                    border-2 border-primary/50 
                    bg-white 
                    text-primary
                    shrink-0
                  "
                >
                  <item.icon size={20} className="sm:hidden" />
                  <item.icon size={24} className="hidden sm:block" />
                </div>

                {/* TEXT */}
                <div>
                  <h4
                    className="
                      text-lg sm:text-xl 
                      font-semibold 
                      text-foreground
                    "
                  >
                    {item.title}
                  </h4>
                  <p
                    className="
                      mt-1.5 sm:mt-2
                      text-sm sm:text-base
                      text-muted-foreground 
                      leading-relaxed
                      max-w-xl
                    "
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TempleHighlights;
