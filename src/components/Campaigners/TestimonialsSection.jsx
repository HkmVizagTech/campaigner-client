import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Senthil Kumar Mothilal",
    role: "Founder & Managing Director – iTrident, Chennai",
    image: "https://i.pravatar.cc/100?img=12",
    text: "Donating to Hare Krishna Vaikuntam Chennai has brought a real positive change in my life. Every contribution is utilized well and gives deep satisfaction.",
  },
  {
    name: "Srinivasan V",
    role: "Head – Field Quality, Nissan Motor India",
    image: "https://i.pravatar.cc/100?img=13",
    text: "Transparency and dedication gave me confidence. Supporting this project brought inner satisfaction and meaningful service.",
  },
  {
    name: "Aneesh M",
    role: "Senior Software Engineer – Citi Bank",
    image: "https://i.pravatar.cc/100?img=14",
    text: "Clarity, intent, and real impact made me trust this mission. A wonderful initiative.",
  },
  {
    name: "Giridhari Ramamoorthy",
    role: "Operations Head – Security Technology, Singapore",
    image: "https://i.pravatar.cc/100?img=15",
    text: "A blessing to contribute to something uplifting society and preserving spiritual values.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 px-6 py-2 rounded-full bg-muted text-sm font-semibold">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
              5,000+
            </span>{" "}
            Supporters have already contributed
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="p-6 bg-black text-white rounded-3xl shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-white/70">{t.role}</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-white/80">{t.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
