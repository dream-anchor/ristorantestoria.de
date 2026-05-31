import React from "react";

/**
 * Wandelt Festnetz-Telefonnummern in klickbare tel:-Links um.
 * Die WhatsApp-Nummer (0163 / +49 163) wird bewusst NICHT verlinkt.
 *
 * Erkannte Formate:
 *  - +49 89 51519696 / +498951519696 / 089 51519696
 *  - +49 89 28806855 / 089 28806855 (Barrierefreiheit)
 */

// Reihenfolge: spezifischste/längste Muster zuerst.
const PHONE_PATTERN =
  /(\+49\s?89\s?51519696|\+498951519696|089\s?51519696|\+49\s?89\s?28806855|\+498928806855|089\s?28806855)/g;

function toTelHref(display: string): string {
  const digits = display.replace(/[^\d]/g, ""); // z.B. 08951519696 oder 498951519696
  let normalized = digits;
  if (normalized.startsWith("0")) {
    normalized = "49" + normalized.slice(1);
  }
  return `tel:+${normalized}`;
}

export function linkifyPhone(text: string): React.ReactNode {
  if (!text || typeof text !== "string") return text;
  if (!PHONE_PATTERN.test(text)) return text;
  PHONE_PATTERN.lastIndex = 0;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = PHONE_PATTERN.exec(text)) !== null) {
    const display = match[0];
    const start = match.index;
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }
    parts.push(
      <a
        key={`tel-${key++}`}
        href={toTelHref(display)}
        className="hover:underline"
      >
        {display}
      </a>,
    );
    lastIndex = start + display.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

/** Rendert einen String und macht enthaltene Festnetznummern klickbar. */
export function PhoneText({ children }: { children: string }): React.ReactElement {
  return <>{linkifyPhone(children)}</>;
}