export default function MajesticAltarsBanner() {
  return (
    <section className="px-4 pb-14">
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
          <p className="uppercase text-primary font-semibold mb-3 tracking-wide">
            The Heart of Dakshina Dwaraka Dham
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Three Majestic Altars
          </h2>

          <p className="max-w-2xl mx-auto text-white/80 text-sm md:text-base">
            Home to Sri Sri Rukmini Dwarkadisha, Sri Narasimha, and Sri Sri
            Gaura Nitai — creating a powerful spiritual epicenter.
          </p>

          <p className="mt-6 text-primary font-semibold">
            Contribute to Enable Divine Worship
          </p>
        </div>
      </div>
    </section>
  );
}
