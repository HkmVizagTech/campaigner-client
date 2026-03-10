import { Badge } from "../ui/badge";

export default function DidYouKnowBanner() {
  return (
    <section className="pb-14">
      <div
        className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `url(https://storage.googleapis.com/campaigners-images/Temple%20Images/vedic.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 px-6 py-15 text-center text-white">
          <span className="inline-block mb-4 px-4 py-1 rounded-full border border-[#C6A14A]/60 text-sm bg-white/10 backdrop-blur-sm">
            <span className="bg-linear-to-r from-[#C6A14A] via-[#FFD700] to-[#B8962E] bg-clip-text text-transparent font-semibold">
              📒 DID YOU KNOW?
            </span>
          </span>

          <h3 className="text-2xl md:text-3xl font-bold leading-14">
            Hare Krishna Vaikuntam is built with a<br />
            <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
              {" "}
              Vedic Planetarium
            </span>
          </h3>

          <p className="mt-4 text-white/80">
            To awaken timeless wisdom through the light of modern technology.
          </p>

          <Badge className="mt-8 border border-[#C6A14A]/60 bg-linear-to-r from-[#8C6A1D]/20 via-[#FFD700]/20 to-[#B8962E]/20 text-transparent bg-clip-text">
            <span className="bg-linear-to-r from-[#C6A14A] via-[#FFD700] to-[#B8962E] bg-clip-text text-transparent font-semibold">
              Join us in preserving our spiritual heritage.
            </span>
          </Badge>
        </div>
      </div>
    </section>
  );
}
