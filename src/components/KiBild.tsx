import type { ImgHTMLAttributes } from "react";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { KI_BADGE, KI_BILDER, type KiBildDatei } from "@/config/ki-bilder";

/**
 * Kennzeichnung KI-generierter/-bearbeiteter Bilder (Regel: docs/KI-BILDER-KENNZEICHNUNG.md).
 * Badge oben rechts + Caption unten, beide absolut — der Elternteil muss position:relative sein.
 * Für Video/Sonderfälle ohne eigenes <img>.
 */
export const KiHinweis = ({ datei }: { datei: KiBildDatei }) => {
  const { language } = useLanguage();
  const eintrag = KI_BILDER[datei];
  return (
    <>
      <span
        data-ki-badge={eintrag.kategorie}
        className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium leading-none text-white pointer-events-none"
      >
        <Sparkles className="w-3 h-3" aria-hidden="true" />
        {KI_BADGE[eintrag.kategorie][language]}
      </span>
      <span
        data-ki-caption
        className="absolute bottom-0 right-0 z-20 max-w-full bg-black/60 px-2.5 py-1 text-[11px] leading-snug text-white/95 pointer-events-none"
      >
        {eintrag.caption[language]}
      </span>
    </>
  );
};

export const kiAlt = (datei: KiBildDatei, language: keyof (typeof KI_BILDER)[KiBildDatei]["alt"]) =>
  KI_BILDER[datei].alt[language];

/** <img> mit alt aus dem Register + KiHinweis. Als Kind eines position:relative-Containers einsetzen. */
const KiBild = ({ datei, ...img }: { datei: KiBildDatei } & Omit<ImgHTMLAttributes<HTMLImageElement>, "alt">) => {
  const { language } = useLanguage();
  return (
    <>
      <img {...img} alt={kiAlt(datei, language)} />
      <KiHinweis datei={datei} />
    </>
  );
};

export default KiBild;
