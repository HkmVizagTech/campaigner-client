import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useState } from "react";

export default function PowerOfGivingSection() {
  const handleDonateClick = () => {
    const el = document.getElementById("donation-card");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const [showAll, setShowAll] = useState(false);
  const faqs = [
    {
      q: "What is the goal of this campaign?",
      a: "To raise donations for the construction of Hare Krishna Vaikuntam in Visakhapatnam.",
    },
    {
      q: "How does my donation help?",
      a: "Your contribution supports temple construction, education, and cultural programs.",
    },
    {
      q: "When will I receive Prasadam?",
      a: "You can expect to receive prasadam within one month of your donation. Prasadam will be sent only to donors within India.",
    },
    {
      q: "Will I get 80G tax exemption?",
      a: "Yes, all donations qualify for 80G tax exemption as per government regulations.",
    },
    {
      q: "Who is the inspiration behind this project?",
      a: `His Divine Grace Vishwa Guru Srila Prabhupada, Founder-Acarya of the Worldwide Hare Krishna Movement, is the inspiration behind this project.`,
    },
    {
      q: "Where is Hare Krishna Vaikuntam located?",
      a: "Sri Sri Radha Madan Mohan Mandir Door No: 8-22, IIM Rd, near Akshaya Patra Foundation Kitchen Gambhiram, Andhra Pradesh, Visakhapatnam - 531163.",
    },
    {
      q: "Is there a minimum donation amount?",
      a: "Yes, the minimum donation amount is ₹100.",
    },
    {
      q: "When will construction be completed?",
      a: "If required donations are received, the full construction phase is expected to complete by 2027.",
    },
  ];

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <section className="space-y-14">
      {/* ================= POWER OF GIVING ================= */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          The Power of{" "}
          <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
            Giving
          </span>
        </h2>

        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sacred scriptures glorify those who support spiritual causes
        </p>

        <div className="grid gap-3 mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "Garuda Purana",
              text: "One who contributes to building a temple attains heaven and is honored by all.",
              img: "https://storage.googleapis.com/campaigners-images/Temple%20Images/garuda_purana.mp4",
            },
            {
              title: "Vishnu Purana (3.8.27)",
              text: "One who donates towards the construction of a temple is liberated from all sins and attains the heavenly realms.",
              img: "https://storage.googleapis.com/campaigners-images/Temple%20Images/vishnu_purana.mp4",
            },
            {
              title: "Vamana Purana",
              text: "One can attain the spiritual world (Vaikuntha) by helping construct or renovate a temple.",
              img: "https://storage.googleapis.com/campaigners-images/Temple%20Images/vamana_purana.mp4",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="relative h-80 overflow-hidden rounded-2xl group py-1"
            >
              <video
                src={item.img}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-[55%] 
                  bg-linear-to-t from-black/90 via-black/90 to-transparent"
              />
              <div className="relative z-10 text-left p-6 flex flex-col justify-end h-full text-white">
                <p className="text-primary font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed">{item.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ================= FAQ ================= */}
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked{" "}
            <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
              Questions
            </span>
          </h2>

          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Find answers to common questions about the temple campaign.
          </p>
        </div>

        {/* FAQ ACCORDION */}
        <Accordion type="single" collapsible className="space-y-4">
          {visibleFaqs.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="
    bg-card
    border
    rounded-xl
    px-5
    shadow-sm
    hover:shadow-md
    transition
  "
            >
              <AccordionTrigger className="text-left font-semibold text-base md:text-lg">
                {item.q}
              </AccordionTrigger>

              <AccordionContent className="pt-2">
                <div className="border-l-4 border-primary pl-4 text-muted-foreground leading-relaxed">
                  {item.a}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* SHOW MORE BUTTON */}
        {faqs.length > 4 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="px-6"
            >
              {showAll ? "Show Less" : "Show More Questions"}
            </Button>
          </div>
        )}
      </div>

      <section className="md:px-10">
        <div
          className="
          relative
          max-w-7xl mx-auto
          h-100
          overflow-hidden
          rounded-3xl
          border border-primary
        "
        >
          {/* Background Image */}
          <img
            src="https://storage.googleapis.com/campaigners-images/Temple%20Images/education_wing.jpg"
            alt="Building Character"
            className="absolute inset-0 w-full h-full object-cover zoom-medium"
            loading="lazy"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content */}
          <div
            className="
            relative z-10
            flex flex-col
            items-center
            justify-center
            text-center
            px-6
            py-16
            md:py-24
            text-white
          "
          >
            {/* Badge */}
            <div
              className="
              inline-flex items-center gap-2
              py-1.5
              rounded-full
              border border-primary/50
              bg-black/40
              text-primary
              text-xs md:text-sm
              font-semibold
              tracking-wide
              mb-6
            "
            >
              <BookOpen className="h-4 w-4" />
              NURTURING MINDS
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Building{" "}
              <span className="bg-linear-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold">
                Character
              </span>
            </h2>

            {/* Divider */}
            <div className="w-16 h-0.5 bg-primary my-6" />

            {/* Description */}
            <p className="max-w-3xl text-sm md:text-base text-white/85 leading-relaxed">
              Four classrooms accommodating nearly 200 participants. Children
              and adults learn the{" "}
              <span className="font-semibold text-white">Bhagavad-gita</span>,
              ethics, and values rooted in Vedic wisdom.
            </p>

            {/* CTA Text */}
            <p className="mt-8 text-sm font-semibold tracking-widest text-primary">
              INVEST IN KNOWLEDGE
            </p>
          </div>
        </div>
      </section>

      {/* ================= FOUNDER ================= */}
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Our Founder & Acharya</h2>

        <img
          src="https://storage.googleapis.com/campaigners-images/Temple%20Images/prabhupada.jpg"
          alt="Srila Prabhupada"
          className="h-40 w-40 rounded-full mx-auto object-cover shadow-lg"
          loading="lazy"
        />

        <Card className="max-w-2xl mx-auto p-6 text-muted-foreground leading-relaxed">
          His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada brought the
          timeless teachings of Lord Krishna to the world and founded ISKCON,
          inspiring millions to walk the path of devotion and service.
        </Card>
      </div>

      {/* ================= DARK CTA ================= */}
      <div className="relative bg-[#071f2f] rounded-3xl md:mx-12 overflow-hidden">
        <div className="relative z-10 text-center py-20 px-6 text-white space-y-6">
          <p className="text-lg md:text-xl italic max-w-3xl mx-auto leading-relaxed">
            “We are trying to give human society an opportunity for happiness,
            peace of mind and good qualities through God Consciousness.”
          </p>

          <p className="text-sm opacity-80">— Srila Prabhupada</p>

          <Button
            size="lg"
            className="rounded-full px-12 font-semibold text-black bg-linear-to-r from-[#8C6A1D] via-[#FFD700] to-[#B8962E] shadow-[0_6px_20px_rgba(255,215,0,0.35)] hover:brightness-110 transition"
            onClick={handleDonateClick}
          >
            ❤️ Contribute Now
          </Button>
        </div>
      </div>
    </section>
  );
}
