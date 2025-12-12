import { useEffect } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-P7H48RC2W1";

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

    // Script bereits geladen? Dann nur Pageview tracken
    if (window.gtag) {
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

    // gtag initialisieren
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
  }, [hasStatisticsConsent, location.pathname]);

  return null;
};

export default GoogleAnalytics;
