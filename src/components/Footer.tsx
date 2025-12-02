import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import domenicoImage from "@/assets/domenico-speranza.webp";
import nicolaImage from "@/assets/nicola-speranza.webp";
import mammaVideo from "@/assets/lamamma.mp4";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* La Famiglia Speranza */}
      <div className="border-b border-primary-foreground/5">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-xl md:text-2xl font-serif font-medium tracking-[0.3em] uppercase mb-14 text-primary-foreground/90">{t.footer.theFamily}</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-14 md:gap-20">
            {/* Domenico */}
            <div className="text-center group">
              <div className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-5 rounded-full overflow-hidden ring-1 ring-primary-foreground/20 shadow-xl transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={domenicoImage} 
                  alt="Domenico Speranza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-serif italic tracking-wider text-primary-foreground/90">Domenico</p>
            </div>

            {/* Mamma */}
            <div className="text-center group">
              <div className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-5 rounded-full overflow-hidden ring-1 ring-primary-foreground/20 shadow-xl transition-transform duration-300 group-hover:scale-105">
                <video 
                  src={mammaVideo}
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-serif italic tracking-wider text-primary-foreground/90">Mamma</p>
            </div>

            {/* Nicola */}
            <div className="text-center group">
              <div className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-5 rounded-full overflow-hidden ring-1 ring-primary-foreground/20 shadow-xl transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={nicolaImage} 
                  alt="Nicola Speranza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-serif italic tracking-wider text-primary-foreground/90">Nicola</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kontakt & Öffnungszeiten */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Kontakt */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="font-serif font-medium text-base tracking-[0.2em] uppercase mb-6 text-primary-foreground/90">{t.footer.contact}</h3>
              <div className="space-y-2.5 text-sm font-sans text-primary-foreground/60">
                <a href="tel:+4989515196" className="flex items-center justify-center md:justify-start gap-2.5 hover:text-primary-foreground transition-colors">
                  <Phone className="h-3.5 w-3.5" />
                  089 51519696
                </a>
                <a href="mailto:info@ristorantestoria.de" className="flex items-center justify-center md:justify-start gap-2.5 hover:text-primary-foreground transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  info@ristorantestoria.de
                </a>
                <Link 
                  to="/kontakt#map" 
                  className="flex items-center justify-center md:justify-start gap-2.5 hover:text-primary-foreground transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Karlstr. 47a, 80333 München
                </Link>
              </div>
            </div>

            {/* Öffnungszeiten */}
            <div className="space-y-4 text-center md:text-right">
              <h3 className="font-serif font-medium text-base tracking-[0.2em] uppercase mb-6 text-primary-foreground/90">{t.footer.openingHours}</h3>
              <div className="space-y-1.5 text-sm font-sans text-primary-foreground/60">
                <div className="flex items-center justify-center md:justify-end gap-2.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t.footer.monFri}: 09:00 – 01:00</span>
                </div>
                <p>{t.footer.satSun}: 12:00 – 01:00</p>
                <p className="pt-2 italic text-primary-foreground/70">{t.footer.welcomeMessage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="border-t border-primary-foreground/5 mt-14 pt-10 text-center">
          <p className="text-sm font-sans text-primary-foreground/40">
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-sans text-primary-foreground/30">
            <Link to="/impressum" className="hover:text-primary-foreground/60 transition-colors">{t.footer.imprint}</Link>
            <span className="opacity-50">·</span>
            <Link to="/datenschutz" className="hover:text-primary-foreground/60 transition-colors">{t.footer.privacy}</Link>
            <span className="opacity-50">·</span>
            <Link to="/admin" className="hover:text-primary-foreground/60 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
