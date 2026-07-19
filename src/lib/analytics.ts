/**
 * Zentraler Admin-Guard: Auf /admin/-Routen dürfen KEINE GA4/gtag-Events feuern.
 * GA4 kann intern nicht nach Pfad filtern, daher wird die interne Admin-Nutzung
 * hier (und in GoogleAnalytics.tsx) an der Quelle unterdrückt.
 */
export const isAdminPath = (): boolean =>
  typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

/**
 * GA4 Event Tracking Helper
 * Wraps window.gtag — safe to call even before consent (Consent Mode v2 handles filtering).
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (isAdminPath()) return; // Admin-Bereich: keine GA4-Events
  window.gtag("event", eventName, params);
};
