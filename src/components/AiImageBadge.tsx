import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Kennzeichnung für KI-generierte/-substanziell-bearbeitete Bilder (EU-KI-VO Art. 50).
 * Kommerzielle Inhalte fallen NICHT unter die abgeschwächte Ausnahme für künstlerische/
 * satirische Werke (Art. 50(4)) — die Kennzeichnung muss daher dauerhaft sichtbar und ohne
 * Interaktion wahrnehmbar sein, nicht nur bei Hover oder nur in Metadaten. Reine
 * Standard-Bearbeitung (Zuschnitt, Farbkorrektur, Hochskalieren) ohne substanzielle
 * inhaltliche Änderung fällt laut Art. 50(2) NICHT unter die Kennzeichnungspflicht — dieses
 * Badge daher nur auf Bildern einsetzen, deren Inhalt tatsächlich KI-generiert oder
 * substanziell KI-verändert wurde, nicht auf jedem retuschierten Foto.
 *
 * Platzierung: als Sibling neben dem <img> in einem position:relative-Container.
 */
const AiImageBadge = ({ className = "" }: { className?: string }) => {
  const { t } = useLanguage();
  return (
    <span
      role="note"
      aria-label={t.common.aiImageLabel}
      title={t.common.aiImageLabel}
      className={`absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium leading-none text-white/90 ${className}`}
    >
      <Sparkles className="w-3 h-3" aria-hidden="true" />
      {t.common.aiImageLabelShort}
    </span>
  );
};

export default AiImageBadge;
