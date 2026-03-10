export default function MajesticAltarsBanner() {
  return (
    <section className="pb-14">
      <div
        className="
          relative
          max-w-7xl mx-auto
          rounded-3xl
          overflow-hidden
          min-h-70 md:min-h-90
          flex items-center justify-center
          bg-black
        "
      >
        <img
          src="https://storage.googleapis.com/campaigners-images/Temple%20Images/majestic_altar.jpg"
          alt="Altars"
          className="absolute inset-0 w-full h-full object-cover opacity-40 zoom-medium"
          loading="lazy"
        />

        <div className="relative z-10 text-center px-6">
          <p className="uppercase bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold mb-3 tracking-wide">
            The Heart of Hare Krishna Vaikuntam
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Two Majestic Altars
          </h2>

          <p className="max-w-2xl mx-auto text-white/80 text-sm md:text-base">
            Home to Sri Sri Radha Madan Mohan and Sri Srinivasa Govinda —
            creating a powerful spiritual epicenter.
          </p>

          <p className="mt-6 bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
            Contribute to Enable Divine Worship
          </p>
        </div>
      </div>
    </section>
  );
}
