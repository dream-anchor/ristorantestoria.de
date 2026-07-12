import { useLocation } from "react-router-dom";
import { Phone, UtensilsCrossed } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { getLocalizedPath } from "@/config/routes";
import { trackEvent } from "@/lib/analytics";

/**
 * Mobile Conversion-Leiste (nur < 768px).
 *
 * Bewusste Ausnahme zur Memory-Regel „keine Floating-Buttons auf Mobile":
 * fixe Bottom-Conversion-Leiste (Anrufen / WhatsApp / Reservieren).
 *
 * Sichtbarkeit: an Banner-Dismiss gekoppelt (NICHT an statistics-Consent).
 * Wer Cookies ablehnt, sieht die Leiste trotzdem — die Buttons funktionieren
 * als reine Links auch ohne Tracking. Nur `trackEvent` ist intern an
 * statistics-Consent gebunden.
 *
 * Reservieren-Ziel: interne /reservierung-Seite (dort liegt das OpenTable-
 * Widget). So bleibt `reservation_click` eindeutig EIN Ereignistyp.
 *
 * Doppelzählung: alle Links tragen `data-no-global-track` und feuern
 * `trackEvent` selbst genau einmal. Die globale Delegation in
 * GoogleAnalytics.tsx überspringt Elemente innerhalb `[data-no-global-track]`.
 */
const MobileActionBar = () => {
  const isMobile = useIsMobile();
  const { language, t } = useLanguage();
  const { showBanner } = useCookieConsent();
  const location = useLocation();

  if (!isMobile) return null;
  if (location.pathname.startsWith("/admin")) return null;
  // An Banner-Dismiss gekoppelt: erst zeigen, wenn der Cookie-Banner weg ist.
  if (showBanner) return null;

  const itemClasses =
    "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs font-semibold";

  return (
    <nav
      aria-label={t.floatingActions.reserve}
      data-no-global-track
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href="tel:+498951519696"
        onClick={() => trackEvent("phone_click", { source: "mobile_bar", page: window.location.pathname })}
        className={`${itemClasses} text-foreground`}
      >
        <Phone className="h-5 w-5" />
        <span>{t.floatingActions.call}</span>
      </a>

      <a
        href="https://wa.me/491636033912"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click", { source: "mobile_bar", page: window.location.pathname })}
        className={`${itemClasses} text-[#25D366]`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>{t.floatingActions.whatsapp}</span>
      </a>

      {/* Primär-Conversion: dominanter (breiter + Vollflächen-Akzent). */}
      <a
        href={getLocalizedPath("reservierung", language)}
        onClick={() => trackEvent("reservation_click", { source: "mobile_bar", page: window.location.pathname })}
        className={`${itemClasses} flex-[1.6] bg-primary text-primary-foreground`}
      >
        <UtensilsCrossed className="h-5 w-5" />
        <span>{t.floatingActions.reserve}</span>
      </a>
    </nav>
  );
};

export default MobileActionBar;
