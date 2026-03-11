import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function DonationPopup({ donors }) {
  const [visible, setVisible] = useState(false);
  const [donor, setDonor] = useState(null);

  useEffect(() => {
    if (!donors?.length) return;

    const interval = setInterval(() => {
      const random = donors[Math.floor(Math.random() * donors.length)];
      setDonor(random);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 4000);
    }, 5000);

    return () => clearInterval(interval);
  }, [donors]);

  if (!donor) return null;

  return (
    <div
      className={`
    fixed bottom-6 left-1/2 -translate-x-1/2 z-50
    transition-all duration-500 ease-out
    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
  `}
    >
      <div className="flex items-center gap-4 rounded-full px-6 py-4 bg-[#062432] text-white shadow-xl border border-[#0e3b50]">
        <Avatar className="bg-yellow-400 text-black font-bold">
          <AvatarFallback>{donor?.donorName?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col leading-tight">
          <span className="font-semibold">{donor?.donorName}</span>

          <span className="text-sm text-gray-300">
            contributed{" "}
            <span className="font-bold text-white">
              ₹{donor?.amount?.toLocaleString("en-IN")}
            </span>
          </span>
        </div>

        <div className="ml-4 flex items-center gap-1 text-yellow-400 text-xs font-semibold">
          <Zap size={14} />
          RECENTLY
        </div>
      </div>
    </div>
  );
}
