import { useEffect, useState } from "react";
import CircularProgress from "./CircularProgress";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProgressBanner = () => {
  const { currentCampaign } = useSelector((state) => state.campaign);

  const [progress, setProgress] = useState(0);
  const [animatedAmount, setAnimatedAmount] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();

    const animate = (time) => {
      const elapsed = time - start;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - ratio, 3);

      setProgress(Math.floor(eased * (currentCampaign?.percentage || 0)));
      setAnimatedAmount(
        Math.floor(eased * (currentCampaign?.raisedAmount || 0)),
      );

      if (ratio < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [currentCampaign]);

  return (
    <section className="my-5">
      <div
        className="
        w-full mx-auto
        rounded-3xl
        border border-yellow-200
        bg-linear-to-r from-[#faf6e6] via-[#f6eed2] to-[#f2e6b8]
        shadow-lg
        px-6 py-7
      "
      >
        <div
          className="
          flex flex-col md:flex-row
          items-center
          justify-between
          gap-8
        "
        >
          {/* LEFT : Progress Circle */}
          <div className="flex items-center gap-5">
            <CircularProgress value={progress} />

            <div>
              <p className="text-sm lg:text-lg text-gray-600 font-medium">
                Fundraising Goal
              </p>

              <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                ₹{currentCampaign?.targetAmount?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* CENTER : Raised Amount */}
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Amount Raised</p>

            <p className="text-3xl md:text-4xl font-bold text-[#b7791f] mt-1">
              ₹{animatedAmount.toLocaleString("en-IN")}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              ({currentCampaign?.percentage?.toFixed(2)}% completed)
            </p>
          </div>

          {/* RIGHT : Message + CTA */}
          <div className="text-center md:text-right max-w-sm">
            <h3 className="text-lg lg:text-2xl font-semibold text-gray-900">
              Mandir Nirmana Seva
            </h3>

            <p className="text-sm lg:text-lg text-gray-600 mt-1">
              Join devotees in building a sacred temple that will serve
              generations to come.
            </p>

            <Link to={"/campaigner/register"}>
              <button
                className="
                mt-4
                px-6 py-2.5
                rounded-full
                bg-linear-to-r from-yellow-400 to-yellow-500
                text-black font-semibold
                shadow
                hover:shadow-md
                transition
              "
              >
                Register as Campaigner
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressBanner;
