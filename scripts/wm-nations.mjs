/**
 * Nationen-Tabelle für die WM-2026-Automatik.
 *
 * Bewusst SELBST kontrolliert (nicht aus der Sport-API): lokalisierte Namen
 * (de/en/it/fr) + Flaggen-Emoji bestimmen wir hier, damit auf der Live-Seite nie
 * ein falsch geschriebener oder unübersetzter Name landet. Die API liefert nur,
 * WELCHE Nation in einem Slot spielt – das Wie der Darstellung kommt von hier.
 *
 * Lookup: über den englischen Namen (inkl. Alias-Schreibweisen) ODER das
 * 3-Buchstaben-Kürzel (tla) von football-data.org. Taucht ein Team hier nicht auf,
 * füllt die Automatik den Slot NICHT (Fail-safe) und meldet „manuelle Aktion nötig".
 */

/** @typedef {{ de: string, en: string, it: string, fr: string, flag: string, tla: string, aliases?: string[] }} Nation */

/** @type {Nation[]} */
const NATIONS = [
  { de: "Deutschland", en: "Germany", it: "Germania", fr: "Allemagne", flag: "🇩🇪", tla: "GER" },
  { de: "Frankreich", en: "France", it: "Francia", fr: "France", flag: "🇫🇷", tla: "FRA" },
  { de: "Brasilien", en: "Brazil", it: "Brasile", fr: "Brésil", flag: "🇧🇷", tla: "BRA" },
  { de: "Argentinien", en: "Argentina", it: "Argentina", fr: "Argentine", flag: "🇦🇷", tla: "ARG" },
  { de: "Spanien", en: "Spain", it: "Spagna", fr: "Espagne", flag: "🇪🇸", tla: "ESP" },
  { de: "Portugal", en: "Portugal", it: "Portogallo", fr: "Portugal", flag: "🇵🇹", tla: "POR" },
  { de: "England", en: "England", it: "Inghilterra", fr: "Angleterre", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tla: "ENG" },
  { de: "Niederlande", en: "Netherlands", it: "Paesi Bassi", fr: "Pays-Bas", flag: "🇳🇱", tla: "NED", aliases: ["Holland"] },
  { de: "Belgien", en: "Belgium", it: "Belgio", fr: "Belgique", flag: "🇧🇪", tla: "BEL" },
  { de: "Kroatien", en: "Croatia", it: "Croazia", fr: "Croatie", flag: "🇭🇷", tla: "CRO" },
  { de: "Italien", en: "Italy", it: "Italia", fr: "Italie", flag: "🇮🇹", tla: "ITA" },
  { de: "Uruguay", en: "Uruguay", it: "Uruguay", fr: "Uruguay", flag: "🇺🇾", tla: "URU" },
  { de: "Kolumbien", en: "Colombia", it: "Colombia", fr: "Colombie", flag: "🇨🇴", tla: "COL" },
  { de: "Mexiko", en: "Mexico", it: "Messico", fr: "Mexique", flag: "🇲🇽", tla: "MEX" },
  { de: "USA", en: "USA", it: "Stati Uniti", fr: "États-Unis", flag: "🇺🇸", tla: "USA", aliases: ["United States", "United States of America"] },
  { de: "Kanada", en: "Canada", it: "Canada", fr: "Canada", flag: "🇨🇦", tla: "CAN" },
  { de: "Japan", en: "Japan", it: "Giappone", fr: "Japon", flag: "🇯🇵", tla: "JPN" },
  { de: "Südkorea", en: "South Korea", it: "Corea del Sud", fr: "Corée du Sud", flag: "🇰🇷", tla: "KOR", aliases: ["Korea Republic", "Republic of Korea"] },
  { de: "Australien", en: "Australia", it: "Australia", fr: "Australie", flag: "🇦🇺", tla: "AUS" },
  { de: "Marokko", en: "Morocco", it: "Marocco", fr: "Maroc", flag: "🇲🇦", tla: "MAR" },
  { de: "Senegal", en: "Senegal", it: "Senegal", fr: "Sénégal", flag: "🇸🇳", tla: "SEN" },
  { de: "Schweiz", en: "Switzerland", it: "Svizzera", fr: "Suisse", flag: "🇨🇭", tla: "SUI" },
  { de: "Dänemark", en: "Denmark", it: "Danimarca", fr: "Danemark", flag: "🇩🇰", tla: "DEN" },
  { de: "Polen", en: "Poland", it: "Polonia", fr: "Pologne", flag: "🇵🇱", tla: "POL" },
  { de: "Serbien", en: "Serbia", it: "Serbia", fr: "Serbie", flag: "🇷🇸", tla: "SRB" },
  { de: "Ghana", en: "Ghana", it: "Ghana", fr: "Ghana", flag: "🇬🇭", tla: "GHA" },
  { de: "Kamerun", en: "Cameroon", it: "Camerun", fr: "Cameroun", flag: "🇨🇲", tla: "CMR" },
  { de: "Ecuador", en: "Ecuador", it: "Ecuador", fr: "Équateur", flag: "🇪🇨", tla: "ECU" },
  { de: "Paraguay", en: "Paraguay", it: "Paraguay", fr: "Paraguay", flag: "🇵🇾", tla: "PAR" },
  { de: "Saudi-Arabien", en: "Saudi Arabia", it: "Arabia Saudita", fr: "Arabie saoudite", flag: "🇸🇦", tla: "KSA" },
  { de: "Iran", en: "Iran", it: "Iran", fr: "Iran", flag: "🇮🇷", tla: "IRN", aliases: ["IR Iran"] },
  { de: "Katar", en: "Qatar", it: "Qatar", fr: "Qatar", flag: "🇶🇦", tla: "QAT" },
  { de: "Tunesien", en: "Tunisia", it: "Tunisia", fr: "Tunisie", flag: "🇹🇳", tla: "TUN" },
  { de: "Nigeria", en: "Nigeria", it: "Nigeria", fr: "Nigeria", flag: "🇳🇬", tla: "NGA" },
  { de: "Algerien", en: "Algeria", it: "Algeria", fr: "Algérie", flag: "🇩🇿", tla: "ALG" },
  { de: "Ägypten", en: "Egypt", it: "Egitto", fr: "Égypte", flag: "🇪🇬", tla: "EGY" },
  { de: "Österreich", en: "Austria", it: "Austria", fr: "Autriche", flag: "🇦🇹", tla: "AUT" },
  { de: "Norwegen", en: "Norway", it: "Norvegia", fr: "Norvège", flag: "🇳🇴", tla: "NOR" },
  { de: "Schweden", en: "Sweden", it: "Svezia", fr: "Suède", flag: "🇸🇪", tla: "SWE" },
  { de: "Türkei", en: "Turkey", it: "Turchia", fr: "Turquie", flag: "🇹🇷", tla: "TUR", aliases: ["Türkiye", "Turkiye"] },
  { de: "Ukraine", en: "Ukraine", it: "Ucraina", fr: "Ukraine", flag: "🇺🇦", tla: "UKR" },
  { de: "Wales", en: "Wales", it: "Galles", fr: "Pays de Galles", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", tla: "WAL" },
  { de: "Schottland", en: "Scotland", it: "Scozia", fr: "Écosse", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", tla: "SCO" },
  { de: "Elfenbeinküste", en: "Ivory Coast", it: "Costa d'Avorio", fr: "Côte d'Ivoire", flag: "🇨🇮", tla: "CIV", aliases: ["Cote d'Ivoire"] },
  { de: "Costa Rica", en: "Costa Rica", it: "Costa Rica", fr: "Costa Rica", flag: "🇨🇷", tla: "CRC" },
  { de: "Panama", en: "Panama", it: "Panama", fr: "Panama", flag: "🇵🇦", tla: "PAN" },
  { de: "Neuseeland", en: "New Zealand", it: "Nuova Zelanda", fr: "Nouvelle-Zélande", flag: "🇳🇿", tla: "NZL" },
  { de: "Südafrika", en: "South Africa", it: "Sudafrica", fr: "Afrique du Sud", flag: "🇿🇦", tla: "RSA" },
  { de: "Jordanien", en: "Jordan", it: "Giordania", fr: "Jordanie", flag: "🇯🇴", tla: "JOR" },
  { de: "Usbekistan", en: "Uzbekistan", it: "Uzbekistan", fr: "Ouzbékistan", flag: "🇺🇿", tla: "UZB" },
  { de: "Peru", en: "Peru", it: "Perù", fr: "Pérou", flag: "🇵🇪", tla: "PER" },
  { de: "Chile", en: "Chile", it: "Cile", fr: "Chili", flag: "🇨🇱", tla: "CHI" },
  { de: "Griechenland", en: "Greece", it: "Grecia", fr: "Grèce", flag: "🇬🇷", tla: "GRE" },
  { de: "Kap Verde", en: "Cape Verde", it: "Capo Verde", fr: "Cap-Vert", flag: "🇨🇻", tla: "CPV", aliases: ["Cabo Verde"] },
  { de: "Honduras", en: "Honduras", it: "Honduras", fr: "Honduras", flag: "🇭🇳", tla: "HON" },
  { de: "Jamaika", en: "Jamaica", it: "Giamaica", fr: "Jamaïque", flag: "🇯🇲", tla: "JAM" },
  { de: "Katar", en: "Qatar", it: "Qatar", fr: "Qatar", flag: "🇶🇦", tla: "QAT" },
  { de: "Venezuela", en: "Venezuela", it: "Venezuela", fr: "Venezuela", flag: "🇻🇪", tla: "VEN" },
  { de: "Bolivien", en: "Bolivia", it: "Bolivia", fr: "Bolivie", flag: "🇧🇴", tla: "BOL" },
  { de: "Irak", en: "Iraq", it: "Iraq", fr: "Irak", flag: "🇮🇶", tla: "IRQ" },
  { de: "Vereinigte Arabische Emirate", en: "United Arab Emirates", it: "Emirati Arabi Uniti", fr: "Émirats arabes unis", flag: "🇦🇪", tla: "UAE" },
  { de: "Mali", en: "Mali", it: "Mali", fr: "Mali", flag: "🇲🇱", tla: "MLI" },
  { de: "Demokratische Republik Kongo", en: "DR Congo", it: "RD del Congo", fr: "RD Congo", flag: "🇨🇩", tla: "COD", aliases: ["Congo DR", "Democratic Republic of the Congo"] },
];

/**
 * Normalisiert einen Namen für robusten Vergleich: NFD zerlegt Diakritika
 * (é → e + Akzent), der abschließende [^a-z0-9]-Filter entfernt Akzente,
 * Leerzeichen und Sonderzeichen. „Côte d'Ivoire" und „Cote dIvoire" matchen so.
 */
const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// Lookup-Maps (Name/Alias → Nation, tla → Nation) einmalig aufbauen.
const byName = new Map();
const byTla = new Map();
for (const n of NATIONS) {
  byName.set(norm(n.en), n);
  for (const a of n.aliases ?? []) byName.set(norm(a), n);
  byTla.set(norm(n.tla), n);
}

/**
 * Liefert das WmTeam-Objekt ({ name: {de,en,it,fr}, flag }) für eine Nation
 * anhand des API-Namens und/oder tla. Gibt null zurück, wenn unbekannt.
 * @param {{ name?: string, tla?: string }} api
 * @returns {{ name: { de: string, en: string, it: string, fr: string }, flag: string } | null}
 */
export function lookupTeam(api) {
  if (!api) return null;
  const n = (api.name && byName.get(norm(api.name))) || (api.tla && byTla.get(norm(api.tla))) || null;
  if (!n) return null;
  return { name: { de: n.de, en: n.en, it: n.it, fr: n.fr }, flag: n.flag };
}

export { NATIONS };
