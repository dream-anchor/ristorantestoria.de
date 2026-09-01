import { useMemo, useState } from "react";
import { Check } from "lucide-react";

/**
 * Zerlegt einen Beschreibungstext in einzelne Zeilen:
 * 1. Nach echten Zeilenumbrüchen splitten, trimmen, leere Zeilen entfernen.
 * 2. Wenn nur EINE lange Zeile entsteht: vor Markern umbrechen
 *    ("1. Gang", Bullet-Zeichen, " – " gefolgt von Großbuchstaben).
 */
export function splitDescription(text: string): string[] {
  const raw = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (raw.length <= 1 && raw[0]) {
    return raw[0]
      .split(/(?=\d+\.\s*Gang)|\s*[•·]\s*|\s+[–-]\s+(?=[A-ZÄÖÜ])/gi)
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return raw;
}

/**
 * Erkennt Überschriften-Zeilen (Gänge, Kategorien) innerhalb einer Menü-Beschreibung.
 */
export function isHeadingLine(line: string): boolean {
  const l = line.trim();
  if (!l) return false;
  if (l.endsWith(":")) return true;
  return (
    /^(\d+\s*[-–]?\s*)?(gang|gänge)/i.test(l) ||
    /^\d+\.\s*(gang|vorspeise|hauptgang|zwischengang|dessert|course)/i.test(l) ||
    /^\d+[-\s]?g(ä|a)nge?[- ]?men(ü|u)/i.test(l) ||
    /^(men(ü|u)|menu|aperitif|apéritif|aperitivo|vorspeisen?|hauptg(a|ä)nge?|desserts?|getr(ä|a)nke|empfang|primo|secondo|dolci|starters?|main course|drinks|inklusive getr(ä|a)nke|nach wahl|wahlweise|dessert)$/i.test(
      l.replace(/:$/, "")
    )
  );
}

const COLLAPSED_LINES = 5;
const LONG_TEXT_CHARS = 220;

interface MenuItemsListProps {
  /** Bereits aufgeteilte Zeilen ODER Fließtext (wird intern geparst). */
  items: string[] | string;
  /** Labels für den Expand-Toggle. */
  moreLabel: string;
  lessLabel: string;
}

/**
 * Rendert Menü-Beschreibungen als strukturierte Liste:
 * Überschriften (Gänge) ohne Haken in uppercase, Gerichte mit Check-Icon.
 * Lange Listen werden auf 5 Zeilen eingeklappt ("Mehr anzeigen").
 */
const MenuItemsList = ({ items, moreLabel, lessLabel }: MenuItemsListProps) => {
  const [expanded, setExpanded] = useState(false);

  const lines = useMemo(() => {
    const arr = Array.isArray(items) ? items : [items];
    // Jede Zeile einzeln durch den Parser schicken (fängt verschachtelte Fließtexte ab)
    return arr.flatMap((entry) => splitDescription(entry)).filter(Boolean);
  }, [items]);

  const joined = lines.join(" ");
  const isLong = lines.length > COLLAPSED_LINES || joined.length > LONG_TEXT_CHARS;
  let visible = expanded || !isLong ? lines : lines.slice(0, COLLAPSED_LINES);
  // Keine "nackte" Gang-Überschrift als letzte sichtbare Zeile
  if (!expanded && isLong) {
    while (visible.length > 1 && isHeadingLine(visible[visible.length - 1])) {
      visible = visible.slice(0, -1);
    }
  }


  return (
    <div className="text-left">
      <ul className="space-y-1.5">
        {visible.map((line, i) =>
          isHeadingLine(line) ? (
            <li
              key={i}
              className="pt-1.5 first:pt-0 text-sm font-semibold uppercase tracking-wide text-foreground/90"
            >
              {line.replace(/:$/, "")}
            </li>
          ) : (
            <li key={i} className="flex items-start gap-2.5 text-base">
              <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
              <span className="text-muted-foreground leading-relaxed">{line}</span>
            </li>
          )
        )}
      </ul>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
};

export default MenuItemsList;
