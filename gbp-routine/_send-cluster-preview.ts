/**
 * Sendet Cluster-Examples-Preview an Slack zur Freigabe.
 * Zeigt: alter Text (legacy) vs. neuer Text (aus Migration 007).
 * Auch: Option-B Spring-Post zur Freigabe.
 *
 * Nach Freigabe: npx tsx migrations/run.ts -- aber nur 007
 * → npx tsx -e "import('./migrations/run.ts')" // oder manuelle Ausführung
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { slackBlocks, slackText } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

// Neue Cluster-Examples (identisch zu Migration 007)
const NEW_EXAMPLES: Record<string, { new: string[]; chars: number[] }> = {
  mamma_anekdoten: {
    new: [
      "Mamma Speranza kocht heute Strozzapreti nach einem Rofrano-Rezept — handgemachte Pasta, wie im Cilento seit Jahrzehnten üblich. STORIA Maxvorstadt, Karlstraße 47a.",
      "Heute hat Mamma frische Burrata aus Apulien mitgebracht. Zum Mittagsmenü gibt es sie als Antipasto — 14,90 € für 3 Gänge, Mo–Fr 11:30 in der Karlstraße.",
      "Mamma Speranza und ihre Familie kochen seit 2015 in der Karlstraße — Cucina del Cilento, Original-Rezepte aus Rofrano, täglich in der Maxvorstadt.",
    ],
    chars: [0, 0, 0],
  },
  mimmo_kueche: {
    new: [
      "Mimmo testet heute einen neuen Tagliolini-Teig: 48h Ruhezeit, Mehl aus dem Cilento. Frische Trüffel-Pasta München — wenn er passt, kommt er auf die Karte.",
      "Steinofenpizza München: Mimmo heizt auf 400°C, der Teig hat 72h Teigruhe. Probier die aktuelle Cilento-Variante — STORIA Karlstraße, Maxvorstadt.",
      "Mimmos Küche arbeitet mit Lieferanten aus dem Cilento und dem Münchner Großmarkt. Handgemachte Pasta, täglich frisch — in der Maxvorstadt, Karlstraße 47a.",
    ],
    chars: [0, 0, 0],
  },
  cilento_hintergrund: {
    new: [
      "Das Strozzapreti-Rezept stammt aus Rofrano, einem Dorf 30 km südlich von Salerno. Familie Speranza bringt es seit 2015 in die Maxvorstadt — Cucina del Cilento in München.",
      "Im Cilento isst man Pasta dünner als in Neapel und schwört auf lokales Olivenöl. Was Mamma Speranza in der Karlstraße kocht, kommt direkt aus dieser Tradition.",
    ],
    chars: [0, 0],
  },
  karlstrasse_anker: {
    new: [
      "Pinakotheken-Besucher: 5 Minuten Fußweg bis zur Karlstraße — dann bist du im STORIA. Mittagsmenü 14,90 €, Mo–Fr 11:30–14:30 in der Maxvorstadt.",
      "TU oder LMU Mensa ausgebucht? Das STORIA Karlstraße ist 8 Minuten entfernt. Mittagsmenü 14,90 € — handgemachte Pasta, täglich wechselnd, Mo–Fr in der Maxvorstadt.",
    ],
    chars: [0, 0],
  },
  pasta_handarbeit: {
    new: [
      "Hausgemachte Pasta München: jeder Streifen per Hand gerollt, kein Automat. Im STORIA Karlstraße seit 2015 — täglich frisch, serviert ab 11:30 in der Maxvorstadt.",
      "Pasta Maxvorstadt: Familie Speranza rollt Teig nach Cilento-Tradition — dünn, handgemacht, ohne Ei-Pulver. Karlstraße 47a, täglich frisch ab 11:30.",
      "Der Tagliolini-Teig für heute wurde gestern Abend angesetzt. Handgemachte Pasta München — 48h Teigruhe, dann frisch im STORIA, Karlstraße Maxvorstadt.",
    ],
    chars: [0, 0, 0],
  },
  pinakothek_dinner: {
    new: [
      "Nach dem Königsplatz kommt der Hunger. Das STORIA ist 5 Gehminuten — Dinner in der Maxvorstadt, Weinbar-Atmosphäre, bis zu 100 Plätze auf der überdachten Terrasse.",
      "Pinakothek-Abend in München? Das STORIA Karlstraße liegt auf dem Rückweg. Aperitivo, Pasta, Wein — wir haben bis 180 Plätze, auch für spontane Gruppen.",
      "Wer nach den Museen noch essen will: Karlstraße 47a, Gehminuten vom Königsplatz. Dinner, Raucher willkommen, Weinbar München Maxvorstadt.",
    ],
    chars: [0, 0, 0],
  },
  steinofenpizza_muenchen: {
    new: [
      "Steinofenpizza München: 400°C, 48–72h Teigruhe, Cilento-Salami oder weiße Burrata-Variante. Mimmo zieht jede Pizza selbst aus dem Ofen — STORIA Karlstraße, Maxvorstadt.",
      "Neapolitanische Pizza München: der Teig hat 72 Stunden Ruhezeit bevor er in den 400°C-Steinofen kommt. Im STORIA Karlstraße Maxvorstadt — täglich frisch.",
      "Was Steinofenpizza in München bedeutet: 48h Teig, lokale Zutaten, Mimmos Handwerk. STORIA Karlstraße — Mittwochabend meist ruhiger für spontane Tische.",
    ],
    chars: [0, 0, 0],
  },
  terrasse_lifestyle: {
    new: [
      "100 überdachte Plätze in der Maxvorstadt — wetterfest, Raucher willkommen, auch bei Münchner Maigewitter. STORIA Karlstraße, Aperitivo auf der Terrasse ab 17:00.",
      "Terrasse in München, die wirklich überdacht ist: 100 Plätze, Raucher willkommen, kein Wintergarten-Feeling. STORIA Karlstraße Maxvorstadt — auch spontan.",
      "Wetterfeste Terrasse Maxvorstadt: 100 Plätze, Schiebedach, Raucher willkommen. Aperitivo ab 17:00 auf der Karlstraße — STORIA München, seit 2015.",
    ],
    chars: [0, 0, 0],
  },
  weinbar_maxvorstadt: {
    new: [
      "Über 60 Weine: Vermentino von der sardischen Küste, Amarone aus dem Valpolicella, Rosato aus dem Cilento. Weinbar München Maxvorstadt — STORIA Karlstraße.",
      "Nicola empfiehlt zum Tagliolini gerne einen Fiano di Avellino — weniger bekannt, passt aber besser. Weinbar Maxvorstadt, STORIA Karlstraße München.",
      "Wer in München eine Weinbar sucht, die auch ehrliches Essen hat: Karlstraße 47a. STORIA — 60+ Weine, handgemachte Pasta, überdachte Terrasse.",
    ],
    chars: [0, 0, 0],
  },
  wild_kueche: {
    new: [
      "Wild essen München: Mimmo verarbeitet Reh und Hirsch wenn die Saison es erlaubt — kein Supermarkt-Wild, regionale Lieferanten. STORIA Karlstraße, Maxvorstadt.",
      "Herbst im STORIA: Wildschweinragù auf handgemachter Pasta, Rehkeule aus dem Ofen. Wild essen München — wenn die Saison stimmt, steht es auf der Karte. Karlstraße Maxvorstadt.",
      "Wer Wild in München sucht, übersieht oft kleine Restaurants. Im STORIA kommen Reh und Hirsch von heimischen Lieferanten — Cucina del Cilento trifft Münchner Herbst.",
    ],
    chars: [0, 0, 0],
  },
  rezension_highlight: {
    new: [
      '"Beste Pasta der Maxvorstadt" — das schreiben Gäste, die zum dritten Mal kommen. STORIA Karlstraße, handgemachte Pasta seit 2015.',
      "Gäste fragen manchmal nach dem Rezept für die Strozzapreti. Die Antwort: 48h Teigruhe, Original aus Rofrano — täglich im STORIA, Karlstraße Maxvorstadt.",
      '"Die Terrasse ist auch im Regen trocken" — stimmt. 100 überdachte Plätze, Raucher willkommen, STORIA Maxvorstadt. Auch bei Münchner Gewitter draußen sitzen.',
    ],
    chars: [0, 0, 0],
  },
  personal_story: {
    new: [
      "Nicola erklärt dir heute Abend den Unterschied zwischen Gavi und Vermentino — zwei Weine, die anders schmecken, obwohl beide von der Küste kommen. STORIA Karlstraße, Maxvorstadt.",
      "Seit 2015 läuft das STORIA durch Gutes wie durch ruhigere Phasen. Was sich nicht geändert hat: handgemachte Pasta und Familie Speranza am Herd — Cucina del Cilento in München.",
    ],
    chars: [0, 0],
  },
};

// Zeichenzählen
for (const data of Object.values(NEW_EXAMPLES)) {
  data.chars = data.new.map((t) => t.length);
}

// Spring-Post Option B
const SPRING_POST = {
  body: "Frühling in der Maxvorstadt: der erste Aperitivo auf der überdachten Terrasse. STORIA Karlstraße — 100 Plätze, wetterfest, Raucher willkommen. Seit 2015.",
  cta_type: "reserve",
  pool: "B",
  season: "spring",
  image_tags: ["terrasse", "aperitivo", "dinner"],
};

async function main() {
  console.log("📤 Sende Cluster-Examples-Preview + Spring-Post an Slack...\n");

  // Header
  await slackBlocks([
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "✍️ Pool-C-Cluster: neue Examples zur Freigabe (Migration 007)",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Alle 12 Cluster — neue Beispieltexte (160–220 Zeichen, \"du\", USP + Geo-Anker).\n*Freigabe? → `npx tsx migrations/run.ts --only 007`*",
      },
    },
    { type: "divider" },
  ], true);

  // Pro Cluster einen Block
  for (const [clusterId, data] of Object.entries(NEW_EXAMPLES)) {
    const exampleLines = data.new
      .map((t, i) => `*${i + 1}.* ${t}\n_${data.chars[i]} Zeichen_`)
      .join("\n\n");

    await slackBlocks([
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🟢 *Cluster: \`${clusterId}\`*\n\n${exampleLines}`,
        },
      },
      { type: "divider" },
    ], true);

    console.log(`✓ ${clusterId}`);
  }

  // Spring-Post Option B
  await slackBlocks([
    {
      type: "header",
      text: { type: "plain_text", text: "🌸 Pool-B-Lücke Option B: Neuer Spring-Post", emoji: true },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*season:* spring | *pool:* B | *cta:* ${SPRING_POST.cta_type}\n*image_tags:* ${SPRING_POST.image_tags.join(", ")}\n*Zeichen:* ${SPRING_POST.body.length}\n\n*Post-Text:*\n${SPRING_POST.body}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "_Freigabe? Antoine antwortet: \"INSERT B spring\" → dann INSERT ausführen._",
      },
    },
  ], true);

  await slackText("✅ Cluster-Preview abgeschlossen. Warte auf Freigabe.");
  console.log("\n✅ Fertig. Alle Cluster-Examples in Slack.");
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
