import { ArrowRight } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { isWmActive, isFilmfestActive } from "@/config/seasonalFlags";

/**
 * Dezente, saisonale Hinweise auf der Reservierungsseite – datumsgesteuert.
 *
 * ▸ WM 2026: bis einschließlich 19.7.2026 → Link zur WM-Seite.
 * ▸ Filmfest München: nur im Festivalzeitraum (26.6.–5.7.2026) → Link zur Filmfest-Seite.
 *
 * Beide nutzen dieselbe Flag-Logik wie die Startseiten-Banner (seasonalFlags.ts).
 * Bewusst schlank gehalten, damit das Reservierungs-Widget nicht verdrängt wird.
 */
const HINT_LABELS = {
  de: {
    wm: "Tisch für ein WM-Spiel sichern",
    filmfest: "Tisch während des Filmfests",
  },
  en: {
    wm: "Reserve a table for a World Cup match",
    filmfest: "A table during Filmfest München",
  },
  it: {
    wm: "Prenota un tavolo per una partita dei Mondiali",
    filmfest: "Un tavolo durante il Filmfest München",
  },
  fr: {
    wm: "Réservez une table pour un match de la Coupe du monde",
    filmfest: "Une table pendant le Filmfest München",
  },
} as const;

const ReservationSeasonalHints = () => {
  const { language } = useLanguage();
  const wm = isWmActive();
  const filmfest = isFilmfestActive();

  if (!wm && !filmfest) return null;

  const labels = HINT_LABELS[language as keyof typeof HINT_LABELS] ?? HINT_LABELS.de;
  const pill =
    "inline-flex items-center gap-1.5 text-sm text-primary/80 hover:text-primary border border-primary/20 bg-primary/5 rounded-full px-4 py-2 transition-colors";

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {wm && (
        <LocalizedLink to="wm-2026-public-viewing-muenchen" className={pill}>
          {labels.wm}
          <ArrowRight className="w-3.5 h-3.5" />
        </LocalizedLink>
      )}
      {filmfest && (
        <LocalizedLink to="filmfest-muenchen" className={pill}>
          {labels.filmfest}
          <ArrowRight className="w-3.5 h-3.5" />
        </LocalizedLink>
      )}
    </div>
  );
};

export default ReservationSeasonalHints;
