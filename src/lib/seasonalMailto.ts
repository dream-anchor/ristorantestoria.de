/** Ersetzt {{EVENT}} im Betreff oder Text einer Mailto-Vorlage. `eventLabel` kommt vom
 *  Aufrufer (z.B. das dort bereits vorhandene EVENT_LABELS-Mapping) statt hier ein
 *  drittes, separat zu pflegendes Label-Mapping anzulegen. */
export const fillSeasonalMailtoTemplate = (template: string, eventLabel: string): string =>
  template.split("{{EVENT}}").join(eventLabel);

/**
 * mailto:-Link — öffnet das Compose-Fenster im Standard-Mailprogramm, vorausgefüllt
 * und sendebereit, aber vom Menschen vor dem tatsächlichen Versand editierbar/prüfbar.
 * Anders als der automatische KI-Versand (notify-seasonal-signups) verschickt dieser
 * Weg selbst nichts — er öffnet nur das Compose-Fenster.
 */
export const buildSeasonalMailtoUrl = (to: string, subject: string, body: string): string =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
