import { useEffect, useRef, useState } from "react";
import EmailLink, { EmailAddress } from "@/components/EmailLink";

const MAESTRO_SRC = "https://storia.schrittmacher.ai/api/public/widgets/v1/maestro.js";

interface MaestroWidgetProps {
  /** Widget-ID aus dem MAESTRO-Backend */
  widgetId: string;
  className?: string;
}

/**
 * Bindet ein MAESTRO-Formular-Widget ein.
 * Das Skript injiziert das Formular via Shadow DOM (kein Iframe) und übernimmt
 * automatisch Schriftart und Primärfarbe der Seite. Es wird nur einmal pro
 * Dokument geladen, auch wenn mehrere Widgets gerendert werden.
 */
const MaestroWidget = ({ widgetId, className }: MaestroWidgetProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Der Loader läuft nur einmal pro Dokument und überspringt bereits
    // initialisierte Container. Bei SPA-Navigation muss er daher erneut
    // angestoßen werden, damit neu gemountete Container erkannt werden.
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${MAESTRO_SRC}"]`);
    existing?.remove();
    delete (window as unknown as Record<string, unknown>).__maestroWidgetLoader;

    const script = document.createElement("script");
    script.src = MAESTRO_SRC;
    script.defer = true;
    script.addEventListener("error", () => setFailed(true));
    document.body.appendChild(script);

    // Sicherheitsnetz: Das Widget lädt erst, wenn es in den Viewport kommt.
    // Bleibt es danach leer, zeigen wir Direktkontakte, damit nie ein leerer
    // Anfragebereich stehen bleibt.
    let timer = 0;
    const startWatch = () => {
      timer = window.setTimeout(() => {
        const rendered = !!host.shadowRoot || host.childElementCount > 0;
        if (!rendered) setFailed(true);
      }, 8000);
    };

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === "function") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            startWatch();
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(host);
    } else {
      startWatch();
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(timer);
    };
  }, [widgetId]);

  return (
    <div className={className}>
      {/* Mindesthöhe, damit der Lazy-Load-Beobachter des Widgets zuverlässig auslöst */}
      <div ref={hostRef} data-maestro-widget={widgetId} className="min-h-[2px]" />
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
