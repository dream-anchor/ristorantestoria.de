// Speisekarten aus MAESTRO (P8 Speisekarten-Neubau): liest /api/public/speisekarte je Sprache und
// legt die Antworten ins bestehende Menu-Format (useMenu), damit MenuStructuredData, BotContent und
// der Prerender unverändert weiterarbeiten. Eingeschaltet über die Build-Variable
// VITE_MAESTRO_SPEISEKARTE=1 (Repo-Variable MAESTRO_SPEISEKARTE); ohne sie bleibt der Supabase-Weg.
// Kein Fallback-JSON: ist die API gestört oder die Karte leer, wird geworfen — im Build scheitert
// damit der Prerender und die alte Seite bleibt online.

export const MAESTRO_API = "https://storia.schrittmacher.ai";

// ponytail: feste Zuordnung Seite -> MAESTRO-Kartenslug (deutscher Slug); nach dem P7-Import gegen
// GET /api/public/speisekarten prüfen und hier anpassen, falls die Slugs anders heißen.
export const MAESTRO_KARTEN: Record<string, string> = {
  food: "speisekarte",
  drinks: "getraenke",
  lunch: "mittags-menu",
};

export const SPRACHEN = ["de", "en", "it", "fr"] as const;
type Sprache = (typeof SPRACHEN)[number];

export const maestroSpeisekarteAktiv = (): boolean => {
  const v = import.meta.env?.VITE_MAESTRO_SPEISEKARTE;
  return v === "1" || v === "true";
};

interface Position {
  name: string;
  beschreibung: string | null;
  preis_cents: number | null;
  preis_text: string | null;
}
interface Kategorie {
  name: string;
  positionen: Position[];
}
interface Karte {
  slug: string;
  name: string;
  kategorien: Kategorie[];
}
export interface SpeisekarteAntwort {
  data: { sprache: string; karten: Karte[]; stand: string; html: string };
}

const suffix = (s: Sprache) => (s === "de" ? "" : `_${s}`);

/** Reine Zusammenführung der vier Sprachantworten (gleiche Reihenfolge je Sprache) ins Menu-Format. */
export function zusammenfuehren(menuType: string, antworten: Record<Sprache, SpeisekarteAntwort>) {
  const de = antworten.de.data.karten[0];
  if (!de || !de.kategorien?.length) throw new Error(`MAESTRO-Speisekarte "${menuType}" ist leer`);
  const karte = (s: Sprache) => antworten[s].data.karten[0];
  const lokal = (name: string, wert: (s: Sprache) => string | null | undefined) =>
    Object.fromEntries(SPRACHEN.map((s) => [`${name}${suffix(s)}`, wert(s) ?? null]));

  return {
    id: `maestro-${de.slug}`,
    menu_type: menuType,
    // Kartenname bleibt in der API deutsch -> für alle Sprachen gleich.
    ...lokal("title", () => de.name),
    ...lokal("subtitle", () => null),
    is_published: true,
    categories: de.kategorien.map((kat, k) => ({
      id: `maestro-${de.slug}-${k}`,
      ...lokal("name", (s) => karte(s)?.kategorien?.[k]?.name ?? (s === "de" ? kat.name : null)),
      ...lokal("description", () => null),
      sort_order: k,
      items: kat.positionen.map((pos, p) => {
        const in_ = (s: Sprache) => karte(s)?.kategorien?.[k]?.positionen?.[p];
        return {
          id: `maestro-${de.slug}-${k}-${p}`,
          ...lokal("name", (s) => in_(s)?.name ?? (s === "de" ? pos.name : null)),
          ...lokal("description", (s) => in_(s)?.beschreibung),
          price: pos.preis_cents == null ? null : pos.preis_cents / 100,
          ...lokal("price_display", (s) => in_(s)?.preis_text),
          sort_order: p,
        };
      }),
    })),
    // Fertiges HTML-Fragment je Sprache für das Speisekarten-Widget (gleiches preis_layout wie im Widget).
    maestro: {
      slug: de.slug,
      stand: antworten.de.data.stand,
      html: Object.fromEntries(SPRACHEN.map((s) => [s, antworten[s].data.html])) as Record<Sprache, string>,
    },
  };
}

export async function ladeMaestroMenu(menuType: string) {
  const slug = MAESTRO_KARTEN[menuType];
  if (!slug) throw new Error(`Keine MAESTRO-Karte für "${menuType}"`);
  const paare = await Promise.all(
    SPRACHEN.map(async (s) => {
      const res = await fetch(`${MAESTRO_API}/api/public/speisekarte?karte=${encodeURIComponent(slug)}&lang=${s}`);
      if (!res.ok) throw new Error(`MAESTRO-Speisekarte ${slug}/${s}: HTTP ${res.status}`);
      return [s, (await res.json()) as SpeisekarteAntwort] as const;
    }),
  );
  return zusammenfuehren(menuType, Object.fromEntries(paare) as Record<Sprache, SpeisekarteAntwort>);
}
