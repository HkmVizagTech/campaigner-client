// Footer.jsx
import { Youtube, Instagram, Facebook, MessageCircle, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#071f2f] text-white mt-10">
      {/* Top accent line */}
      <div className="h-1 w-full bg-primary" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid gap-12 md:grid-cols-3">
          {/* ===== LEFT ===== */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Hare Krishna Vaikuntam</h3>

            <p className="text-sm text-white/80 leading-relaxed">
              Sri Sri Radha Madan Mohan Mandir <br />
              Door No: 8-22, IIM Rd, near Akshaya Patra Foundation Kitchen{" "}
              <br />
              Gambhiram, Andhra Pradesh
            </p>

            {/* MAP */}
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3797.1261228615617!2d83.3732088!3d17.8795552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3959ee6ce94599%3A0xec5b2ce3e6117b17!2sHare%20Krishna%20Vaikuntham%20Cultural%20Centre!5e0!3m2!1sen!2sin!4v1773131716489!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ===== CENTER ===== */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Us</h3>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <Phone size={16} className="text-primary" />
              <a
                href="tel:+918977761187"
                className="hover:text-primary transition"
              >
                +91-8977761187
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <MessageCircle size={16} className="text-green-400" />
              <a
                href="https://wa.me/918977761187"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <Mail size={16} className="text-primary" />
              <a
                href="mailto:mukunda@hkmvizag.org"
                className="hover:text-primary transition"
              >
                mukunda@hkmvizag.org
              </a>
            </div>
          </div>
          {/* ===== RIGHT ===== */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Stay Connected</h3>

            <div className="flex gap-4">
              {[
                {
                  icon: Youtube,
                  link: "https://www.youtube.com/@harekrishnavizag",
                },
                {
                  icon: Instagram,
                  link: "https://www.instagram.com/harekrishnavizag/",
                },
                { icon: Facebook, link: "https://www.facebook.com/hkm.vizag/" },
              ].map((item, i) => (
                <a
                  key={i}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={item.link}
                  className="
                    h-10 w-10
                    flex items-center justify-center
                    rounded-full
                    bg-white/10
                    hover:bg-primary
                    hover:text-black
                    transition
                  "
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10" />

        {/* Bottom */}
        <p className="text-center text-sm text-white/60 mt-6">
          © {new Date().getFullYear()} Hare Krishna Vaikuntam — ISKCON Vizag.
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
