import { useEffect } from "react";

const MAESTRO_SRC = "https://api.maestro.cloud/api/public/widgets/v1/maestro.js";

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
  useEffect(() => {
    if (document.querySelector(`script[src="${MAESTRO_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = MAESTRO_SRC;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div data-maestro-widget={widgetId} className={className} />;
};

export default MaestroWidget;
