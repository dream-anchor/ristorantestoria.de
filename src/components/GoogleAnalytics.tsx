import { useEffect } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-G44C983YRJ";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GoogleAnalytics = () => {
  const { hasConsent } = useCookieConsent();
  const location = useLocation();
  const hasStatisticsConsent = hasConsent("statistics");

  useEffect(() => {
    // Nur laden wenn Benutzer Statistik-Cookies akzeptiert hat
    if (!hasStatisticsConsent) return;

    // Prüfe ob gtag.js Library bereits im DOM geladen ist
    // (NICHT window.gtag prüfen — das existiert bereits durch Consent-Defaults in index.html)
    const gtagScriptLoaded = document.querySelector(
      'script[src*="googletagmanager.com/gtag/js"]'
    );

    if (gtagScriptLoaded) {
      // Library bereits geladen, nur Pageview tracken
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location.pathname,
      });
      return;
    }

    // gtag.js Script dynamisch laden
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // gtag initialisieren (dataLayer + gtag existieren bereits aus index.html Consent-Defaults)
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: location.pathname,
    });
  }, [hasStatisticsConsent, location.pathname]);

  return null;
};

export default GoogleAnalytics;
