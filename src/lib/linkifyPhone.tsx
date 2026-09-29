import React from "react";

/**
 * Wandelt Festnetz-Telefonnummern in klickbare tel:-Links um.
 * Die WhatsApp-Nummer (0163 / +49 163) wird bewusst NICHT verlinkt.
 * E-Mail-Adressen im Text werden nicht verlinkt, aber Cloudflare-fest gesplittet (s. u.).
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

// E-Mail-Adressen im Fließtext (z. B. „… oder info@ristorantestoria.de.“).
// Hintergrund: Cloudflares „Email Address Obfuscation“ ersetzt jede E-Mail-Adresse in einem
// Text-Node des ausgelieferten HTML durch <a class="__cf_email__">[email protected]</a>; sein
// email-decode.min.js setzt sie VOR der Hydration als EIGENEN Text-Node wieder ein. Der Text,
// den React als einen Knoten erwartet („ oder info@….“), liegt dann in drei Knoten vor →
// Hydration-Fehler #425/#418/#422 und kompletter Client-Neuaufbau der Seite. Gleiche Lösung wie
// <EmailAddress /> in components/EmailLink.tsx: das „@“ steckt in einem eigenen <span>, der
// sichtbare Text zerfällt über eine Element-Grenze, Cloudflares Regex greift nicht.
const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

const TOKEN_PATTERN = new RegExp(`${PHONE_PATTERN.source}|(${EMAIL_PATTERN.source})`, "g");

export function linkifyPhone(text: string): React.ReactNode {
  if (!text || typeof text !== "string") return text;
  TOKEN_PATTERN.lastIndex = 0;
  if (!TOKEN_PATTERN.test(text)) return text;
  TOKEN_PATTERN.lastIndex = 0;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = TOKEN_PATTERN.exec(text)) !== null) {
    const display = match[0];
    const start = match.index;
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }
    if (match[2]) {
      // E-Mail: kein Link (wie bisher), nur CF-fest gesplittet
      const at = display.indexOf("@");
      parts.push(
        <React.Fragment key={`mail-${key++}`}>
          {display.slice(0, at)}
          <span>@</span>
          {display.slice(at + 1)}
        </React.Fragment>,
      );
    } else {
      parts.push(
        <a
          key={`tel-${key++}`}
          href={toTelHref(display)}
          className="hover:underline"
        >
          {display}
        </a>,
      );
    }
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
