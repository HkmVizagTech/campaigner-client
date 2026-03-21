import React from "react";
import { Sparkles } from "lucide-react";

const Banner1 = () => {
  return (
    <section className="w-full my-4">
      <div
        className="
        w-full mx-auto
        rounded-3xl
        border border-yellow-200
        bg-linear-to-r from-[#faf6e6] via-[#f6eed2] to-[#f2e6b8]
        shadow-lg
        px-6 py-8 md:px-10 md:py-10
      "
      >
        <div
          className="
          flex flex-col md:flex-row
          items-center
          gap-6 md:gap-10
        "
        >
          {/* Logo */}
          <div className="shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4">
              <img
                src="https://storage.googleapis.com/campaigners-images/Temple%20Images/hkmlogopng-blackfont.jpg"
                alt="Hare Krishna Movement Vizag"
                className="h-20 md:h-24 object-contain"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-20 bg-yellow-300" />

          {/* Content */}
          <div className="flex-1 text-center md:text-left space-y-4">
            {/* Badge */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-700 font-semibold text-sm">
              <Sparkles className="h-4 w-4" />
              Divine Promise
            </div>

            {/* Main Message */}
            <p className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
              If you help build a temple for Lord Krishna in this world,
            </p>

            {/* Highlight Message */}
            <p className="text-xl md:text-2xl font-bold text-yellow-700 leading-snug">
              Krishna will build a palace for you in the spiritual world —
              Vaikuntha.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner1;
