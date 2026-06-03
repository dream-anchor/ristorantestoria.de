/**
 * Phase 3.5: Alle Cluster-Examples (Migration 007) + Spring-Post durch das Validation-Gate.
 * Sendet Pass/Fail-Tabelle an Slack. Schreibt Failures in gbp-routine/EXAMPLES-FIXES.md.
 * Migration 007 wird NICHT ausgeführt, solange auch nur 1 Example failt.
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";
import { validate, RejectReason } from "../validators/gbp-post-validator.js";
import { slackBlocks, slackText } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

// ── Alle Examples aus Migration 007 ───────────────────────────────────────────
// cluster_id | must_include_usp | must_include_geo | examples[]
const CLUSTER_EXAMPLES: Array<{
  cluster_id: string;
  must_include_usp: boolean;
  must_include_geo: boolean;
  examples: string[];
}> = [
  {
    cluster_id: "mamma_anekdoten",
    must_include_usp: true,
    must_include_geo: true,
    examples: [
      "Handgemachte Pasta im STORIA Maxvorstadt: Mamma Speranza kocht nach Rofrano-Rezept — Original aus dem Cilento, täglich frisch. Karlstraße 47a, München.",
      "Im STORIA Maxvorstadt: Mamma hat heute frische Burrata aus Apulien mitgebracht. Zum Mittagsmenü als Antipasto — handgemachte Pasta, 3 Gänge für 14,90 €, Mo–Fr 11:30.",
      "Mamma Speranza und ihre Familie kochen seit 2015 in der Karlstraße — Cucina del Cilento, Original-Rezepte aus Rofrano. Maxvorstadt, nahe den Pinakotheken.",
    ],
  },
  {
    cluster_id: "mimmo_kueche",
    must_include_usp: true,
    must_include_geo: true,
    examples: [
      "48h Teigruhe: Mimmo testet heute einen neuen Tagliolini-Teig im STORIA München. Mehl aus dem Cilento — wenn er passt, kommt er auf die Karte. Karlstraße, nahe Königsplatz.",
      "Steinofenpizza München: Mimmo heizt den 400°C Steinofen, 48h Teigruhe im Teig. Probier die aktuelle Cilento-Variante — STORIA Karlstraße, Maxvorstadt.",
      "Handgemachte Pasta täglich frisch — Mimmos Küche im STORIA Maxvorstadt arbeitet mit Lieferanten aus dem Cilento und dem regionalen Großmarkt. Karlstraße 47a, München.",
    ],
  },
  {
    cluster_id: "cilento_hintergrund",
    must_include_usp: false,   // Cluster hat must_include_usp = FALSE
    must_include_geo: true,
    examples: [
      "Cucina del Cilento in München: Das Strozzapreti-Rezept stammt aus Rofrano, 30 km südlich von Salerno. Familie Speranza bringt es seit 2015 in die Maxvorstadt.",
      "Karlstraße, Maxvorstadt: Im Cilento isst man Pasta dünner als in Neapel und schwört auf lokales Olivenöl. Was Mamma Speranza hier kocht, kommt aus dieser Tradition.",
    ],
  },
  {
    cluster_id: "karlstrasse_anker",
    must_include_usp: true,
    must_include_geo: true,
    examples: [
      "Pinakotheken-Besucher: 5 Minuten bis zur Karlstraße — dann bist du im STORIA. Mittagsmenü 14,90 €, handgemachte Pasta, Mo–Fr 11:30–14:30 in der Maxvorstadt.",
      "TU oder LMU Mensa ausgebucht? Das STORIA Karlstraße ist 8 Minuten entfernt — 5 Gehminuten von den Pinakotheken. Mittagsmenü 14,90 €, handgemachte Pasta, Mo–Fr.",
    ],
  },
  {
    cluster_id: "personal_story",
    must_include_usp: false,
    must_include_geo: true,
    examples: [
      "STORIA Karlstraße: Nicola erklärt dir den Unterschied zwischen Gavi und Vermentino — zwei Weine, die anders schmecken, obwohl beide von der Küste kommen. Maxvorstadt.",
      "Seit 2015 läuft das STORIA durch Gutes wie durch ruhigere Phasen. Was sich nicht geändert hat: handgemachte Pasta und Familie Speranza am Herd — Cucina del Cilento in München.",
    ],
  },
  {
    cluster_id: "pasta_handarbeit",
    must_include_usp: true,
    must_include_geo: true,
    examples: [
      "Hausgemachte Pasta München: jeder Streifen per Hand gerollt, kein Automat. Im STORIA Karlstraße seit 2015 — täglich frisch ab 11:30, 5 Gehminuten von den Pinakotheken.",
      "Pasta Maxvorstadt: Familie Speranza rollt Teig nach Cilento-Tradition — dünn, handgemacht, ohne Ei-Pulver. Karlstraße 47a, täglich frisch ab 11:30.",
      "Der Tagliolini-Teig für heute wurde gestern Abend angesetzt. Handgemachte Pasta München — 48h Teigruhe, dann frisch im STORIA, Karlstraße Maxvorstadt.",
    ],
  },
  {
    cluster_id: "pinakothek_dinner",
    must_include_usp: true,
    must_include_geo: true,
    examples: [
      "Nach dem Königsplatz kommt der Hunger. Das STORIA ist 5 Gehminuten — Dinner in der Maxvorstadt mit 100 überdachte Plätze auf der Terrasse. Karlstraße.",
      "Pinakothek-Abend in München? Das STORIA Karlstraße liegt auf dem Rückweg. Aperitivo, Pasta, Wein — bis 180 Gäste, auch für spontane Gruppen. Nähe Königsplatz.",
      "Wer nach den Museen noch essen will: Karlstraße 47a, Gehminuten vom Königsplatz. Dinner, Raucher willkommen, Weinbar München — STORIA in der Maxvorstadt.",
    ],
  },
  {
    cluster_id: "rezension_highlight",
    must_include_usp: false,
    must_include_geo: true,
    examples: [
      '"Beste Pasta der Maxvorstadt" — das schreiben Gäste, die zum dritten Mal kommen. Wir lesen jede Rezension. STORIA Karlstraße, München — handgemachte Pasta seit 2015.',
      "48h Teigruhe und Original-Rezepte aus Rofrano: Gäste fragen oft nach dem Rezept der Strozzapreti. Das ist die Antwort — täglich frisch im STORIA, Karlstraße Maxvorstadt.",
      '"Die Terrasse ist auch im Regen trocken" — stimmt. 100 überdachte Plätze, Raucher willkommen, STORIA Maxvorstadt. Auch bei Münchner Gewitter draußen sitzen.',
    ],
  },
  {
    cluster_id: "steinofenpizza_muenchen",
    must_include_usp: true,
    must_include_geo: true,
    examples: [
      "Steinofenpizza München: 400°C Steinofen, 48h Teigruhe, Cilento-Salami oder Burrata-Variante. Mimmo zieht jede Pizza selbst aus dem Ofen — STORIA Karlstraße, Maxvorstadt.",
      "Neapolitanische Pizza München: der Teig hat 48h Teigruhe, dann in den 400°C Steinofen. Im STORIA Karlstraße Maxvorstadt — täglich frisch gebacken.",
      "Was Steinofenpizza in München bedeutet: 48h Teigruhe im Teig, 400°C Steinofen, Mimmos Handwerk. STORIA Karlstraße — Mittwochabend meist ruhiger für spontane Tische.",
    ],
  },
  {
    cluster_id: "terrasse_lifestyle",
    must_include_usp: true,
    must_include_geo: true,
    examples: [
      "100 überdachte Plätze in der Maxvorstadt — wetterfest, Raucher willkommen, auch bei Münchner Maigewitter. STORIA Karlstraße, Aperitivo auf der Terrasse ab 17:00.",
      "Terrasse in München, die wirklich überdacht ist: 100 überdachte Plätze, Raucher willkommen, kein Wintergarten-Feeling. STORIA Karlstraße Maxvorstadt — auch spontan.",
      "Wetterfeste Terrasse Maxvorstadt: 100 überdachte Plätze, Schiebedach, Raucher willkommen. Aperitivo ab 17:00 auf der Karlstraße — STORIA München, seit 2015.",
    ],
  },
  {
    cluster_id: "weinbar_maxvorstadt",
    must_include_usp: false,
    must_include_geo: true,
    examples: [
      "Weinbar München Maxvorstadt: Über 60 Weine — Vermentino von der Küste, Amarone aus dem Valpolicella, Rosato aus dem Cilento. STORIA Karlstraße.",
      "Maxvorstadt Weinbar-Tipp: Nicola empfiehlt zum Tagliolini einen Fiano di Avellino — weniger bekannt als Pinot Grigio, passt aber besser. STORIA Karlstraße München.",
      "Wer in München eine Weinbar sucht, die auch ehrliches Essen hat: Karlstraße 47a. STORIA — 60+ Weine, handgemachte Pasta, überdachte Terrasse.",
    ],
  },
  {
    cluster_id: "wild_kueche",
    must_include_usp: true,
    must_include_geo: true,
    examples: [
      "Wild essen München: Mimmo verarbeitet Reh und Hirsch seit 2015 — kein Supermarkt-Wild, regionale Lieferanten, handgemachte Pasta dazu. STORIA Karlstraße, Maxvorstadt.",
      "Wild essen München — Herbst im STORIA: Wildschweinragù auf handgemachte Pasta, Rehkeule aus dem Ofen. Wenn die Saison stimmt, steht es auf der Karte. Karlstraße Maxvorstadt.",
      "Wer Wild in München sucht, übersieht oft kleine Restaurants. Im STORIA kommen Reh und Hirsch von heimischen Lieferanten — Cucina del Cilento trifft Münchner Herbst.",
    ],
  },
];

// Spring-Post Option B
const SPRING_POST = {
  cluster_id: "spring_post_option_b",
  must_include_usp: true,
  must_include_geo: true,
  examples: [
    "Frühling in der Maxvorstadt: der erste Aperitivo auf der überdachten Terrasse. STORIA Karlstraße — 100 Plätze, wetterfest, Raucher willkommen. Seit 2015.",
  ],
};

interface ExampleResult {
  cluster_id: string;
  example_index: number;
  text: string;
  pass: boolean;
  reasons: string[];
}

async function main() {
  const allClusters = [...CLUSTER_EXAMPLES, SPRING_POST];
  const results: ExampleResult[] = [];

  for (const cluster of allClusters) {
    for (let i = 0; i < cluster.examples.length; i++) {
      const text = cluster.examples[i];
      const result = validate({
        body: text,
        must_include_usp: cluster.must_include_usp,
        must_include_geo: cluster.must_include_geo,
        min_chars: 140,
        max_chars: 280,
      });
      results.push({
        cluster_id: cluster.cluster_id,
        example_index: i + 1,
        text,
        pass: result.pass,
        reasons: result.reasons,
      });
    }
  }

  const passed = results.filter((r) => r.pass);
  const failed = results.filter((r) => !r.pass);

  console.log(`\n✅ Pass: ${passed.length}/${results.length} | ❌ Fail: ${failed.length}/${results.length}\n`);

  // Slack-Report
  await slackBlocks([
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `🔬 Phase 3.5: Validation-Gate — ${results.length} Examples`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Pass:* ${passed.length}/${results.length} ✅ | *Fail:* ${failed.length}/${results.length} ❌\n${failed.length > 0 ? "⛔ Migration 007 gesperrt bis alle Examples grün." : "✅ Migration 007 kann auf GO freigegeben werden."}`,
      },
    },
    { type: "divider" },
  ], true);

  // Ergebnisse blockweise nach Cluster senden
  for (const cluster of allClusters) {
    const clusterResults = results.filter((r) => r.cluster_id === cluster.cluster_id);
    const clusterPassed = clusterResults.filter((r) => r.pass).length;
    const clusterFailed = clusterResults.filter((r) => !r.pass).length;

    const lines = clusterResults.map((r) => {
      const icon = r.pass ? "✅" : "❌";
      const reasonStr = r.reasons.length > 0 ? ` → \`${r.reasons.join(", ")}\`` : "";
      const preview = r.text.substring(0, 60) + (r.text.length > 60 ? "…" : "");
      return `${icon} *${r.example_index}.* ${preview}${reasonStr}`;
    }).join("\n");

    await slackBlocks([
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${clusterFailed > 0 ? "❌" : "✅"} Cluster: \`${cluster.cluster_id}\`* (${clusterPassed}/${clusterResults.length} pass)\n\n${lines}`,
        },
      },
    ], true);
  }

  // EXAMPLES-FIXES.md schreiben
  if (failed.length > 0) {
    const lines = [
      "# EXAMPLES-FIXES.md — Validation-Gate Failures",
      "",
      `> Stand: ${new Date().toISOString().split("T")[0]} | ${failed.length} von ${results.length} Examples failen.`,
      "> Migration 007 ist gesperrt bis alle Zeilen gelöst sind.",
      "",
      "## Failures",
      "",
      "| Cluster | # | Reasons | Text (60 Zeichen) |",
      "|---|---|---|---|",
      ...failed.map((r) =>
        `| \`${r.cluster_id}\` | ${r.example_index} | \`${r.reasons.join(", ")}\` | ${r.text.substring(0, 60).replace(/\|/g, "/")}… |`
      ),
      "",
      "## Fix-Anleitung pro Reason",
      "",
      "| Reason | Fix |",
      "|---|---|",
      "| `LENGTH_BELOW_MIN` | Text verlängern auf ≥140 Zeichen |",
      "| `NO_USP_FOUND` | Eines von: 48h Teigruhe, handgemachte Pasta, seit 2015, 100 überdachte Plätze, … |",
      "| `NO_GEO_ANCHOR_FOUND` | Eines von: Maxvorstadt, Karlstraße, Königsplatz, Pinakotheken, München |",
      "| `WRONG_PERSON_FORM` | Sie/Ihr/Ihnen → du ersetzen |",
      "| `HOOK_MISSING_IN_FIRST_80` | Geo-Anker oder USP in die ersten 80 Zeichen ziehen |",
      "",
      "## Status",
      "",
      "- [ ] Alle Failures gefixt",
      "- [ ] _validate-examples.ts erneut laufen lassen → alle Pass",
      "- [ ] Antoine sagt: GO 007",
      "- [ ] `npx tsx migrations/run.ts` (007 läuft mit)",
    ];
    const fixesPath = resolve(__dirname, "EXAMPLES-FIXES.md");
    writeFileSync(fixesPath, lines.join("\n"), "utf-8");
    console.log(`\n📋 EXAMPLES-FIXES.md geschrieben: ${failed.length} Failures`);
  } else {
    const fixesPath = resolve(__dirname, "EXAMPLES-FIXES.md");
    writeFileSync(fixesPath, `# EXAMPLES-FIXES.md\n\n✅ Alle ${results.length} Examples pass das Validation-Gate. Migration 007 ist freigabebereit.\n`, "utf-8");
    console.log("\n✅ Alle Examples pass — EXAMPLES-FIXES.md aktualisiert.");
  }

  await slackText(
    failed.length > 0
      ? `❌ ${failed.length} Examples failen. EXAMPLES-FIXES.md geschrieben. Migration 007 gesperrt.`
      : `✅ Alle ${results.length} Examples valide. GO 007 kann Antoine jetzt freigeben.`
  );
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
