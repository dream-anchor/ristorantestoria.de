import { ArrowRight } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { isFilmfestActive } from "@/config/seasonalFlags";

/**
 * Dezente, saisonale Hinweise auf der Reservierungsseite – datumsgesteuert.
 *
 * ▸ Filmfest München: nur im Festivalzeitraum (26.6.–5.7.2026) → Link zur Filmfest-Seite.
 *
 * Nutzt dieselbe Flag-Logik wie die Startseiten-Banner (seasonalFlags.ts).
 * Bewusst schlank gehalten, damit das Reservierungs-Widget nicht verdrängt wird.
 */
const HINT_LABELS = {
  de: {
    filmfest: "Tisch während des Filmfests",
  },
  en: {
    filmfest: "A table during Filmfest München",
  },
  it: {
    filmfest: "Un tavolo durante il Filmfest München",
  },
  fr: {
    filmfest: "Une table pendant le Filmfest München",
  },
} as const;

const ReservationSeasonalHints = () => {
  const { language } = useLanguage();
  const filmfest = isFilmfestActive();

  if (!filmfest) return null;

  const labels = HINT_LABELS[language as keyof typeof HINT_LABELS] ?? HINT_LABELS.de;
  const pill =
    "inline-flex items-center gap-1.5 text-sm text-primary/80 hover:text-primary border border-primary/20 bg-primary/5 rounded-full px-4 py-2 transition-colors";

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
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
