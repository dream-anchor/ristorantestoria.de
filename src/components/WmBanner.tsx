import { ArrowRight } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Zeitlich begrenzter Saison-Banner zur Fußball-WM 2026 (Startseite, nur DE).
 *
 * ▸ NACH DEM TURNIER ENTFERNEN (Finale: 19. Juli 2026):
 *   Der Banner blendet sich ab dem 20.07.2026 automatisch aus (WM_END).
 *   Zum vollständigen Aufräumen: <WmBanner /> aus src/pages/Index.tsx
 *   entfernen und diese Datei löschen.
 *
 * Wird serverseitig gerendert (kein useEffect-Gate), damit der interne Link
 * bereits im prerenderten HTML steht und crawlbar ist.
 */
const WM_END = new Date("2026-07-20T00:00:00+02:00").getTime();

const WmBanner = () => {
  const { language } = useLanguage();

  if (language !== "de" || Date.now() >= WM_END) return null;

  return (
    <aside className="my-6 mx-4 md:mx-0 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <span
          className="block text-xs font-semibold uppercase tracking-[0.22em] mb-2"
          style={{ color: "#b07d29" }}
        >
          WM 2026
        </span>
        <p className="font-serif text-2xl md:text-3xl leading-tight text-primary">
          Alle Spiele live auf der Terrasse
        </p>
      </div>
      <LocalizedLink
        to="wm-2026-public-viewing-muenchen"
        className="inline-flex items-center gap-1.5 shrink-0 text-base font-medium text-primary hover:underline underline-offset-4"
      >
        Zum Spielplan
        <ArrowRight className="w-4 h-4" />
      </LocalizedLink>
    </aside>
  );
};

export default WmBanner;
