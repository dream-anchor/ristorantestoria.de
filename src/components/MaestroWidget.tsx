import { useEffect, useRef, useState } from "react";
import EmailLink, { EmailAddress } from "@/components/EmailLink";

const MAESTRO_SCRIPT_SRC = "https://storia.schrittmacher.ai/api/public/widgets/v1/maestro.js";
const MAESTRO_API_BASE = "https://storia.schrittmacher.ai";

/** Rote STORIA-Hausfarbe — als Design-Parameter an autark eingebettete Widgets zu übergeben. */
export const MAESTRO_PRIMARY_COLOR = "#8a2019";

/**
 * Die vom MAESTRO-Skript im Shadow DOM konsumierte Custom Property für die
 * Akzent-/Button-Farbe (siehe [part="knopf"]{background:var(--maestro-accent,...)}
 * in der vom Skript injizierten Stylesheet). Kein shadcn/Tailwind-Token —
 * das Widget hat sein eigenes, unabhängiges CSS-Variablen-Schema.
 */
const MAESTRO_ACCENT_VAR = "--maestro-accent";

const HEX_COLOR_RE = /^#[0-9a-f]{3,8}$/i;

/** Zeit, nach der ein sichtbarer, aber leerer Container als "nicht gerendert" gilt. */
const RENDER_TIMEOUT_MS = 8000;

let scriptFailed = false;
let scanCounter = 0;

/**
 * Der MAESTRO-Loader scannt das DOM nur einmal beim Laden. Container, die
 * später erscheinen (z. B. in einem Dialog), werden deshalb nie gerendert.
 * Wir stoßen daher pro Mount einen neuen Scan an, indem wir den Loader-Guard
 * zurücksetzen und das Skript erneut einhängen (aus dem Cache, kein Traffic).
 */
const requestMaestroScan = (onError: () => void) => {
  if (typeof document === "undefined") return;
  if (scriptFailed) {
    onError();
    return;
  }

  try {
    delete (window as unknown as Record<string, unknown>).__maestroWidgetLoader;
  } catch {
    /* ignore */
  }

  const script = document.createElement("script");
  script.src = `${MAESTRO_SCRIPT_SRC}?s=${++scanCounter}`;
  script.async = false;
  script.addEventListener("error", () => {
    scriptFailed = true;
    onError();
  });
  document.body.appendChild(script);
};

interface MaestroWidgetProps {
  /** Widget-ID aus dem MAESTRO-Backend */
  widgetId: string;
  className?: string;
  /**
   * Primärfarbe als Hex (z.B. "#8a2019"), als data-color-primary in den
   * Einbau-Container geschrieben und als --maestro-accent in den Shadow DOM
   * injiziert. Macht das Widget unabhängig von Host-CSS-Variablen —
   * nötig für Einbettung auf fremden Baukasten-Seiten (Wix, WordPress, Jimdo).
   */
  primaryColor?: string;
}

/**
 * Bindet ein MAESTRO-Formular-Widget ein.
 * Das Skript injiziert das Formular via Shadow DOM (kein Iframe) und übernimmt
 * automatisch Schriftart und Primärfarbe der Seite.
 *
 * Wichtige Implementierungs-Details:
 * - Der Container bekommt eine Mindesthöhe, damit der IntersectionObserver des
 *   MAESTRO-Skripts (rootMargin 200px) greift. Ein 0px hoher, leerer Container
 *   hat keine Schnittmenge mit dem Viewport → das Skript würde nie rendern.
 * - Der Fallback-Timer startet erst, wenn der Container tatsächlich sichtbar
 *   geworden ist. Below-the-fold Formulare dürfen nicht vorzeitig auf den
 *   Direktkontakt-Fallback zurückfallen, nur weil der Nutzer noch nicht
 *   gescrollt hat.
 */
const MaestroWidget = ({ widgetId, className, primaryColor }: MaestroWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let done = false;
    const fail = () => {
      if (done) return;
      done = true;
      setFailed(true);
    };

    // Nächster Frame: Container ist dann sicher im DOM.
    const raf = requestAnimationFrame(() => requestMaestroScan(fail));

    let visibleTimer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.disconnect();
            if (visibleTimer != null) break;
            visibleTimer = setTimeout(() => {
              const el = containerRef.current;
              const rendered = !!el && (el.shadowRoot != null || el.childElementCount > 0);
              if (!rendered) fail();
            }, RENDER_TIMEOUT_MS);
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    if (containerRef.current) io.observe(containerRef.current);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
      if (visibleTimer) clearTimeout(visibleTimer);
      io.disconnect();
    };
  }, [widgetId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const color = container.dataset.colorPrimary;
    if (!color || !HEX_COLOR_RE.test(color.trim())) return undefined;

    // WICHTIG: Das MAESTRO-Skript versucht selbst, sich per Auto-Theming an
    // die Host-Seite anzupassen, und schreibt dabei --maestro-accent als
    // Inline-Style auf denselben Container (beobachtet: es liest --background
    // statt --primary aus und landet so bei einer fast-weißen Akzentfarbe →
    // der gemeldete weiß-auf-weiß-Button). Ein einmaliges Setzen wird also
    // vom Skript wieder überschrieben. Wir beobachten daher das style-
    // Attribut des Containers und setzen unseren Wert zurück, sobald er
    // abweicht — ohne Endlosschleife, da ein bereits korrekter Wert kein
    // erneutes Schreiben (und damit keine erneute Mutation) auslöst.
    const applyToHost = () => {
      if (container.style.getPropertyValue(MAESTRO_ACCENT_VAR).trim() !== color) {
        container.style.setProperty(MAESTRO_ACCENT_VAR, color);
      }
    };
    applyToHost();
    const hostObserver = new MutationObserver(applyToHost);
    hostObserver.observe(container, { attributes: true, attributeFilter: ["style"] });

    // Defensiv zusätzlich direkt auf das innerste Root-Element im Shadow DOM
    // schreiben (der eigentliche Formular-Container hinter dem <style>-Tag),
    // falls eine künftige Skript-Version --maestro-accent dort statt am Host
    // setzt und die Vererbung damit blockiert.
    const applyToShadowRoot = () => {
      const innerRoot = container.shadowRoot?.querySelector('[part="container"]');
      if (innerRoot instanceof HTMLElement) {
        innerRoot.style.setProperty(MAESTRO_ACCENT_VAR, color);
      }
    };

    let shadowObserver: MutationObserver | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;
    const attachShadowObserver = () => {
      const root = container.shadowRoot;
      if (!root || shadowObserver) return;
      applyToShadowRoot();
      shadowObserver = new MutationObserver(applyToShadowRoot);
      shadowObserver.observe(root, { childList: true });
      if (pollId != null) {
        clearInterval(pollId);
        pollId = null;
      }
    };

    attachShadowObserver();
    if (!shadowObserver) {
      pollId = setInterval(attachShadowObserver, 150);
    }

    return () => {
      hostObserver.disconnect();
      if (pollId != null) clearInterval(pollId);
      shadowObserver?.disconnect();
    };
  }, [primaryColor, widgetId]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        data-maestro-widget={widgetId}
        data-maestro-api={MAESTRO_API_BASE}
        data-color-primary={primaryColor}
        className="w-full min-h-[420px]"
      />
      {failed && (
        <div className="mt-4 rounded-lg border border-current/20 bg-background/10 p-5 text-left">
          <p className="mb-3 text-sm">
            Das Anfrageformular kann gerade nicht geladen werden. Bitte kontaktieren Sie uns direkt —
            wir melden uns schnellstmöglich.
          </p>
          <ul className="space-y-1.5 text-sm font-medium">
            <li>
              <a href="tel:+498951519696" className="underline underline-offset-4">
                +49 89 51519696
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/491636033912"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                WhatsApp: +49 163 6033912
              </a>
            </li>
            <li>
              <EmailLink className="underline underline-offset-4">
                <EmailAddress />
              </EmailLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MaestroWidget;
