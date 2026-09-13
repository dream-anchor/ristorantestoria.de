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

/**
 * GA4-Conversion-Event `generate_lead` (E2.1/E2.2).
 *
 * Dieselbe Signatur wie die bereits bestehenden, seitenlokalen `fireLead`-Kopien in
 * `OktoberfestMuenchen.tsx`, `WmPublicViewingMuenchen.tsx` und `FilmfestInquiryForm.tsx`.
 * Die drei Kopien bleiben ausdrücklich unangetastet (Bestandsschutz) — neue Aufrufer
 * nutzen diesen einen Helfer, der zusätzlich den Admin-Guard aus `trackEvent` erbt.
 *
 * `value` ist ein GA4-Schätzwert, kein Seiten-Fakt: 80 für eine Tischreservierung
 * (Wert der bestehenden Landingpage-Kopien), 1500 für eine Gruppen-/Event-Anfrage
 * (Wert aus `FilmfestInquiryForm`). Beide Zahlen sind übernommen, nicht neu erfunden.
 */
export const fireLead = (formName: string, value = 80) => {
  if (typeof window === "undefined") return;
  trackEvent("generate_lead", {
    form_name: formName,
    page_path: window.location.pathname,
    value,
    currency: "EUR",
  });
};
