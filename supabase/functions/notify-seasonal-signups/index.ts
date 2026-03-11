import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Required DB tables (create via Supabase SQL Editor if not existing):
 *
 * seasonal_notifications:
 *   id uuid PK DEFAULT gen_random_uuid()
 *   seasonal_event text NOT NULL
 *   menu_id uuid REFERENCES menus(id)
 *   trigger_type text NOT NULL DEFAULT 'manual'
 *   status text NOT NULL DEFAULT 'pending'
 *   total_recipients int NOT NULL DEFAULT 0
 *   sent_count int DEFAULT 0
 *   failed_count int DEFAULT 0
 *   email_subject jsonb     -- { de: "...", en: "...", it: "...", fr: "..." }
 *   email_body_html jsonb   -- { de: "<html>...", en: "...", ... }
 *   created_at timestamptz DEFAULT now()
 *   completed_at timestamptz
 *   created_by uuid REFERENCES auth.users(id)
 *
 * seasonal_notification_recipients:
 *   id uuid PK DEFAULT gen_random_uuid()
 *   notification_id uuid REFERENCES seasonal_notifications(id)
 *   signup_id uuid REFERENCES seasonal_signups(id)
 *   email text NOT NULL
 *   language text NOT NULL DEFAULT 'de'
 *   status text NOT NULL DEFAULT 'pending'
 *   resend_id text
 *   error_message text
 *   sent_at timestamptz
 */

const EVENT_LABELS: Record<string, Record<string, string>> = {
  valentinstag: { de: "Valentinstag", en: "Valentine's Day", it: "San Valentino", fr: "Saint-Valentin" },
  weihnachten: { de: "Weihnachten", en: "Christmas", it: "Natale", fr: "Noël" },
  silvester: { de: "Silvester", en: "New Year's Eve", it: "Capodanno", fr: "Nouvel An" },
  ostermontag: { de: "Ostermontag-Menü", en: "Easter Monday Menu", it: "Menù di Pasqua", fr: "Menu de Pâques" },
};

const EVENT_URLS: Record<string, Record<string, string>> = {
  valentinstag: {
    de: "https://www.ristorantestoria.de/besondere-anlaesse/valentinstag-menue/",
    en: "https://www.ristorantestoria.de/en/special-occasions/valentines-menu/",
    it: "https://www.ristorantestoria.de/it/occasioni-speciali/san-valentino-menu/",
    fr: "https://www.ristorantestoria.de/fr/occasions-speciales/saint-valentin-menu/",
  },
  weihnachten: {
    de: "https://www.ristorantestoria.de/besondere-anlaesse/weihnachtsmenue/",
    en: "https://www.ristorantestoria.de/en/special-occasions/christmas-menu/",
    it: "https://www.ristorantestoria.de/it/occasioni-speciali/natale-menu/",
    fr: "https://www.ristorantestoria.de/fr/occasions-speciales/noel-menu/",
  },
  silvester: {
    de: "https://www.ristorantestoria.de/besondere-anlaesse/silvester/",
    en: "https://www.ristorantestoria.de/en/special-occasions/new-years-eve/",
    it: "https://www.ristorantestoria.de/it/occasioni-speciali/capodanno/",
    fr: "https://www.ristorantestoria.de/fr/occasions-speciales/nouvel-an/",
  },
  ostermontag: {
    de: "https://www.ristorantestoria.de/besondere-anlaesse/ostermontag-menue/",
    en: "https://www.ristorantestoria.de/en/special-occasions/easter-monday-menu/",
    it: "https://www.ristorantestoria.de/it/occasioni-speciali/menu-di-pasqua/",
    fr: "https://www.ristorantestoria.de/fr/occasions-speciales/menu-de-paques/",
  },
};

const LANG_NAMES: Record<string, string> = {
  de: "Deutsch",
  en: "Englisch",
  it: "Italienisch",
  fr: "Französisch",
};

async function generateEmailContent(
  seasonal_event: string,
  language: string,
  subjectOnly = false
): Promise<{ subject: string; body_html: string }> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  const eventLabel = EVENT_LABELS[seasonal_event]?.[language] ?? seasonal_event;
  const menuUrl = EVENT_URLS[seasonal_event]?.[language] ?? "https://www.ristorantestoria.de/";

  if (!apiKey) {
    return buildFallbackContent(seasonal_event, language, eventLabel, menuUrl);
  }

  const systemPrompt = subjectOnly
    ? `Du bist ein E-Mail-Texter für das Ristorante STORIA München. Erstelle NUR eine E-Mail-Betreffzeile auf ${LANG_NAMES[language] ?? language} für unser ${eventLabel}-Menü. Antworte NUR mit dem Betreff, ohne Anführungszeichen, max. 80 Zeichen.`
    : `Du bist ein E-Mail-Texter für das Ristorante STORIA München. Erstelle eine kurze, elegante E-Mail auf ${LANG_NAMES[language] ?? language} für unser ${eventLabel}-Menü.
Antworte NUR mit validem JSON: {"subject": "...", "body_html": "..."}
Das body_html muss vollständiges HTML mit inline CSS sein.
Farben: #8B4513 (primär/braun), #FDF5E6 (hintergrund/creme)
Logo: https://www.ristorantestoria.de/storia-logo.webp
Menü-URL: ${menuUrl}
CTA-Button direkt zur Menü-URL. Max. 120 Wörter. Elegant und persönlich.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: subjectOnly ? 50 : 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: `${eventLabel} auf ${LANG_NAMES[language] ?? language}` }],
      }),
    });

    if (!response.ok) {
      console.error("[notify] Anthropic error:", response.status);
      return buildFallbackContent(seasonal_event, language, eventLabel, menuUrl);
    }

    const data = await response.json();
    const text = (data.content?.[0]?.text ?? "").trim();

    if (subjectOnly) {
      return { subject: text.slice(0, 150), body_html: "" };
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.subject && parsed.body_html) return parsed;
    }

    return buildFallbackContent(seasonal_event, language, eventLabel, menuUrl);
  } catch (err) {
    console.error("[notify] AI call failed:", err);
    return buildFallbackContent(seasonal_event, language, eventLabel, menuUrl);
  }
}

function buildFallbackContent(
  seasonal_event: string,
  language: string,
  eventLabel: string,
  menuUrl: string
): { subject: string; body_html: string } {
  const subjects: Record<string, Record<string, string>> = {
    valentinstag: {
      de: `Ihr ${eventLabel}-Menü im STORIA ist jetzt verfügbar`,
      en: `Your Valentine's Day Menu at STORIA is now available`,
      it: `Il vostro Menù di San Valentino al STORIA è ora disponibile`,
      fr: `Votre Menu Saint-Valentin au STORIA est maintenant disponible`,
    },
    weihnachten: {
      de: `Ihr Weihnachtsmenü im STORIA ist jetzt verfügbar`,
      en: `Your Christmas Menu at STORIA is now available`,
      it: `Il vostro Menù di Natale al STORIA è ora disponibile`,
      fr: `Votre Menu de Noël au STORIA est maintenant disponible`,
    },
    silvester: {
      de: `Ihr Silvester-Menü im STORIA ist jetzt verfügbar`,
      en: `Your New Year's Eve Menu at STORIA is now available`,
      it: `Il vostro Menù di Capodanno al STORIA è ora disponibile`,
      fr: `Votre Menu du Nouvel An au STORIA est maintenant disponible`,
    },
    ostermontag: {
      de: `Ihr Ostermontag-Menü im STORIA ist jetzt verfügbar`,
      en: `Your Easter Monday Menu at STORIA is now available`,
      it: `Il vostro Menù di Pasqua al STORIA è ora disponibile`,
      fr: `Votre Menu de Pâques au STORIA est maintenant disponible`,
    },
  };

  const greetings: Record<string, string> = {
    de: "Guten Tag,",
    en: "Dear Guest,",
    it: "Gentile ospite,",
    fr: "Cher(e) hôte,",
  };

  const intros: Record<string, string> = {
    de: `Wir freuen uns, Ihnen mitteilen zu dürfen, dass unser ${eventLabel}-Menü jetzt verfügbar ist. Reservieren Sie jetzt Ihren Tisch.`,
    en: `We are delighted to inform you that our ${eventLabel} menu is now available. Book your table now.`,
    it: `Siamo lieti di informarvi che il nostro ${eventLabel} è ora disponibile. Prenotate il vostro tavolo ora.`,
    fr: `Nous sommes heureux de vous informer que notre ${eventLabel} est maintenant disponible. Réservez votre table maintenant.`,
  };

  const buttonTexts: Record<string, string> = {
    de: "Menü ansehen & Reservieren",
    en: "View Menu & Reserve",
    it: "Vedi Menù & Prenota",
    fr: "Voir le Menu & Réserver",
  };

  const footerTexts: Record<string, string> = {
    de: "Sie erhalten diese E-Mail, weil Sie sich für unsere saisonalen Angebote vorgemerkt haben.",
    en: "You receive this email because you signed up for our seasonal offers.",
    it: "Ricevete questa email perché vi siete registrati per le nostre offerte stagionali.",
    fr: "Vous recevez cet e-mail parce que vous vous êtes inscrit(e) à nos offres saisonnières.",
  };

  const subject = subjects[seasonal_event]?.[language] ?? `${eventLabel} - Ristorante STORIA`;
  const greeting = greetings[language] ?? greetings.de;
  const intro = intros[language] ?? intros.de;
  const buttonText = buttonTexts[language] ?? buttonTexts.de;
  const footerText = footerTexts[language] ?? footerTexts.de;

  const body_html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f0eb;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0eb;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FDF5E6;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr>
          <td style="background-color:#8B4513;padding:32px 40px;text-align:center;">
            <img src="https://www.ristorantestoria.de/storia-logo.webp" alt="STORIA" width="100" style="display:block;margin:0 auto;opacity:0.95;" />
            <p style="color:#FDF5E6;margin:12px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Ristorante STORIA &middot; M&uuml;nchen</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="color:#5c3d1f;font-size:16px;margin:0 0 16px;">${greeting}</p>
            <p style="color:#4a3020;font-size:16px;line-height:1.7;margin:0 0 32px;">${intro}</p>
            <div style="text-align:center;">
              <a href="${menuUrl}" style="display:inline-block;background-color:#8B4513;color:#FDF5E6;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:15px;font-weight:bold;letter-spacing:1px;">${buttonText}</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 24px;text-align:center;">
            <p style="color:#8B4513;font-size:13px;margin:0;">Ristorante STORIA &middot; Theresienstra&szlig;e 56 &middot; 80333 M&uuml;nchen</p>
            <p style="color:#8B4513;font-size:13px;margin:4px 0 0;"><a href="tel:+4989288068550" style="color:#8B4513;text-decoration:none;">+49 89 28806855</a></p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f5ede0;padding:16px 40px;border-top:1px solid #e8d5bf;">
            <p style="color:#a08060;font-size:11px;margin:0;text-align:center;">${footerText}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, body_html };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { seasonal_event, menu_id, trigger_type = "manual", preview = false } = payload;

    if (!seasonal_event) {
      return new Response(
        JSON.stringify({ error: "Missing seasonal_event" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[notify] event="${seasonal_event}", trigger="${trigger_type}", preview=${preview}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY_RISTORANTE");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch unnotified signups
    const { data: signups, error: signupsError } = await supabase
      .from("seasonal_signups")
      .select("id, email, language")
      .eq("seasonal_event", seasonal_event)
      .is("notified_at", null);

    if (signupsError) throw new Error(`Failed to fetch signups: ${signupsError.message}`);

    if (!signups || signups.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No unnotified signups" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Group by language
    const byLanguage: Record<string, Array<{ id: string; email: string }>> = {};
    for (const signup of signups) {
      const lang = signup.language || "de";
      if (!byLanguage[lang]) byLanguage[lang] = [];
      byLanguage[lang].push({ id: signup.id, email: signup.email });
    }

    const languages = Object.keys(byLanguage);
    const countsByLang: Record<string, number> = {};
    for (const lang of languages) countsByLang[lang] = byLanguage[lang].length;

    // Generate email content per language (parallel)
    const contentByLanguage: Record<string, { subject: string; body_html: string }> = {};
    await Promise.all(
      languages.map(async (lang) => {
        contentByLanguage[lang] = await generateEmailContent(seasonal_event, lang, preview);
      })
    );

    // PREVIEW MODE — return content without sending
    if (preview) {
      const previews: Record<string, { subject: string }> = {};
      for (const lang of languages) {
        previews[lang] = { subject: contentByLanguage[lang].subject };
      }
      return new Response(
        JSON.stringify({
          preview: true,
          total: signups.length,
          counts_by_lang: countsByLang,
          previews,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SEND MODE — check for existing completed notification for this menu_id
    if (menu_id) {
      const { data: existing } = await supabase
        .from("seasonal_notifications")
        .select("id, status")
        .eq("menu_id", menu_id)
        .eq("status", "completed")
        .maybeSingle();

      if (existing) {
        console.log(`[notify] Already completed for menu_id=${menu_id}, skipping`);
        return new Response(
          JSON.stringify({ skipped: true, reason: "already_notified", notification_id: existing.id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Extract email content for storage (jsonb per language)
    const emailSubject: Record<string, string> = {};
    const emailBodyHtml: Record<string, string> = {};
    for (const lang of languages) {
      emailSubject[lang] = contentByLanguage[lang].subject;
      emailBodyHtml[lang] = contentByLanguage[lang].body_html;
    }

    // Create notification record
    const { data: notification, error: notifError } = await supabase
      .from("seasonal_notifications")
      .insert({
        seasonal_event,
        menu_id: menu_id ?? null,
        trigger_type,
        status: "sending",
        total_recipients: signups.length,
        email_subject: emailSubject,
        email_body_html: emailBodyHtml,
      })
      .select()
      .single();

    if (notifError) throw new Error(`Failed to create notification: ${notifError.message}`);
    console.log(`[notify] Created notification id=${notification.id}`);

    let sentCount = 0;
    let failedCount = 0;
    const now = new Date().toISOString();

    // Send emails
    for (const [lang, recipients] of Object.entries(byLanguage)) {
      const { subject, body_html } = contentByLanguage[lang];

      for (const recipient of recipients) {
        let emailStatus = "sent";
        let emailError: string | null = null;
        let resendId: string | null = null;

        if (resendApiKey) {
          try {
            const emailResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "Ristorante STORIA <info@ristorantestoria.de>",
                to: [recipient.email],
                subject,
                html: body_html,
              }),
            });

            if (!emailResponse.ok) {
              const errText = await emailResponse.text();
              console.error(`[notify] Resend error for ${recipient.email}:`, errText);
              emailStatus = "failed";
              emailError = errText.slice(0, 500);
              failedCount++;
            } else {
              const resendData = await emailResponse.json();
              resendId = resendData?.id ?? null;
              sentCount++;
            }
          } catch (err) {
            emailStatus = "failed";
            emailError = err instanceof Error ? err.message : "Unknown error";
            failedCount++;
          }
        } else {
          // Dev mode — no Resend key
          console.log(`[notify] DEV — would send to ${recipient.email} (${lang}): "${subject}"`);
          sentCount++;
        }

        await supabase.from("seasonal_notification_recipients").insert({
          notification_id: notification.id,
          signup_id: recipient.id,
          email: recipient.email,
          language: lang,
          status: emailStatus,
          resend_id: resendId,
          sent_at: emailStatus === "sent" ? now : null,
          error_message: emailError,
        });

        if (emailStatus === "sent") {
          await supabase
            .from("seasonal_signups")
            .update({ notified_at: now })
            .eq("id", recipient.id);
        }
      }
    }

    const finalStatus =
      failedCount === 0 ? "completed" : failedCount === signups.length ? "failed" : "partial";

    await supabase
      .from("seasonal_notifications")
      .update({ status: finalStatus, sent_count: sentCount, failed_count: failedCount, completed_at: now })
      .eq("id", notification.id);

    console.log(`[notify] Done: sent=${sentCount}, failed=${failedCount}, status=${finalStatus}`);

    return new Response(
      JSON.stringify({ success: true, notification_id: notification.id, sent: sentCount, failed: failedCount, status: finalStatus }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[notify] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
