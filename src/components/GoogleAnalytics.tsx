import { useEffect } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useLocation } from "react-router-dom";

/**
 * Google Analytics 4 — Consent-gated Script Loading
 *
 * Architektur (3 Schichten):
 * 1. index.html:          gtag('consent', 'default', {denied})  — sync, vor allem anderen
 * 2. CookieConsentContext: gtag('consent', 'update', {granted})  — nach User-Interaktion
 * 3. Diese Komponente:    gtag.js Library laden + config/pageview — erst nach Consent
 *
 * WICHTIG: Consent-Defaults MÜSSEN in index.html bleiben (Google-Vorgabe: "as early as possible").
 * window.gtag + window.dataLayer existieren bereits aus index.html — hier NICHT erneut deklarieren.
 */

const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-G44C983YRJ";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GTAG_SCRIPT_SELECTOR = 'script[src*="googletagmanager.com/gtag/js"]';

const GoogleAnalytics = () => {
  const { hasConsent } = useCookieConsent();
  const location = useLocation();
  const hasStatisticsConsent = hasConsent("statistics");

  useEffect(() => {
    if (!hasStatisticsConsent) return;

    // Prüfe ob gtag.js Library-Script bereits im DOM existiert
    // (window.gtag existiert IMMER durch Consent-Defaults in index.html — kein geeigneter Check)
    const scriptExists = document.querySelector(GTAG_SCRIPT_SELECTOR);

    if (!scriptExists) {
      // Erstmaliges Laden: Script einfügen + via dataLayer-Queue initialisieren
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);

      // Queue: gtag.js verarbeitet diese Einträge nach dem Laden
      window.gtag("js", new Date());
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_location: window.location.href,
      });
      return;
    }

    // Script existiert bereits: SPA-Navigation Pageview senden
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_location: window.location.href,
    });
  }, [hasStatisticsConsent, location.pathname]);

  return null;
};

export default GoogleAnalytics;
