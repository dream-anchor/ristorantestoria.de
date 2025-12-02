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
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold tracking-widest uppercase mb-12">{t.footer.theFamily}</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            {/* Domenico */}
            <div className="text-center">
              <div className="w-32 h-32 md:w-36 md:h-36 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-primary-foreground/30 shadow-lg">
                <img 
                  src={domenicoImage} 
                  alt="Domenico Speranza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-base font-serif tracking-wide text-primary-foreground/80">Domenico</p>
            </div>

            {/* Mamma */}
            <div className="text-center">
              <div className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-primary-foreground/30 shadow-xl">
                <video 
                  src={mammaVideo}
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-base font-serif tracking-wide text-primary-foreground/80">Mamma</p>
            </div>

            {/* Nicola */}
            <div className="text-center">
              <div className="w-32 h-32 md:w-36 md:h-36 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-primary-foreground/30 shadow-lg">
                <img 
                  src={nicolaImage} 
                  alt="Nicola Speranza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-base font-serif tracking-wide text-primary-foreground/80">Nicola</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kontakt & Öffnungszeiten */}
      <div className="container mx-auto px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Kontakt */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="font-serif font-semibold text-lg tracking-widest uppercase mb-6">{t.footer.contact}</h3>
              <div className="space-y-2 text-sm font-sans text-primary-foreground/70">
                <a href="tel:+4989515196" className="flex items-center justify-center md:justify-start gap-2 hover:text-primary-foreground transition-colors">
                  <Phone className="h-4 w-4" />
                  089 51519696
                </a>
                <a href="mailto:info@ristorantestoria.de" className="flex items-center justify-center md:justify-start gap-2 hover:text-primary-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  info@ristorantestoria.de
                </a>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="h-4 w-4" />
                  Karlstr. 47a, 80333 München
                </div>
              </div>
            </div>

            {/* Öffnungszeiten */}
            <div className="space-y-4 text-center md:text-right">
              <h3 className="font-serif font-semibold text-lg tracking-widest uppercase mb-6">{t.footer.openingHours}</h3>
              <div className="space-y-1 text-sm font-sans text-primary-foreground/70">
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{t.footer.monFri}: 09:00 – 01:00</span>
                </div>
                <p>{t.footer.satSun}: 12:00 – 01:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-sm font-sans text-primary-foreground/50">
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-sans text-primary-foreground/40">
            <Link to="/impressum" className="hover:text-primary-foreground/70 transition-colors">{t.footer.imprint}</Link>
            <span>·</span>
            <Link to="/datenschutz" className="hover:text-primary-foreground/70 transition-colors">{t.footer.privacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
