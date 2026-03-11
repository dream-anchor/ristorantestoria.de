import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";

type Season = "valentinstag" | "ostermontag" | "terrasse" | "wild" | "weihnachtsfeier" | "silvester";

const SEASON_BY_MONTH: (Season | null)[] = [
  "valentinstag",  // Jan
  "valentinstag",  // Feb
  "ostermontag",   // Mar
  "ostermontag",   // Apr
  "terrasse",      // May
  "terrasse",      // Jun
  "terrasse",      // Jul
  "terrasse",      // Aug
  "wild",          // Sep
  "wild",          // Oct
  "weihnachtsfeier", // Nov
  "silvester",     // Dez
];

const SEASON_LINKS: Record<Season, { cta1: string; cta2?: string }> = {
  valentinstag: { cta1: "besondere-anlaesse/valentinstag-menue" },
  ostermontag: { cta1: "besondere-anlaesse/ostermontag-menue", cta2: "terrasse-muenchen" },
  terrasse: { cta1: "terrasse-muenchen", cta2: "aperitivo-muenchen" },
  wild: { cta1: "wild-essen-muenchen" },
  weihnachtsfeier: { cta1: "weihnachtsfeier-muenchen" },
  silvester: { cta1: "weihnachtsfeier-muenchen", cta2: "besondere-anlaesse/silvester" },
};

const SEASON_ICONS: Record<Season, string> = {
  valentinstag: "\u2764\ufe0f",
  ostermontag: "\ud83d\udc30",
  terrasse: "\u2600\ufe0f",
  wild: "\ud83e\udd8c",
  weihnachtsfeier: "\ud83c\udf84",
  silvester: "\ud83c\udf86",
};

const SeasonalBanner = () => {
  const { t } = useLanguage();
  const [season, setSeason] = useState<Season | null>(null);

  useEffect(() => {
    const month = new Date().getMonth();
    setSeason(SEASON_BY_MONTH[month]);
  }, []);

  if (!season) return null;

  const links = SEASON_LINKS[season];
  const icon = SEASON_ICONS[season];
  const label = t.seasonal[season].label;
  const cta1Text = t.seasonal[season].cta1;
  const cta2Text = (t.seasonal[season] as { cta2?: string }).cta2;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 my-6 mx-4 md:mx-0">
      <span className="text-2xl shrink-0" aria-hidden="true">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{label}</p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <LocalizedLink
          to={links.cta1}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
        >
          {cta1Text}
          <ArrowRight className="w-3.5 h-3.5" />
        </LocalizedLink>
        {links.cta2 && cta2Text && (
          <LocalizedLink
            to={links.cta2}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            {cta2Text}
            <ArrowRight className="w-3.5 h-3.5" />
          </LocalizedLink>
        )}
      </div>
    </div>
  );
};

export default SeasonalBanner;
