import { useEffect, useState } from "react";

const images = [
  "https://storage.googleapis.com/campaigners-images/Temple%20Images/status1.jpeg",
  "https://storage.googleapis.com/campaigners-images/Temple%20Images/status2.jpeg",
  "https://storage.googleapis.com/campaigners-images/Temple%20Images/status3.jpeg",
  "https://storage.googleapis.com/campaigners-images/Temple%20Images/status4.jpeg",
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
            Construction <span className="text-primary">Status</span>
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
