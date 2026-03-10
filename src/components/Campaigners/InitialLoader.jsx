const InitialLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#020c1b]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo / Temple icon */}
        <div className="text-yellow-500 text-5xl">🛕</div>

        <div className="text-center">
          <h1 className="text-white text-lg tracking-widest font-semibold">
            DAKSHINA DWARAKA DHAM
          </h1>

          <p className="text-yellow-500 text-xs tracking-widest">
            PREPARING THE DIVINE EXPERIENCE
          </p>
        </div>

        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default InitialLoader;
