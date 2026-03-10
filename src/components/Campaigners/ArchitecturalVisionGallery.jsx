import { Card } from "@/components/ui/card";
import { Box } from "lucide-react";

export default function ArchitecturalVisionGallery() {
  return (
    <section className="py-24 px-6 bg-background">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-5xl font-bold tracking-tight">
          Architectural <span className="text-primary">Vision</span>
        </h2>

        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          A fusion of traditional Pallava craftsmanship and modern engineering.
          Explore the visualizations of Chennai's Dakshina Dwaraka Dham.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT LARGE IMAGE */}
        <Card className="relative lg:col-span-2 h-130 overflow-hidden rounded-3xl shadow-xl group py-0">
          <img
            src="https://storage.googleapis.com/campaigners-images/Temple%20Images/frontview.jpg"
            alt="Grand Front View"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-end">
            <div className="p-8 flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                <Box className="text-primary w-5 h-5" />
              </div>
              <h3 className="text-white text-xl font-semibold">
                Grand Front View
              </h3>
            </div>
          </div>
        </Card>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-3">
          {/* TOP RIGHT WIDE */}
          <Card className="relative h-62.5 overflow-hidden rounded-3xl shadow-xl group py-0">
            <img
              src="https://storage.googleapis.com/campaigners-images/Temple%20Images/Aerial.jpg"
              alt="Aerial"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-6 flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                  <Box className="text-primary w-4 h-4" />
                </div>
                <h3 className="text-white font-semibold">
                  Aerial Perspective View
                </h3>
              </div>
            </div>
          </Card>
          <Card className="relative h-62.5 overflow-hidden rounded-3xl shadow-xl group py-0">
            <img
              src="https://storage.googleapis.com/campaigners-images/Temple%20Images/Exterior.jpg"
              alt="Exterior"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-6 flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                  <Box className="text-primary w-4 h-4" />
                </div>
                <h3 className="text-white font-semibold">
                  Exterior Perspective View
                </h3>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
