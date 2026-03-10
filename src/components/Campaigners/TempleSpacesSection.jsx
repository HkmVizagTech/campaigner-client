import { Card } from "@/components/ui/card";

const spaces = [
  {
    title: "Divine Altar",
    desc: "Beautifully carved altar of Sri Srinivasa Govinda",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/govinda.jpg",
  },
  {
    title: "Vedic Planetarium",
    desc: "To awaken timeless wisdom through the light of modern technology.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/vedic.jpg",
  },
  {
    title: "Prasadam Hall",
    desc: "A sacred hall serving Krishna-prasadam.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/annadanam_hall.jpg",
  },
  {
    title: "Festival Hall",
    desc: "A grand space for kirtans, festivals & cultural celebrations.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/festival_hall.jpg",
  },
  {
    title: "Harinam Mandap",
    desc: "A serene space for chanting & meditation.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/harinaam_mandap.jpg",
  },
  {
    title: "Bala Samskriti Program",
    desc: "Value-based cultural learning for children.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/icvk.jpg",
  },
  {
    title: "Gita Life Program",
    desc: "Transforming youth & families with Gita wisdom.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/gita_life.jpg",
  },
];

const positionImageArr = [
  // Divine Altar
  "object-[50%_-30px] sm:object-[50%_-100px] md:object-[50%_-100px] lg:object-[50%_-180px] xl:object-[50%_-200px]",

  // Cultural Hall
  "object-center",

  // Prasadam Hall
  "object-[50%_-1px] sm:object-[50%_-40px] md:object-[50%_-60px]",

  // Festival Hall
  "object-center",

  // Harinam Mandap
  "object-center",

  // Kids Program
  "object-center",

  // Gita Life
  "object-[50%_-1px] sm:object-[50%_-35px] md:object-[50%_-50px]",
];
export default function TempleSpacesSection() {
  return (
    <section className="py-14">
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold">
          Inside Hare Krishna{" "}
          <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
            Vaikuntam
          </span>
        </h2>
        <p className="text-muted-foreground mt-3">
          Each contribution helps build sacred spaces that uplift hearts.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-8">
        {spaces.map((item, i) => (
          <Card
            key={i}
            className="relative overflow-hidden rounded-3xl h-65 justify-end py-1"
          >
            <img
              src={item.image}
              className={`absolute inset-0 w-full h-full object-cover ${positionImageArr[i]}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 p-6 text-white">
              <h3 className="text-xl bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-white/80 max-w-md">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
