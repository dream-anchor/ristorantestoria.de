import {
  forwardRef,
  useCallback,
  type AnchorHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

// E-Mail-Bestandteile getrennt halten, damit die Zeichenkette
// "mailto:info@ristorantestoria.de" NIE im ausgelieferten (prerenderten) HTML steht.
// Hintergrund: Cloudflares "Email Address Obfuscation" wandelt server-seitig jeden
// mailto-Link UND jeden sichtbaren E-Mail-Text-Node in einen
// /cdn-cgi/l/email-protection-Link (404) um. Attribute (aria-label) und JSON-LD
// lässt CF unangetastet → dort bleibt der Klartext erhalten.
const EMAIL_USER = "info";
const EMAIL_DOMAIN = "ristorantestoria.de";
export const STORIA_EMAIL = `${EMAIL_USER}@${EMAIL_DOMAIN}`;

/**
 * Sichtbare, CF-obfuskierungsfeste E-Mail-Adresse.
 * Das "@" steckt in einem eigenen <span>, sodass der sichtbare Text über eine
 * Element-Grenze zerfällt und CFs E-Mail-Regex den Text-Node NICHT matcht.
 * Für Nutzer sieht es unverändert nach "info@ristorantestoria.de" aus.
 */
export function EmailAddress() {
  return (
    <>
      {EMAIL_USER}
      <span>@</span>
      {EMAIL_DOMAIN}
    </>
  );
}

interface EmailLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Optionaler Betreff für den zur Laufzeit erzeugten mailto-Link. */
  subject?: string;
  children?: ReactNode;
}

/**
 * Klickbarer E-Mail-Link OHNE literales `mailto:` im HTML.
 * Der mailto-String wird erst beim Klick/Enter zur Laufzeit zusammengesetzt →
 * Cloudflare findet kein mailto und erzeugt keinen /cdn-cgi/l/email-protection-Link.
 * Der Klartext steht im aria-label (Attribut → von CF nicht obfuskiert) für
 * Screenreader & Crawler. Ohne eigene children wird die gesplittete Adresse gerendert.
 *
 * forwardRef + Props-Spread: funktioniert als Kind von Radix `<Button asChild>` (Slot).
 */
const EmailLink = forwardRef<HTMLAnchorElement, EmailLinkProps>(
  ({ subject, children, onClick, onKeyDown, ...rest }, ref) => {
    const openMail = useCallback(() => {
      if (typeof window === "undefined") return;
      let href = "mailto:" + EMAIL_USER + "@" + EMAIL_DOMAIN;
      if (subject) href += "?subject=" + encodeURIComponent(subject);
      window.location.href = href;
    }, [subject]);

    return (
      <a
        ref={ref}
        role="link"
        tabIndex={0}
        aria-label={`E-Mail an STORIA: ${STORIA_EMAIL}`}
        style={{ cursor: "pointer" }}
        {...rest}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          onClick?.(e);
          openMail();
        }}
        onKeyDown={(e: KeyboardEvent<HTMLAnchorElement>) => {
          onKeyDown?.(e);
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openMail();
          }
        }}
      >
        {children ?? <EmailAddress />}
      </a>
    );
  }
);
EmailLink.displayName = "EmailLink";

export default EmailLink;
