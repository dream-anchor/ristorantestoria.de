/**
 * turniere.ts — Daten der großen Fußballturniere für /public-viewing-muenchen/.
 * Faktencheck (Vier-Augen) am 2026-10-07, siehe Konzept EM 2028 / WM 2030.
 * Vor jeder Änderung die Quelle erneut prüfen und `geprueftAm` nachziehen.
 */
export interface Turnier {
  name: string;
  /** ISO-Datum, erster Spieltag (undefined = noch nicht offiziell). */
  start?: string;
  /** ISO-Datum, Finaltag (undefined = noch nicht offiziell). */
  end?: string;
  hosts: string[];
  finalVenue?: string;
  quelle: string;
  geprueftAm: string;
}

export const TURNIERE = {
  em2028: {
    name: "UEFA EURO 2028",
    start: "2028-06-09",
    end: "2028-07-09",
    hosts: ["England", "Schottland", "Wales", "Irland"],
    finalVenue: "Wembley-Stadion, London",
    quelle: "https://www.uefa.com/euro2028/",
    geprueftAm: "2026-10-07",
  },
  // Finaldatum und -ort sind noch nicht offiziell bestätigt → bewusst leer.
  wm2030: {
    name: "FIFA World Cup 2030",
    hosts: ["Spanien", "Portugal", "Marokko", "Uruguay", "Argentinien", "Paraguay"],
    quelle: "https://en.wikipedia.org/wiki/2030_FIFA_World_Cup",
    geprueftAm: "2026-10-07",
  },
} satisfies Record<string, Turnier>;
