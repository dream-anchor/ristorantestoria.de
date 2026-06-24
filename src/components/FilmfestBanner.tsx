import { ArrowRight } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { isFilmfestActive } from "@/config/seasonalFlags";

/**
 * Zeitlich begrenzter Saison-Banner zum Filmfest München (Startseite, nur DE).
 *
 * ▸ Sichtbar nur im Festivalzeitraum (26.6.–5.7.2026, FILMFEST_START/_END in
 *   src/config/seasonalFlags.ts). Blendet sich danach automatisch aus.
 *   Filmfest ist jährlich wiederkehrend – zum Wiederverwenden nächste Saison
 *   nur die Daten in seasonalFlags.ts aktualisieren.
 *
 * Wird serverseitig gerendert (kein useEffect-Gate), damit der interne Link
 * bereits im prerenderten HTML steht und crawlbar ist. Stapelt sich unter dem
 * WM-Banner (eigener Block), wenn beide Zeiträume aktiv sind – keine Überlagerung.
 */
const FilmfestBanner = () => {
  const { language } = useLanguage();

  if (language !== "de" || !isFilmfestActive()) return null;

  return (
    <aside className="my-6 mx-4 md:mx-0 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <span
          className="block text-xs font-semibold uppercase tracking-[0.22em] mb-2"
          style={{ color: "#8a6220" }}
        >
          Filmfest München
        </span>
        <p className="font-serif text-2xl md:text-3xl leading-tight text-primary">
          Premierendinner & Branchenabende im Festivalzeitraum
        </p>
      </div>
      <LocalizedLink
        to="filmfest-muenchen"
        className="inline-flex items-center gap-1.5 shrink-0 text-base font-medium text-primary hover:underline underline-offset-4"
      >
        Filmfest München bei STORIA
        <ArrowRight className="w-4 h-4" />
      </LocalizedLink>
    </aside>
  );
};

export default FilmfestBanner;
