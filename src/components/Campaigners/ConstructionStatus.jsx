import { useEffect, useState } from "react";

const images = [
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793702996469-1793702995670-WhatsAppImage2026-11-03at4.17.19PM.jpeg",
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793702996064-1793702995455-WhatsAppImage2026-11-03at4.17.19PM1.jpeg",
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793702998947-1793702995899-WhatsAppImage2026-11-03at4.17.22PM.jpeg",
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793702998027-1793702995845-WhatsAppImage2026-11-03at4.17.21PM1.jpeg",
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793702997561-1793702995820-WhatsAppImage2026-11-03at4.17.20PM.jpeg",
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793702996902-1793702995743-WhatsAppImage2026-11-03at4.17.20PM1.jpeg",
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793702998535-1793702995853-WhatsAppImage2026-11-03at4.17.21PM.jpeg",
];

const ConstructionStatus = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="bg-muted py-12 sm:py-16 mb-10 rounded-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Construction{" "}
            <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
              Status
            </span>
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            As on february 2026
          </p>
        </div>

        {/* Main Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={images[activeIndex]}
            alt="construction"
            className="w-full h-55 sm:h-87.5 lg:h-170 object-cover object-center transition-all duration-500"
            loading="lazy"
          />
        </div>

        {/* Thumbnails */}
        <div className="mt-6 flex gap-3 sm:gap-4 justify-center overflow-x-auto overflow-y-hidden">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`rounded-xl overflow-hidden border-2 transition ${
                activeIndex === index
                  ? "border-primary scale-105"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt="thumb"
                className="w-20 h-16 sm:w-28 sm:h-20 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConstructionStatus;
