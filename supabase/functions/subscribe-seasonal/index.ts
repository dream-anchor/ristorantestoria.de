import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CONSENT_VERSION = "2026-06-doi-v1";

const ALLOWED_EVENTS = new Set(["valentinstag", "weihnachten", "silvester", "ostermontag"]);
const ALLOWED_LANGS = new Set(["de", "en", "it", "fr"]);

// Confirmation page path per language (frontend route)
const CONFIRM_PATHS: Record<string, string> = {
  de: "newsletter-bestaetigen",
  en: "en/confirm-newsletter",
  it: "it/conferma-newsletter",
  fr: "fr/confirmation-newsletter",
};

const EVENT_LABELS: Record<string, Record<string, string>> = {
  valentinstag: { de: "Valentinstag", en: "Valentine's Day", it: "San Valentino", fr: "Saint-Valentin" },
  weihnachten: { de: "Weihnachten", en: "Christmas", it: "Natale", fr: "Noël" },
  silvester: { de: "Silvester", en: "New Year's Eve", it: "Capodanno", fr: "Nouvel An" },
  ostermontag: { de: "Ostern", en: "Easter", it: "Pasqua", fr: "Pâques" },
};

const DOI_COPY: Record<string, { subject: string; greeting: string; intro: string; button: string; note: string; ignore: string }> = {
  de: {
    subject: "Bitte bestätigen Sie Ihre Anmeldung",
    greeting: "Guten Tag,",
    intro:
      "vielen Dank für Ihr Interesse an unserer Benachrichtigung zum {event}-Menü. Bitte bestätigen Sie Ihre E-Mail-Adresse, um die Anmeldung abzuschließen.",
    button: "Anmeldung bestätigen",
    note: "Erst nach Ihrer Bestätigung nehmen wir Sie in den Verteiler auf.",
    ignore: "Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach.",
  },
  en: {
    subject: "Please confirm your subscription",
    greeting: "Hello,",
    intro:
      "thank you for your interest in our {event} menu notification. Please confirm your email address to complete your subscription.",
    button: "Confirm subscription",
    note: "We will only add you to the list after your confirmation.",
    ignore: "If you did not sign up, simply ignore this email.",
  },
  it: {
    subject: "Conferma la tua iscrizione",
    greeting: "Buongiorno,",
    intro:
      "grazie per il tuo interesse alla notifica del menù di {event}. Conferma il tuo indirizzo email per completare l'iscrizione.",
    button: "Conferma iscrizione",
    note: "Ti aggiungeremo all'elenco solo dopo la tua conferma.",
    ignore: "Se non ti sei registrato, ignora semplicemente questa email.",
  },
  fr: {
    subject: "Veuillez confirmer votre inscription",
    greeting: "Bonjour,",
    intro:
      "merci de votre intérêt pour notre notification du menu {event}. Veuillez confirmer votre adresse e-mail pour finaliser votre inscription.",
    button: "Confirmer l'inscription",
    note: "Nous ne vous ajouterons à la liste qu'après votre confirmation.",
    ignore: "Si vous ne vous êtes pas inscrit(e), ignorez simplement cet e-mail.",
  },
};

function buildDoiEmail(lang: string, seasonalEvent: string, confirmUrl: string): { subject: string; html: string } {
  const c = DOI_COPY[lang] ?? DOI_COPY.de;
  const eventLabel = EVENT_LABELS[seasonalEvent]?.[lang] ?? seasonalEvent;
  const intro = c.intro.replace("{event}", eventLabel);
  const html = `<!DOCTYPE html>
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
            <p style="color:#5c3d1f;font-size:16px;margin:0 0 16px;">${c.greeting}</p>
            <p style="color:#4a3020;font-size:16px;line-height:1.7;margin:0 0 16px;">${intro}</p>
            <p style="color:#4a3020;font-size:14px;line-height:1.7;margin:0 0 32px;">${c.note}</p>
            <div style="text-align:center;">
              <a href="${confirmUrl}" style="display:inline-block;background-color:#8B4513;color:#FDF5E6;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:15px;font-weight:bold;letter-spacing:1px;">${c.button}</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f5ede0;padding:16px 40px;border-top:1px solid #e8d5bf;">
            <p style="color:#a08060;font-size:11px;margin:0;text-align:center;">${c.ignore}</p>
            <p style="color:#a08060;font-size:11px;margin:6px 0 0;text-align:center;">Ristorante STORIA &middot; Theresienstra&szlig;e 56 &middot; 80333 M&uuml;nchen</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  return { subject: c.subject, html };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const seasonal_event = String(body.seasonal_event ?? "").trim();
    const language = String(body.language ?? "de").trim();
    const consent_text = String(body.consent_text ?? "").trim().slice(0, 1000);

    // Validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
    if (!emailOk) {
      return new Response(JSON.stringify({ error: "invalid_email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!ALLOWED_EVENTS.has(seasonal_event)) {
      return new Response(JSON.stringify({ error: "invalid_event" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const lang = ALLOWED_LANGS.has(language) ? language : "de";
    if (!consent_text) {
      return new Response(JSON.stringify({ error: "missing_consent" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Existing signup for this email+event?
    const { data: existing } = await supabase
      .from("seasonal_signups")
      .select("id, status, confirm_token")
      .eq("email", email)
      .eq("seasonal_event", seasonal_event)
      .maybeSingle();

    if (existing && existing.status === "confirmed") {
      return new Response(JSON.stringify({ ok: true, status: "already_confirmed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();
    const token = crypto.randomUUID();

    if (existing) {
      // Pending or previously unsubscribed → reset to pending + new token, re-send DOI
      const { error: updErr } = await supabase
        .from("seasonal_signups")
        .update({
          status: "pending",
          confirm_token: token,
          confirmed_at: null,
          language: lang,
          consent_ip: ip,
          consent_text,
          consent_at: now,
          consent_version: CONSENT_VERSION,
        })
        .eq("id", existing.id);
      if (updErr) throw new Error(`update failed: ${updErr.message}`);
    } else {
      const { error: insErr } = await supabase.from("seasonal_signups").insert({
        email,
        seasonal_event,
        language: lang,
        status: "pending",
        confirm_token: token,
        consent_ip: ip,
        consent_text,
        consent_at: now,
        consent_version: CONSENT_VERSION,
      });
      if (insErr) throw new Error(`insert failed: ${insErr.message}`);
    }

    // Build confirmation URL + send double-opt-in email
    const confirmPath = CONFIRM_PATHS[lang] ?? CONFIRM_PATHS.de;
    const confirmUrl = `https://www.ristorantestoria.de/${confirmPath}?token=${token}`;
    const { subject, html } = buildDoiEmail(lang, seasonal_event, confirmUrl);

    const resendApiKey = Deno.env.get("RESEND_API_KEY_RISTORANTE");
    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Ristorante STORIA <info@ristorantestoria.de>",
          to: [email],
          subject,
          html,
        }),
      });
      if (!emailResponse.ok) {
        const errText = await emailResponse.text();
        console.error("[subscribe-seasonal] Resend error:", emailResponse.status, errText);
        return new Response(JSON.stringify({ error: "email_send_failed", resend_status: emailResponse.status, resend_details: errText }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      console.log(`[subscribe-seasonal] DEV — would send DOI to ${email}: ${confirmUrl}`);
    }

    return new Response(JSON.stringify({ ok: true, status: "pending" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[subscribe-seasonal] error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});