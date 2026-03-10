import { Card } from "@/components/ui/card";

const privileges = [
  {
    title: "Gift & Mahaprasadam",
    desc: "Donate and receive blessed Mahaprasadam and a spiritual gift as divine blessings.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/gift.jpg",
    bg: "bg-blue-50",
  },
  {
    title: "80G Tax Exemption",
    desc: "Donors will receive an 80G certificate for tax exemption.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/tax.jpg",
    bg: "bg-amber-50",
  },
  {
    title: "Special Puja",
    desc: "A special puja will be offered in your name at the temple inauguration.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/puja.jpg",
    bg: "bg-blue-50",
  },
  {
    title: "Vedic Literatures",
    desc: "A special gift set of spiritual books delivered to your doorstep.",
    image:
      "https://storage.googleapis.com/campaigners-images/Temple%20Images/vedic_books.jpg",
    bg: "bg-amber-50",
  },
];

export default function DonorPrivileges() {
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Donor{" "}
            <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
              Privileges
            </span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Each respected contributor receives these blessings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {privileges.map((p, i) => (
            <Card key={i} className={`p-6 rounded-3xl shadow-md ${p.bg}`}>
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>

              <div className="overflow-hidden rounded-2xl">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
