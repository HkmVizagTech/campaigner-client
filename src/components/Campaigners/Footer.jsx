import {
  Youtube,
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative text-white mt-20 overflow-hidden">
      {/* Temple Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://storage.googleapis.com/campaigners-images/Temple%20Images/govindaSideView.jpg')",
        }}
      />

      {/* Bottom Fade */}
      <div className="absolute inset-0 bg-linear-to-t from-[#071f2f] via-[#071f2f]/40 to-transparent" />

      {/* Gold Divider */}
      <div className="relative z-10 h-0.5 w-full bg-linear-to-r from-transparent via-yellow-400 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold tracking-wide">
              Hare Krishna Vaikuntam
            </h3>

            <p className="text-sm text-white/80 leading-relaxed">
              Sri Sri Radha Madan Mohan Mandir <br />
              Door No: 8-22, IIM Rd, near Akshaya Patra Foundation Kitchen
              <br />
              Gambhiram, Andhra Pradesh
            </p>

            {/* MAP BUTTON */}
            <a
              href="https://maps.app.goo.gl/FHRTMBM4QbEsVwoS7"
              target="_blank"
              rel="noopener noreferrer"
              className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-lg
              bg-white/10
              hover:bg-yellow-400
              hover:text-black
              transition
              text-sm
              "
            >
              <MapPin size={16} />
              Open in Google Maps
            </a>
          </div>

          {/* CENTER */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold tracking-wide">
              Contact Us
            </h3>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <Phone size={16} className="text-yellow-400" />
              <a href="tel:+918977761187">+91-8977761187</a>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <MessageCircle size={16} className="text-green-400" />
              <a
                href="https://wa.me/918977761187"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <Mail size={16} className="text-yellow-400" />
              <a href="mailto:mukunda@hkmvizag.org">mukunda@hkmvizag.org</a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold tracking-wide">
              Stay Connected
            </h3>

            <div className="flex gap-3">
              {[
                {
                  icon: Youtube,
                  link: "https://www.youtube.com/@harekrishnavizag",
                },
                {
                  icon: Instagram,
                  link: "https://www.instagram.com/harekrishnavizag/",
                },
                {
                  icon: Facebook,
                  link: "https://www.facebook.com/hkm.vizag/",
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                  h-10 w-10
                  flex items-center justify-center
                  rounded-full
                  bg-white/10
                  hover:bg-yellow-400
                  hover:text-black
                  transition-all duration-300
                  hover:scale-110
                  "
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/10" />

        {/* Copyright */}
        <p className="text-center text-xs sm:text-sm text-white/60 mt-6">
          © {new Date().getFullYear()} Hare Krishna Vaikuntam Cultural Centre.
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
