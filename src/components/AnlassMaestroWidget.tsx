import { useEffect } from "react";
import MaestroWidget from "@/components/MaestroWidget";
import { fireLead } from "@/lib/analytics";

export type MaestroAnlass = "silvester" | "weihnachtsfeier";

/**
 * MAESTRO-Anlass-Widget je Anlass und Sprache (Punkt 133, ersetzt seit 01.10.2026 das eigene
 * `AnlassAnfrageForm`). Die IDs sind die acht Widgets aus MAESTRO (Einstellungen > Widgets).
 */
const WIDGET_IDS: Record<MaestroAnlass, Record<string, string>> = {
  silvester: {
    de: "dc28f73d-2daf-4842-b6d7-fb90da96e3af",
    en: "1214df5a-1595-46de-8e40-5aee9c3f7a7d",
    it: "4aeef0bb-7f26-47ed-95d5-2b8be7387538",
    fr: "378b8d19-874b-4148-aac5-c5c35a62d2f6",
  },
  weihnachtsfeier: {
    de: "ae22c8da-aca6-447c-aea6-1826b37a8039",
    en: "628491f8-3940-43ce-aa56-742488d39fcc",
    it: "1d6d5c41-f5da-41c0-862b-d1d2a685bdbe",
    fr: "f02223a5-06e2-473c-a3e3-bcb1b8554fb1",
  },
};

/** Eingangs-Kennung für die MAESTRO-Aufrufzählung — dieselbe wie zuvor im eigenen Formular. */
const EINGANG: Record<MaestroAnlass, string> = {
  silvester: "ristorante_silvester",
  weihnachtsfeier: "ristorante_weihnachtsfeier",
};

interface AnlassMaestroWidgetProps {
  anlass: MaestroAnlass;
  lang: string;
}

const AnlassMaestroWidget = ({ anlass, lang }: AnlassMaestroWidgetProps) => {
  // Aufruf-Zählung MAESTRO: einmal pro Seitenaufruf, feuert nie blockierend.
  useEffect(() => {
    try {
      navigator.sendBeacon(
        "https://storia.schrittmacher.ai/api/public/formular-aufruf",
        new Blob([JSON.stringify({ eingang: EINGANG[anlass] })], { type: "text/plain" }),
      );
    } catch {
      /* Zählung darf das Formular nie blockieren */
    }
  }, [anlass]);

  // GA4-Conversion wie beim alten Formular: das Widget meldet das erfolgreiche Absenden auf `window`.
  useEffect(() => {
    const beiAbsenden = () => fireLead(`${anlass}_anfrage`, 1500);
    window.addEventListener("MAESTRO_INQUIRY_SUBMITTED", beiAbsenden);
    return () => window.removeEventListener("MAESTRO_INQUIRY_SUBMITTED", beiAbsenden);
  }, [anlass]);

  const ids = WIDGET_IDS[anlass];
  return <MaestroWidget widgetId={ids[lang] ?? ids.de} lang={lang} anchorId={`${anlass}-widget`} />;
};

export default AnlassMaestroWidget;
