import LocalizedLink from "@/components/LocalizedLink";
import EmailLink, { EmailAddress } from "@/components/EmailLink";
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle } from "lucide-react";
import domenicoImage from "@/assets/domenico-speranza.webp";
import storiaLogo from "@/assets/storia-logo.webp";
import nicolaImage from "@/assets/nicola-speranza.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { FACTS } from "@/config/facts";
import { trackEvent } from "@/lib/analytics";
import { VOUCHER_SHOP_URL } from "@/lib/eventsLinks";

const Footer = () => {
  const { t } = useLanguage();

  // Public-Viewing-Seite ist seit dem WM-2026-Umbau evergreen (kein Saison-Filter mehr nötig).
  const eventsGroupsLinks = t.footer.eventsGroupsLinks;

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* La Famiglia Speranza */}
      <div id="la-famiglia" className="border-b border-primary-foreground/5">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-xl md:text-2xl font-serif font-medium tracking-[0.3em] uppercase mb-14 text-primary-foreground/90">{t.footer.theFamily}</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-14 md:gap-20">
            {/* Domenico */}
            <div className="text-center group">
              <div className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-5 rounded-full overflow-hidden ring-1 ring-primary-foreground/20 shadow-xl transition-transform duration-300 group-hover:scale-105">
                <img
                  src={domenicoImage}
                  alt="Domenico Speranza – Gründer Ristorante STORIA München"
                  width={176}
                  height={176}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-serif italic tracking-wider text-primary-foreground/90">Domenico</p>
            </div>

            {/* Mamma */}
            <div className="text-center group">
              <div className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-5 rounded-full overflow-hidden ring-1 ring-primary-foreground/20 shadow-xl transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/mamma-speranza-kueche-storia-muenchen.webp"
                  alt="Mamma Speranza in der Küche im STORIA München"
                  width="144"
                  height="176"
                  loading="lazy"
                  decoding="async"
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
                  alt="Nicola Speranza – Familie STORIA München Maxvorstadt"
                  width={176}
                  height={176}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-serif italic tracking-wider text-primary-foreground/90">Nicola</p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Anlässe & Gruppen Navigation */}
      <div className="border-b border-primary-foreground/5">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/80 mb-5 text-center font-serif">
            {t.footer.eventsGroupsTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {eventsGroupsLinks.map((link: { label: string; slug: string }) => (
              <LocalizedLink
                key={link.slug}
                to={link.slug}
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </LocalizedLink>
            ))}
            {/* Geschenkgutschein – externer Shop (events-storia.de) */}
            <a
              href={VOUCHER_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("voucher_click", { location: "footer" })}
              className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors underline-offset-4 hover:underline"
            >
              {t.voucherCta.footerLink} ↗
            </a>
          </div>
        </div>
      </div>

      {/* Kontakt & Öffnungszeiten */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            {/* Kontakt */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="font-serif font-medium text-base tracking-[0.2em] uppercase mb-6 text-primary-foreground/90">{t.footer.contact}</h3>
              <div className="space-y-3 text-base font-sans text-primary-foreground/70">
              <a href={`tel:${FACTS.phoneTel}`} className="flex items-center justify-center md:justify-start gap-2.5 hover:text-primary-foreground transition-colors">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {FACTS.phone}
                </a>
                <EmailLink className="flex items-center justify-center md:justify-start gap-2.5 hover:text-primary-foreground transition-colors">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <EmailAddress />
                </EmailLink>
                <a
                  href={`https://wa.me/${FACTS.whatsappTel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2.5 hover:text-[#25D366] transition-colors"
                  title={`WhatsApp: ${FACTS.whatsapp}`}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              <a
                  href="https://maps.google.com/maps?cid=3762699313835683563"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center md:justify-start gap-2.5 hover:text-primary-foreground transition-colors"
                  title="STORIA auf Google Maps"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>STORIA ristorante pizzeria bar<br />{FACTS.address.full}</span>
                </a>
              </div>
            </div>

            {/* STORIA Logo - Mitte */}
            <div className="flex flex-col items-center justify-center order-first md:order-none py-6 md:py-0">
              <img 
                src={storiaLogo}
                alt="STORIA – Italienisches Restaurant München Logo"
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
                className="h-16 md:h-20 w-auto brightness-0 invert opacity-20"
              />
            </div>

            {/* Öffnungszeiten */}
            <div className="space-y-4 text-center md:text-right">
              <h3 className="font-serif font-medium text-base tracking-[0.2em] uppercase mb-6 text-primary-foreground/90">{t.footer.openingHours}</h3>
              <div className="space-y-2 text-base font-sans text-primary-foreground/70">
                <div className="flex items-center justify-center md:justify-end gap-2.5">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{t.footer.monFri}: {FACTS.openingHours.weekday.open} – {FACTS.openingHours.weekday.close}</span>
                </div>
                <p>{t.footer.satSun}: {FACTS.openingHours.weekend.open} – {FACTS.openingHours.weekend.close}</p>
                <p className="pt-2 italic text-primary-foreground/70">{t.footer.welcomeMessage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="border-t border-primary-foreground/5 mt-14 pt-10 text-center">
          <p className="text-sm font-sans text-primary-foreground/80">
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-sm font-sans text-primary-foreground/80">
            <LocalizedLink to="impressum" className="hover:text-primary-foreground transition-colors">{t.footer.imprint}</LocalizedLink>
            <span className="opacity-50">·</span>
            <LocalizedLink to="datenschutz" className="hover:text-primary-foreground transition-colors">{t.footer.privacy}</LocalizedLink>
            <span className="opacity-50">·</span>
            <LocalizedLink to="cookie-richtlinie" className="hover:text-primary-foreground transition-colors">{t.legal.cookies}</LocalizedLink>
            <span className="opacity-50">·</span>
            <LocalizedLink to="agb-restaurant" className="hover:text-primary-foreground transition-colors">{t.legal.agb}</LocalizedLink>
            <span className="opacity-50">·</span>
            <LocalizedLink to="lebensmittelhinweise" className="hover:text-primary-foreground transition-colors">{t.legal.foodInfo}</LocalizedLink>
            <span className="opacity-50">·</span>
            <LocalizedLink to="faq" className="hover:text-primary-foreground transition-colors font-medium">FAQ</LocalizedLink>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs font-sans text-primary-foreground/80">
            <a
              href="https://www.instagram.com/ristorante_storia/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 min-h-[48px] p-2 hover:text-primary-foreground transition-colors"
              title="Instagram @ristorante_storia"
            >
              <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
