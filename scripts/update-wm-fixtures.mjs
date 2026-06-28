/**
 * Automatisches Nachtragen der WM-2026-K.o.-Paarungen.
 *
 * Ablauf:
 *  1. Offene Slots aus wmSlots.json / wmTeams.json bestimmen (alles ohne beide Teams).
 *  2. Spielplan von football-data.org holen (Competition „WC").
 *  3. Pro offenem Slot das passende Spiel finden (Runde + Berlin-Datum, Zeit als
 *     Sicherung) und – wenn BEIDE Teams feststehen und bekannt sind – eintragen.
 *  4. wmTeams.json schreiben (nur diese Datei; der Code in wmSpiele.ts bleibt unberührt).
 *
 * Sicherheits-/Fail-safe-Prinzipien (Live-Kundenseite!):
 *  - Schreibt ausschließlich wmTeams.json, niemals TS-Code → kein Build-Risiko.
 *  - Füllt einen Slot NUR, wenn beide Teams konkret sind UND in der Nationen-Tabelle
 *    stehen (selbst kontrollierte Namen/Flaggen). Sonst bleibt der Slot „offen".
 *  - Überschreibt bereits gesetzte Paarungen NIE (manuelle Korrekturen/TV bleiben).
 *  - Stehen beide Teams fest, lassen sich aber nicht zuordnen → „manuelle Aktion nötig".
 *  - Kein API-Key / außerhalb des Turnierfensters / API-Fehler → sauberer No-Op (exit 0),
 *    damit der tägliche Cron keine Fehlalarme produziert.
 *
 * Flags: --dry-run (nichts schreiben), --force (Turnierfenster ignorieren),
 *        --mock <datei> (statt API eine lokale football-data-JSON laden).
 *
 * Aufruf: node scripts/update-wm-fixtures.mjs   (npm run update-wm)
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { lookupTeam } from "./wm-nations.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SLOTS_PATH = resolve(ROOT, "src/pages/seo/wmSlots.json");
const TEAMS_PATH = resolve(ROOT, "src/pages/seo/wmTeams.json");

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const FORCE = argv.includes("--force");
const MOCK_FILE = (() => {
  const i = argv.indexOf("--mock");
  return i >= 0 ? argv[i + 1] : null;
})();

// Turnierfenster: nur in diesem Zeitraum aktiv werden (verhindert ewige Cron-Läufe).
const WINDOW_START = "2026-06-30"; // erster Tag, an dem K.o.-Paarungen ab AF entstehen
const WINDOW_END = "2026-07-20"; // Tag nach dem Finale

/** football-data.org Stage-Namen je Runde (Array = akzeptierte Schreibweisen). */
const STAGE_MAP = {
  achtelfinale: ["LAST_16"],
  viertelfinale: ["QUARTER_FINALS", "QUARTER_FINAL"],
  halbfinale: ["SEMI_FINALS", "SEMI_FINAL"],
  "spiel-um-platz-3": ["THIRD_PLACE", "3RD_PLACE_FINAL", "THIRD_PLACE_PLAYOFF", "THIRD_PLACE_FINAL"],
  finale: ["FINAL"],
};

const TZ = "Europe/Berlin";
/** „YYYY-MM-DD" eines ISO-Zeitstempels in Europe/Berlin. */
const berlinDate = (iso) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(iso),
  );

const log = (...a) => console.log("[wm-fixtures]", ...a);

/** Output für die GitHub Action (manuelle-Aktion-Hinweis). */
function ghOutput(key, value) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${key}<<__EOF__\n${value}\n__EOF__\n`);
  }
}

/** Ist ein API-Teamname „konkret" (keine TBD-/Platzhalter-Angabe)? */
function isConcrete(name) {
  if (!name || typeof name !== "string") return false;
  return !/winner|loser|runner|sieger|verlierer|gewinner|group|gruppe|tbd|to be|\bvs\b|\/|placeholder/i.test(name);
}

async function fetchMatches() {
  if (MOCK_FILE) {
    const p = resolve(process.cwd(), MOCK_FILE);
    log(`Mock-Daten aus ${p}`);
    return JSON.parse(readFileSync(p, "utf8")).matches ?? [];
  }
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) {
    log("Kein FOOTBALL_DATA_API_KEY gesetzt – übersprungen (No-Op).");
    return null; // null = sauber abbrechen, kein Fehler
  }
  try {
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: { "X-Auth-Token": key },
    });
    if (!res.ok) {
      log(`API antwortete mit ${res.status} ${res.statusText} – übersprungen.`);
      return null;
    }
    const data = await res.json();
    return data.matches ?? [];
  } catch (err) {
    log(`API-Aufruf fehlgeschlagen (${err?.message ?? err}) – übersprungen.`);
    return null;
  }
}

/** Wählt aus Kandidaten das Spiel mit der geringsten Zeitabweichung zum Slot. */
function bestMatch(candidates, slotMs) {
  let best = null;
  let bestDelta = Infinity;
  for (const m of candidates) {
    const delta = Math.abs(new Date(m.utcDate).getTime() - slotMs);
    if (delta < bestDelta) {
      best = m;
      bestDelta = delta;
    }
  }
  return { best, deltaMin: bestDelta / 60000 };
}

async function main() {
  // Turnierfenster prüfen (Berlin-Datum „heute").
  const today = berlinDate(new Date().toISOString());
  if (!FORCE && (today < WINDOW_START || today >= WINDOW_END)) {
    log(`Heute (${today}) außerhalb des Turnierfensters ${WINDOW_START}…${WINDOW_END} – No-Op.`);
    return;
  }

  const slotsDoc = JSON.parse(readFileSync(SLOTS_PATH, "utf8"));
  const teamsDoc = JSON.parse(readFileSync(TEAMS_PATH, "utf8"));
  const slots = slotsDoc.slots ?? [];
  const teams = teamsDoc.teams ?? {};

  // Offene Slots: keine beiden Teams gesetzt UND es gibt ein Stage-Mapping (also ab AF).
  const openSlots = slots.filter((s) => {
    const t = teams[s.id];
    const hasTeams = t && t.teamA && t.teamB;
    return !hasTeams && STAGE_MAP[s.runde];
  });

  if (openSlots.length === 0) {
    log("Keine offenen Slots – nichts zu tun.");
    return;
  }
  log(`${openSlots.length} offene Slot(s): ${openSlots.map((s) => s.id).join(", ")}`);

  const matches = await fetchMatches();
  if (matches === null) return; // No-Op (kein Key / API-Fehler)

  const filled = [];
  const manualActions = [];

  for (const slot of openSlots) {
    const stages = STAGE_MAP[slot.runde];
    const slotMs = new Date(slot.startISO).getTime();
    const slotDay = berlinDate(slot.startISO);

    // Primär: gleiche Runde + gleiches Berlin-Datum.
    let candidates = matches.filter((m) => stages.includes(m.stage) && berlinDate(m.utcDate) === slotDay);
    // Fallback: exakt gleiche Anstoßzeit (falls Stage-Namen abweichen).
    if (candidates.length === 0) {
      candidates = matches.filter((m) => new Date(m.utcDate).getTime() === slotMs);
    }
    if (candidates.length === 0) continue; // Spiel (noch) nicht im Plan – still überspringen

    const { best, deltaMin } = bestMatch(candidates, slotMs);
    // Sicherung: Anstoß darf max. 180 Min vom geplanten Slot abweichen.
    if (!best || deltaMin > 180) continue;

    const homeName = best.homeTeam?.name;
    const awayName = best.awayTeam?.name;
    if (!isConcrete(homeName) || !isConcrete(awayName)) continue; // Gegner noch nicht fest

    const teamA = lookupTeam({ name: homeName, tla: best.homeTeam?.tla });
    const teamB = lookupTeam({ name: awayName, tla: best.awayTeam?.tla });

    if (!teamA || !teamB) {
      const fehlend = [!teamA ? homeName : null, !teamB ? awayName : null].filter(Boolean).join(" / ");
      manualActions.push(`${slot.runde} ${slot.ort} (${slotDay}): „${homeName} – ${awayName}" – unbekannt: ${fehlend}`);
      log(`⚠️  ${slot.id}: Teams stehen fest, aber nicht zuordenbar: ${fehlend}`);
      continue;
    }

    // Bestehenden Eintrag (z. B. mit manuell gesetztem TV) bewahren, Teams ergänzen.
    teams[slot.id] = { ...(teams[slot.id] || {}), teamA, teamB };
    filled.push(`${slot.id}: ${teamA.name.de} – ${teamB.name.de}`);
    log(`✅ ${slot.id}: ${teamA.name.de} – ${teamB.name.de}  (Δ ${Math.round(deltaMin)} Min)`);
  }

  if (manualActions.length > 0) {
    ghOutput("manual", manualActions.join("\n"));
  }

  if (filled.length === 0) {
    log("Keine neuen Paarungen eintragbar.");
    return;
  }

  if (DRY_RUN) {
    log(`DRY-RUN – würde ${filled.length} Paarung(en) schreiben:\n  ${filled.join("\n  ")}`);
    return;
  }

  // wmTeams.json deterministisch neu schreiben (Slot-Reihenfolge, _comment behalten).
  teamsDoc.teams = teams;
  writeFileSync(TEAMS_PATH, JSON.stringify(teamsDoc, null, 2) + "\n", "utf8");
  log(`${filled.length} Paarung(en) in wmTeams.json geschrieben.`);
}

if (!existsSync(SLOTS_PATH)) {
  console.error("[wm-fixtures] wmSlots.json nicht gefunden:", SLOTS_PATH);
  process.exit(1);
}

main().catch((err) => {
  console.error("[wm-fixtures] Unerwarteter Fehler:", err);
  process.exit(1); // echter Crash → failure()-Telegram der Action
});
