/**
 * Slack-Hilfsfunktionen für GBP-Routine
 */

const WEBHOOK = process.env.SLACK_WEBHOOK_URL;

export async function slackText(text: string): Promise<void> {
  if (!WEBHOOK) return;
  try {
    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("Slack-Fehler:", err);
  }
}

interface PostPreviewOptions {
  dryRun: boolean;
  status: "gepostet" | "failed" | "dry_run";
  weekday: string;
  slotTime: string;
  pool: string;
  body: string;
  ctaType: string;
  ctaUrl: string;
  imageUrl: string;
  imageFilename: string;
  gbpPostId: string | null;
  errorLog: string | null;
}

export async function slackPostPreview(opts: PostPreviewOptions): Promise<void> {
  if (!WEBHOOK) return;

  const emoji = opts.status === "gepostet" ? "✅" : opts.status === "dry_run" ? "🔲" : "❌";
  const label = opts.dryRun ? " [DRY RUN]" : "";

  const lines: string[] = [
    `${emoji} STORIA GBP${label}: ${opts.weekday} ${opts.slotTime} | Pool ${opts.pool}`,
    `*Post:* ${opts.body}`,
    `*CTA:* ${opts.ctaType} → ${opts.ctaUrl}`,
    `*Bild:* ${opts.imageFilename}`,
  ];

  if (opts.gbpPostId) lines.push(`*GBP-ID:* ${opts.gbpPostId}`);
  if (opts.errorLog) lines.push(`*Fehler:* ${opts.errorLog}`);

  await slackText(lines.join("\n"));
}
