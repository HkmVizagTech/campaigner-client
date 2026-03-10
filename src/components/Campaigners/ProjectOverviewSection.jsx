import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProjectOverviewSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto  space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Hare Krishna Vaikuntam:
            <br />
            <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
              Inspiration & Aspiration
            </span>
          </h2>
        </div>
        <div className="w-full">
          <p className="text-muted-foreground leading-relaxed">
            Nestled amidst the serene landscapes of Gambhiram in Visakhapatnam,
            the Hare Krishna Vaikuntham Cultural Centre (Chaitanya Bhavan) is
            envisioned as a magnificent sanctuary to preserve and propagate
            India’s timeless spiritual and cultural heritage.
          </p>

          {expanded && (
            <p className="text-muted-foreground leading-relaxed">
              Beautifully blending modern utility with traditional Vedic
              architectural grace, the multi-story complex features divine
              altars, a vibrant kirtan hall, and dedicated spaces for youth
              empowerment and spiritual education—serving devotion, peace, and
              heritage for generations to come.
            </p>
          )}

          <Button
            variant="link"
            className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold mx-auto block"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Read less" : "Read more"}
          </Button>
        </div>
      </div>
    </section>
  );
}
