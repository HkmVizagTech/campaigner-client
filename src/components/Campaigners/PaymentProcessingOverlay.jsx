export default function PaymentProcessingOverlay() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#020c1b] px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="text-primary text-5xl animate-bounce">🛕</div>

        <div>
          <h1 className="text-white text-lg tracking-widest font-semibold">
            VERIFYING YOUR DONATION
          </h1>

          <p className="text-primary text-xs tracking-widest">
            PLEASE WAIT WHILE WE CONFIRM YOUR PAYMENT
          </p>
        </div>

        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />

        <p className="max-w-sm text-xs leading-6 tracking-wide text-white/70">
          Do not refresh or close this page until the confirmation is complete.
        </p>
      </div>
    </div>
  );
}
