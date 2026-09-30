import { useEffect, type CSSProperties } from "react";

const WIDGET_SRC = "https://storia.schrittmacher.ai/api/public/widgets/v1/maestro.js";

type LoaderWindow = Window & { __maestroWidgetLoader?: boolean };

interface MaestroWidgetProps {
  widgetId: string;
  lang: string;
  /** Sprungziel für „Gruppe anfragen“; Vorgabe wie im MAESTRO-Schnipsel. */
  anchorId?: string;
  /** Platz, den das Widget vor dem Laden freihält (gegen Layout-Sprung). */
  minHeight?: string;
}

/**
 * Bindet ein MAESTRO-Widget ein. Ausgabe wie der Schnipsel aus MAESTRO
 * (Einstellungen > Widgets > Einbinden):
 *   <script src=".../maestro.js" defer></script>
 *   <div id="gruppe-anfragen" data-maestro-widget="<id>" lang="de"></div>
 *
 * Muster wie auf /test (TestWidget.tsx): das Script wird erst im useEffect
 * eingehängt, nicht im JSX — beim Prerender würde renderToString den Tag sonst
 * ins statische HTML schreiben.
 *
 * Abweichung von /test: der Loader scannt die Platzhalter nur EINMAL beim
 * Start (Flag window.__maestroWidgetLoader). Kommt man per Router-Navigation
 * (ohne Seitenneuladen) erneut auf diese Seite, ist das Script schon da und der
 * neue Platzhalter bliebe leer. Darum: Flag zurücksetzen und das Script neu
 * einhängen. Bereits initialisierte Elemente markiert der Loader selbst.
 */
const MaestroWidget = ({ widgetId, lang, anchorId = "gruppe-anfragen", minHeight = "560px" }: MaestroWidgetProps) => {
  useEffect(() => {
    const w = window as LoaderWindow;
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SRC}"]`);
    // Script hängt schon, hat aber noch nicht gelaufen (Ladevorgang oder StrictMode): abwarten.
    if (existing && !w.__maestroWidgetLoader) return;
    if (existing) {
      w.__maestroWidgetLoader = false;
      existing.remove();
    }
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // Stil-Block aus dem freigegebenen MAESTRO-Entwurf 6 (Einbau-Schnipsel): ohne ihn nimmt der Loader die
  // Farbe des ersten Knopfs der Seite (hier weiss) - Auswahl und Absende-Knopf wurden unsichtbar.
  const stil = {
    minHeight,
    "--maestro-accent": "#931F23",
    "--maestro-knopf-text": "#fff",
    "--maestro-font": "Inter, system-ui, sans-serif",
    "--maestro-radius": "4px",
  } as CSSProperties;

  return (
    <>
      <style>{`[data-maestro-widget]::part(titel){font-family:"Playfair Display",Georgia,serif}`}</style>
      <div
        id={anchorId}
        data-maestro-widget={widgetId}
        lang={lang}
        style={stil}
        className="scroll-mt-40"
      />
    </>
  );
};

export default MaestroWidget;
