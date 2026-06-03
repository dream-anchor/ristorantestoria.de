import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { slackBlocks } from "./slack.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

await slackBlocks([
  { type: "header", text: { type: "plain_text", text: "📋 Migration 015 — 4 Änderungen — GO?", emoji: true } },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: [
        "*gbp_images — Duplikate deaktivieren:*",
        "• `firmenfeier-eventlocation-storia-muenchen.webp` → is_active=FALSE _(identisch zu firmenfeier-event.webp)_",
        "• `weihnachtsfeier-italiener-storia-muenchen.webp` → is_active=FALSE _(identisch zu weihnachtsfeier-event.webp)_",
        "",
        "*gbp_images — Tag-Korrektur:*",
        "• `silvester-dinner-gala-storia-muenchen.webp`",
        "  season: winter → *allyear*",
        "  tags: [innenraum, dinner, event] → *[innenraum, geburtstag, event]*",
        "",
        "*gbp_posts — Post-Tag-Korrektur:*",
        "• ID 14 B/brand/1 Handwerk",
        "  image_tags: [pasta, handwerk] → *[pasta, pizza]*",
        "  _(handwerk-Tag zog tiramisu.webp; Post bewirbt Pasta+Pizza)_",
      ].join("\n"),
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: { type: "mrkdwn", text: "*GO 015?* → Antwort mit \"GO 015\"" },
  },
], true);

console.log("✅ Migration-015-Preview gesendet.");
