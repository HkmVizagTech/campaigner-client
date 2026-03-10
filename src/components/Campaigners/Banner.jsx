import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    const el = document.getElementById("donation-card");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleLearnMoreClick = () => {
    const el = document.getElementById("temple-section");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <section className="relative w-full min-h-130 sm:min-h-155 lg:min-h-205 overflow-hidden">
      {/* Background Image */}
      <img
        src="https://storage.googleapis.com/campaigners-images/Temple%20Images/topview.jpg"
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
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/20 text-primary text-xs sm:text-sm font-medium tracking-wide">
            Divine Opportunity
          </span>

          {/* Title */}
          <h1 className="text-white font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl">
            Support the Construction of <br />
            <span className="text-primary">Hare Krishna Vaikuntam</span>
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
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition"
            >
              Donate Now
            </button>

            <button
              onClick={handleLearnMoreClick}
              className="px-6 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
            >
              Learn More
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
