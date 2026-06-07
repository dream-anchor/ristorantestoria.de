import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";

// Zeitlich begrenzter Kampagnen-Banner zur Fußball-WM 2026.
// Sichtbar bis einschließlich Finaltag (19. Juli 2026), nur auf der
// deutschsprachigen Startseite. Danach rendert die Komponente nichts mehr.
const WM_END = new Date("2026-07-20T00:00:00+02:00").getTime();

const WmBanner = () => {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(Date.now() < WM_END);
  }, []);

  if (!visible || language !== "de") return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 my-6 mx-4 md:mx-0">
      <span className="text-2xl shrink-0" aria-hidden="true">{"⚽"}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">WM 2026 – alle Spiele live auf der überdachten Terrasse</p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <LocalizedLink
          to="wm-2026-public-viewing-muenchen"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
        >
          Public Viewing im STORIA
          <ArrowRight className="w-3.5 h-3.5" />
        </LocalizedLink>
      </div>
    </div>
  );
};

export default WmBanner;
