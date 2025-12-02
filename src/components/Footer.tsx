import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Heart } from "lucide-react";
import domenicoImage from "@/assets/domenico-speranza.webp";
import nicolaImage from "@/assets/nicola-speranza.webp";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* La Mamma */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-12 tracking-wide">{t.footer.theMamma}</h2>
          
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-6 rounded-full bg-primary-foreground/10 flex items-center justify-center ring-4 ring-primary-foreground/20">
              <Heart className="w-16 h-16 text-primary-foreground/40" />
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-1 tracking-wide">{t.footer.mammaSperanza}</h3>
            <p className="text-primary-foreground/60 text-base italic mb-4">{t.footer.mammaNickname}</p>
            <p className="text-primary-foreground/80 text-base font-sans leading-relaxed max-w-xl mx-auto">
              {t.footer.mammaBio}
            </p>
          </div>
        </div>
      </div>

      {/* Die Fratelli */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-12 tracking-wide">{t.footer.theFratelli}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Domenico */}
            <div className="text-center">
              <div className="w-52 h-52 md:w-56 md:h-56 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary-foreground/20">
                <img 
                  src={domenicoImage} 
                  alt="Domenico Speranza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-1 tracking-wide">Domenico Speranza</h3>
              <p className="text-primary-foreground/60 text-base italic mb-4">{t.footer.domenicoNickname}</p>
              <p className="text-primary-foreground/80 text-base font-sans leading-relaxed max-w-sm mx-auto">
                {t.footer.domenicoBio}
              </p>
            </div>

            {/* Nicola */}
            <div className="text-center">
              <div className="w-52 h-52 md:w-56 md:h-56 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary-foreground/20">
                <img 
                  src={nicolaImage} 
                  alt="Nicola Speranza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-1 tracking-wide">Nicola Speranza</h3>
              <p className="text-primary-foreground/60 text-base italic mb-4">{t.footer.nicolaNickname}</p>
              <p className="text-primary-foreground/80 text-base font-sans leading-relaxed max-w-sm mx-auto">
                {t.footer.nicolaBio}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Kontakt & Info */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Kontakt */}
          <div>
            <h3 className="font-serif font-semibold text-xl mb-5 tracking-wide">{t.footer.contact}</h3>
            <div className="space-y-3 text-base font-sans text-primary-foreground/80">
              <a href="tel:+4989515196" className="flex items-center justify-center md:justify-start gap-3 hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4" />
                089 51519696
              </a>
              <a href="mailto:info@ristorantestoria.de" className="flex items-center justify-center md:justify-start gap-3 hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4" />
                info@ristorantestoria.de
              </a>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <MapPin className="h-4 w-4" />
                Augustenstraße 37, 80333 München
              </div>
            </div>
          </div>

          {/* Öffnungszeiten */}
          <div>
            <h3 className="font-serif font-semibold text-xl mb-5 tracking-wide">{t.footer.openingHours}</h3>
            <div className="space-y-2 text-base font-sans text-primary-foreground/80">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Clock className="h-4 w-4" />
                <span>{t.footer.monFri}: 09:00 - 01:00</span>
              </div>
              <div className="pl-7">{t.footer.satSun}: 12:00 - 01:00</div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif font-semibold text-xl mb-5 tracking-wide">{t.footer.legal}</h3>
            <div className="space-y-3 text-base font-sans text-primary-foreground/80">
              <Link to="/impressum" className="block hover:text-primary-foreground transition-colors">{t.footer.imprint}</Link>
              <Link to="/datenschutz" className="block hover:text-primary-foreground transition-colors">{t.footer.privacy}</Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-10 pt-8 text-center text-base font-sans text-primary-foreground/60">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
