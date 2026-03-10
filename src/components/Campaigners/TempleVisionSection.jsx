export default function TempleVisionSection() {
  return (
    <div
      id="temple-section"
      className="w-full flex flex-col items-center gap-8 md:gap-10 py-8 md:py-10 px-4"
    >
      {/* ===== TOP BANNER ===== */}
      <div className="w-full max-w-6xl rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-r from-blue-950 via-blue-900 to-blue-950 opacity-95" />

        <div className="relative z-10 py-8 md:py-10 text-center text-white px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400 text-yellow-400 text-[10px] md:text-xs tracking-widest">
            WITNESS THE DIVINE VISION
          </div>

          <h2 className="mt-3 md:mt-4 text-2xl md:text-4xl font-bold text-yellow-400">
            Experience the Making of
          </h2>

          <h1 className="text-3xl md:text-5xl font-bold text-white mt-1 md:mt-2">
            Vizag's Tallest Temple
          </h1>

          <div className="mt-3 md:mt-4 text-xs md:text-sm text-yellow-300 tracking-widest">
            SCROLL ↓
          </div>
        </div>
      </div>

      {/* ===== TEMPLE HERO IMAGE ===== */}
      <div className="relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-xl">
        <img
          src="https://storage.googleapis.com/campaigners-images/Temple%20Images/govindaFrontView.jpg"
          alt="ISKCON Vizag Temple"
          className="w-full h-80 sm:h-105 md:h-130 object-cover zoom-soft"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70" />

        {/* Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-6 md:pt-10 text-center text-white px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Hare Krishna Vaikuntam
          </h2>

          <p className="text-sm sm:text-lg md:text-xl font-semibold text-gray-200 mt-2">
            Cultural & Spiritual Center to Preserve
            <span className="text-yellow-400 font-semibold">
              {" "}
              Sanatana Dharma
            </span>
          </p>
        </div>

        {/* ===== QUOTE ===== */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto bg-black/60 backdrop-blur-md text-white px-4 md:px-6 py-3 md:py-4 rounded-lg max-w-xl text-center shadow-lg">
          <p className="text-xs sm:text-sm md:text-base leading-relaxed">
            Leave your family’s sacred mark on this divine landmark.
            <br />
            Contribute to the construction of the
            <span className="text-yellow-400 font-semibold">
              {" "}
              Sri Srinivasa Govinda Temple
            </span>
            and help spread Krishna consciousness for generations to come.
          </p>
        </div>
      </div>
    </div>
  );
}
