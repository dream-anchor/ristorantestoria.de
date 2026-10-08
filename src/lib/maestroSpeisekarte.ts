// Speisekarten aus MAESTRO (P8 Speisekarten-Neubau): entdeckt alle veröffentlichten Karten des
// Mandanten über GET /api/public/speisekarten (keine festen Slugs, Antoine 08.10.2026), lädt jede Karte
// je Sprache über /api/public/speisekarte?karte=<slug> und legt sie ins bestehende Menu-Format (useMenu),
// damit MenuStructuredData, BotContent und der Prerender unverändert weiterarbeiten. Welche Kategorien
// öffentlich sind, entscheidet MAESTRO beim Veröffentlichen (Momentaufnahme) — hier wird nichts gefiltert. Eingeschaltet über die Build-Variable
// VITE_MAESTRO_SPEISEKARTE=1 (Repo-Variable MAESTRO_SPEISEKARTE); ohne sie bleibt der Supabase-Weg.
// Kein Fallback-JSON: ist die API gestört oder die Karte leer, wird geworfen — im Build scheitert
// damit der Prerender und die alte Seite bleibt online.

export const MAESTRO_API = "https://storia.schrittmacher.ai";

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
  preis_hinweis?: string | null;
}
interface Kategorie {
  name: string;
  ab_preis?: { cents: number; text: string } | null;
  positionen: Position[];
}
interface Karte {
  slug: string;
  name: string;
  kategorien: Kategorie[];
}
interface KartenListe {
  data: { karten: { slug: string | null; name: string; kartenart: { id: string; name: string } | null }[] };
}
export interface SpeisekarteAntwort {
  data: { sprache: string; karten: Karte[]; stand: string; html: string };
}

const suffix = (s: Sprache) => (s === "de" ? "" : `_${s}`);

/** Reine Zusammenführung: je Karte die vier Sprachantworten (gleiche Reihenfolge je Sprache) ins Menu-Format. */
export function zusammenfuehren(menuType: string, karten: Record<Sprache, SpeisekarteAntwort>[]) {
  if (!karten.length) throw new Error("MAESTRO: keine veröffentlichte Speisekarte");
  const lokal = (name: string, wert: (s: Sprache) => string | null | undefined) =>
    Object.fromEntries(SPRACHEN.map((s) => [`${name}${suffix(s)}`, wert(s) ?? null]));

  const teile = karten.map((antworten) => {
    const de = antworten.de.data.karten[0];
    if (!de || !de.kategorien?.length) throw new Error(`MAESTRO-Speisekarte "${de?.slug ?? "?"}" ist leer`);
    const karte = (s: Sprache) => antworten[s].data.karten[0];
    const categories = de.kategorien.map((kat, k) => ({
      id: `maestro-${de.slug}-${k}`,
      ...lokal("name", (s) => karte(s)?.kategorien?.[k]?.name ?? (s === "de" ? kat.name : null)),
      ...lokal("description", () => null),
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
    }));
    // Fertiges HTML-Fragment je Sprache für das Speisekarten-Widget (gleiches preis_layout wie im Widget).
    const reiter = {
      slug: de.slug,
      name: de.name, // Kartenname bleibt in der API deutsch -> für alle Sprachen gleich.
      stand: antworten.de.data.stand,
      html: Object.fromEntries(SPRACHEN.map((s) => [s, antworten[s].data.html])) as Record<Sprache, string>,
    };
    return { categories, reiter };
  });

  const titel = teile.map((t) => t.reiter.name).join(" · ");
  return {
    id: `maestro-${menuType}`,
    menu_type: menuType,
    ...lokal("title", () => titel),
    ...lokal("subtitle", () => null),
    is_published: true,
    categories: teile.flatMap((t) => t.categories).map((c, k) => ({ ...c, sort_order: k })),
    maestro: { karten: teile.map((t) => t.reiter) },
  };
}

const holeJson = async <T>(pfad: string): Promise<T> => {
  const res = await fetch(`${MAESTRO_API}${pfad}`);
  if (!res.ok) throw new Error(`MAESTRO ${pfad}: HTTP ${res.status}`);
  return (await res.json()) as T;
};

/** Alle veröffentlichten Karten (Liste in MAESTRO-Reihenfolge), je Karte die vier Sprachen. */
export async function ladeMaestroKarten(): Promise<Record<Sprache, SpeisekarteAntwort>[]> {
  const liste = await holeJson<KartenListe>("/api/public/speisekarten");
  const slugs = (liste.data?.karten ?? []).map((k) => k.slug).filter((s): s is string => !!s);
  if (!slugs.length) throw new Error("MAESTRO: keine veröffentlichte Speisekarte");
  return Promise.all(
    slugs.map(async (slug) =>
      Object.fromEntries(
        await Promise.all(SPRACHEN.map(async (s) => [s, await holeJson<SpeisekarteAntwort>(`/api/public/speisekarte?karte=${encodeURIComponent(slug)}&lang=${s}`)] as const)),
      ) as Record<Sprache, SpeisekarteAntwort>,
    ),
  );
}

// Ein Ladevorgang je Build bzw. Seitenaufruf, egal wie viele Seiten (food/drinks/lunch) fragen.
let geladen: ReturnType<typeof ladeMaestroKarten> | null = null;

const alleKarten = () =>
  (geladen ??= ladeMaestroKarten().catch((e) => {
    geladen = null; // Fehler nicht festhalten
    throw e;
  }));

/** Alle Seiten mit Speisekarte zeigen bei aktivem Schalter dieselben Karten als Reiter. */
export async function ladeMaestroMenu(menuType: string) {
  return zusammenfuehren(menuType, await alleKarten());
}

/**
 * Messe-Seite (147/P9, Antoine 08.10.2026): „Preise kommen immer aus den Menüs der Speisekarten.“
 * Liefert die Menü-Positionen der veröffentlichten Karten in einer Sprache samt „ab“-Preis — der
 * „ab“-Preis ist das `ab_preis` der Menü-Kategorie aus MAESTRO (@maestro/pricing), hier wird nichts gerechnet.
 * Fehlt die Menü-Kategorie oder ist sie mehrdeutig, wird geworfen (Prerender scheitert laut).
 */
// ponytail: Menü-Kategorie = Kategoriename (deutsch) enthält „Menü“/„Menu“; sobald MAESTRO ein eigenes
// Kennzeichen liefert (z. B. Kartenart „Menüs“), hier umstellen.
export const IST_MENUE_KATEGORIE = /men[uü]/i;

export function messeMenues(karten: Record<Sprache, SpeisekarteAntwort>[], sprache: Sprache) {
  const treffer = karten.flatMap((k) =>
    k.de.data.karten[0]?.kategorien
      ?.map((kat, i) => ({ de: kat, lokal: k[sprache].data.karten[0]?.kategorien?.[i] ?? kat }))
      .filter((x) => IST_MENUE_KATEGORIE.test(x.de.name) && x.de.positionen.length) ?? [],
  );
  if (treffer.length !== 1) throw new Error(`MAESTRO-Messe: ${treffer.length} Menü-Kategorien gefunden, erwartet genau 1`);
  const { lokal } = treffer[0];
  if (!lokal.ab_preis) throw new Error("MAESTRO-Messe: Menü-Kategorie ohne ab_preis");
  return {
    kategorie: lokal.name,
    ab_preis: lokal.ab_preis,
    menues: lokal.positionen.map((p) => ({
      name: p.name,
      gaenge: p.beschreibung,
      preis_cents: p.preis_cents,
      preis_text: p.preis_text,
      preis_hinweis: p.preis_hinweis ?? null, // z. B. Weinbegleitung, wie auf der Karte eingetragen
    })),
  };
}

export async function ladeMaestroMesseMenues(sprache: Sprache) {
  return messeMenues(await alleKarten(), sprache);
}
