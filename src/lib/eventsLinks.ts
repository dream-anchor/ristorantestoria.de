/**
 * Centralized deep-link builder for events-storia.de/kontakt (MAESTRO Contact
 * Widget). Use a preset for each source page CTA so the funnel pre-fills
 * intent/occasion/people via query params on the widget's landing page.
 */

export type AnfrageParams = {
  intent?: "inhouse" | "delivery";
  occasion?:
    | "firmenfeier"
    | "weihnachtsfeier"
    | "hochzeit"
    | "geburtstag"
    | "sonstiges";
  people?: string;
  utm_source?: string;
  utm_campaign?: string;
};

const BASE = "https://www.events-storia.de/kontakt";

export function buildEventsAnfrageUrl(params: AnfrageParams = {}): string {
  const sp = new URLSearchParams();
  if (params.intent) sp.set("intent", params.intent);
  if (params.occasion) sp.set("occasion", params.occasion);
  if (params.people) sp.set("people", params.people);
  sp.set("utm_source", params.utm_source ?? "ristorante");
  if (params.utm_campaign) sp.set("utm_campaign", params.utm_campaign);
  return `${BASE}?${sp.toString()}`;
}

/** Per-source-page presets. */
export const EVENTS_LINKS = {
  firmenfeier: buildEventsAnfrageUrl({
    intent: "inhouse",
    occasion: "firmenfeier",
    utm_campaign: "firmenfeier",
  }),
  weihnachtsfeier: buildEventsAnfrageUrl({
    intent: "inhouse",
    occasion: "weihnachtsfeier",
    utm_campaign: "weihnachtsfeier",
  }),
  silvester: buildEventsAnfrageUrl({
    intent: "inhouse",
    occasion: "sonstiges",
    utm_campaign: "silvester",
  }),
  hochzeit: buildEventsAnfrageUrl({
    intent: "inhouse",
    occasion: "hochzeit",
    utm_campaign: "hochzeit",
  }),
  geburtstag: buildEventsAnfrageUrl({
    intent: "inhouse",
    occasion: "geburtstag",
    utm_campaign: "geburtstag",
  }),
  catering: buildEventsAnfrageUrl({
    intent: "delivery",
    utm_campaign: "catering",
  }),
  reisegruppen: buildEventsAnfrageUrl({
    intent: "inhouse",
    occasion: "sonstiges",
    people: "26-50",
    utm_campaign: "reisegruppen",
  }),
  homepageCrossSell: buildEventsAnfrageUrl({
    utm_campaign: "homepage_cross_sell",
  }),
} as const;

/**
 * Gutschein-Shop auf events-storia.de.
 * Eigener fester Pfad (kein /anfrage-Funnel). Klick-Tracking: voucher_click.
 */
export const VOUCHER_SHOP_URL =
  "https://www.events-storia.de/gutschein/?utm_source=ristorante&utm_campaign=gutschein";
