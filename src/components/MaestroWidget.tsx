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
    if (!document.querySelector(`script[src="${MAESTRO_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = MAESTRO_SRC;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Sicherheitsnetz: Rendert das externe Widget nicht, zeigen wir Direktkontakte,
    // damit nie ein leerer Anfragebereich stehen bleibt.
    const timer = window.setTimeout(() => {
      const host = hostRef.current;
      if (!host) return;
      const rendered = !!host.shadowRoot || host.childElementCount > 0;
      if (!rendered) setFailed(true);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={className}>
      <div ref={hostRef} data-maestro-widget={widgetId} />
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
