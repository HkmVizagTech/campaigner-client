import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    const el = document.getElementById("donation-card");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <section className="relative w-full min-h-130 sm:min-h-155 lg:min-h-205 overflow-hidden">
      {/* Background Image */}
      <img
        src="https://storage.googleapis.com/campaigners-images/Temple%20Images/Header.jpg"
        alt="Temple"
        className="absolute inset-0 w-full h-full object-cover object-top"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/70 to-black/60" />

      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <button
          onClick={handleBackHome}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition"
        >
          ← Back Home
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full py-16 sm:py-24 lg:py-44">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Badge */}
          <span className="inline-block mb-4 px-4 py-1 rounded-full text-xs sm:text-sm font-medium tracking-wide border border-[#C6A14A]/60 bg-linear-to-r from-[#8C6A1D]/20 via-[#FFD700]/20 to-[#B8962E]/20">
            <span className="bg-linear-to-r from-[#C6A14A] via-[#FFD700] to-[#B8962E] bg-clip-text text-transparent">
              Divine Opportunity
            </span>
          </span>

          {/* Title */}
          <h1 className="text-white font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl">
            Support the Construction of <br />
            <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
              Hare Krishna Vaikuntam
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed">
            Your contribution helps build a spiritual landmark for generations.
            Every donation lays a brick in devotion.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleDonateClick}
              className="
  px-7 py-3
  rounded-xl
  font-semibold
  text-black
  bg-linear-to-b
  from-[#FFF3A3]
  via-[#FFD700]
  to-[#B8962E]
  shadow-[0_10px_25px_rgba(255,215,0,0.45)]
  hover:scale-[1.03]
  hover:shadow-[0_14px_35px_rgba(255,215,0,0.55)]
  transition-all duration-300
  "
            >
              Donate Now
            </button>
          </div>

          {/* Meta Info */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-white/70">
            <span>📍 Visakhapatnam</span>
            <span>👥 5,000+ Supporters</span>
            <span>🧾 80G Tax Benefit</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
