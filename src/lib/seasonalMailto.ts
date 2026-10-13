/** Ersetzt {{EVENT}} im Betreff oder Text einer Mailto-Vorlage. `eventLabel` kommt vom
 *  Aufrufer (z.B. das dort bereits vorhandene EVENT_LABELS-Mapping) statt hier ein
 *  drittes, separat zu pflegendes Label-Mapping anzulegen. */
export const fillSeasonalMailtoTemplate = (template: string, eventLabel: string): string =>
  template.split("{{EVENT}}").join(eventLabel);

/**
 * mailto:-Link — öffnet das Compose-Fenster im Standard-Mailprogramm mit vorausgefülltem
 * Empfänger und Betreff. Bewusst OHNE body-Parameter: bei registrierten Webmail-Handlern
 * (z.B. IONOS/OX App Suite als mailto:-Handler in Chrome, Fund 13.10.2026) wird ein langer,
 * zeilenumbruchhaltiger body-Wert beim Umschreiben des Links doppelkodiert und reißt dabei
 * auch den Betreff mit raus — ein kurzer Link mit nur to+subject kommt zuverlässig an.
 * Den Mailtext liefert separat buildSeasonalClipboardText() zum manuellen Einfügen.
 * Anders als der automatische KI-Versand (notify-seasonal-signups) verschickt dieser
 * Weg selbst nichts — er öffnet nur das Compose-Fenster.
 */
export const buildSeasonalMailtoUrl = (to: string, subject: string): string =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}`;
