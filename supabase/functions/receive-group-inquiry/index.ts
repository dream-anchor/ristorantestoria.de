import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
};

// ── Email templates ───────────────────────────────────────────────────────────

const CONFIRMATION_SUBJECTS: Record<string, string> = {
  de: "Ihre Gruppenanfrage beim Ristorante STORIA München",
  en: "Your Group Enquiry at Ristorante STORIA Munich",
  it: "La vostra richiesta di gruppo al Ristorante STORIA Monaco",
  fr: "Votre demande de groupe au Ristorante STORIA Munich",
};

const CONFIRMATION_GREETINGS: Record<string, string> = {
  de: "Sehr geehrte Damen und Herren,",
  en: "Dear Guest,",
  it: "Gentile ospite,",
  fr: "Madame, Monsieur,",
};

const CONFIRMATION_BODIES: Record<string, string> = {
  de: "vielen Dank für Ihre Gruppenanfrage. Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden (Mo–Sa) mit einem konkreten Angebot.",
  en: "Thank you for your group enquiry. We have received your request and will get back to you within 24 hours (Mon–Sat) with a concrete offer.",
  it: "Grazie per la vostra richiesta di gruppo. Abbiamo ricevuto la vostra richiesta e vi risponderemo entro 24 ore (lun–sab) con un'offerta concreta.",
  fr: "Merci pour votre demande de groupe. Nous avons bien reçu votre demande et vous répondrons dans les 24 heures (lun–sam) avec une offre concrète.",
};

const CONFIRMATION_NOTES: Record<string, string> = {
  de: "Bitte beachten Sie: Eine verbindliche Reservierung kommt erst nach unserer schriftlichen Bestätigung zustande.",
  en: "Please note: A binding reservation is only confirmed once you receive our written confirmation.",
  it: "Nota bene: La prenotazione diventa vincolante solo dopo la nostra conferma scritta.",
  fr: "Veuillez noter : La réservation n'est confirmée qu'après réception de notre confirmation écrite.",
};

const CONFIRMATION_CLOSINGS: Record<string, string> = {
  de: "Wir freuen uns auf Ihren Besuch im Ristorante STORIA!",
  en: "We look forward to welcoming you at Ristorante STORIA!",
  it: "Non vediamo l'ora di accogliervi al Ristorante STORIA!",
  fr: "Nous avons hâte de vous accueillir au Ristorante STORIA !",
};

const MENU_LABELS: Record<string, Record<string, string>> = {
  A: { de: "Menü A – Pizza e Pasta (ab 25 €)", en: "Menu A – Pizza e Pasta (from €25)", it: "Menu A – Pizza e Pasta (da €25)", fr: "Menu A – Pizza e Pasta (à partir de 25 €)" },
  B: { de: "Menü B – Benvenuti (ab 35 €)", en: "Menu B – Benvenuti (from €35)", it: "Menu B – Benvenuti (da €35)", fr: "Menu B – Benvenuti (à partir de 35 €)" },
  C: { de: "Menü C – Tradizione (ab 49 €)", en: "Menu C – Tradizione (from €49)", it: "Menu C – Tradizione (da €49)", fr: "Menu C – Tradizione (à partir de 49 €)" },
  custom: { de: "Individuelles Menü", en: "Individual Menu", it: "Menu individuale", fr: "Menu individuel" },
  advice: { de: "Beratung erwünscht", en: "Advice needed", it: "Consiglio richiesto", fr: "Conseil souhaité" },
};

function buildConfirmationHtml(
  contactName: string,
  language: string,
  groupSize: number,
  preferredDate: string | null,
  preferredMenu: string | null,
): string {
  const lang = ["de", "en", "it", "fr"].includes(language) ? language : "de";
  const menuLabel = preferredMenu ? (MENU_LABELS[preferredMenu]?.[lang] ?? preferredMenu) : null;
  const dateStr = preferredDate
    ? new Date(preferredDate).toLocaleDateString(lang === "de" ? "de-DE" : lang, { day: "2-digit", month: "long", year: "numeric" })
    : null;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f0eb;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0eb;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FDF5E6;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr>
          <td style="background-color:#6b2737;padding:28px 40px;text-align:center;">
            <img src="https://www.ristorantestoria.de/storia-logo.webp" alt="STORIA" width="90" style="display:block;margin:0 auto;" />
            <p style="color:#FDF5E6;margin:10px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Ristorante STORIA &middot; M&uuml;nchen</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="color:#5c3d1f;font-size:16px;margin:0 0 12px;">${CONFIRMATION_GREETINGS[lang]}</p>
            <p style="color:#4a3020;font-size:16px;line-height:1.7;margin:0 0 20px;">${CONFIRMATION_BODIES[lang]}</p>
            ${groupSize || dateStr || menuLabel ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5ede0;border-radius:8px;padding:16px 20px;margin:0 0 20px;">
              <tr><td style="padding:6px 0;">
                ${groupSize ? `<p style="margin:0;color:#4a3020;font-size:14px;"><strong>Gruppengröße:</strong> ${groupSize} Personen</p>` : ""}
                ${dateStr ? `<p style="margin:4px 0 0;color:#4a3020;font-size:14px;"><strong>Wunschtermin:</strong> ${dateStr}</p>` : ""}
                ${menuLabel ? `<p style="margin:4px 0 0;color:#4a3020;font-size:14px;"><strong>Menüwunsch:</strong> ${menuLabel}</p>` : ""}
              </td></tr>
            </table>` : ""}
            <p style="color:#7a5533;font-size:14px;line-height:1.6;margin:0 0 24px;border-left:3px solid #6b2737;padding-left:12px;">${CONFIRMATION_NOTES[lang]}</p>
            <p style="color:#4a3020;font-size:15px;margin:0;">${CONFIRMATION_CLOSINGS[lang]}</p>
            <p style="color:#4a3020;font-size:15px;margin:8px 0 0;">Domenico Speranza &amp; Team</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 20px;text-align:center;">
            <a href="https://www.ristorantestoria.de/reisegruppen/" style="display:inline-block;background-color:#6b2737;color:#FDF5E6;text-decoration:none;padding:12px 28px;border-radius:50px;font-size:14px;font-weight:bold;">Gruppenmenüs ansehen</a>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f5ede0;padding:16px 40px;border-top:1px solid #e8d5bf;">
            <p style="color:#8B4513;font-size:12px;margin:0;text-align:center;">Ristorante STORIA &middot; Karlstra&szlig;e 47a &middot; 80333 M&uuml;nchen</p>
            <p style="color:#8B4513;font-size:12px;margin:4px 0 0;text-align:center;"><a href="tel:+498951519696" style="color:#8B4513;text-decoration:none;">+49 89 51519696</a> &middot; <a href="mailto:info@ristorantestoria.de" style="color:#8B4513;text-decoration:none;">info@ristorantestoria.de</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildNotificationHtml(data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .filter(([k]) => !["travelPlanBase64"].includes(k))
    .map(([k, v]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:bold;white-space:nowrap;">${k}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${v ?? "—"}</td></tr>`)
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;">
  <div style="max-width:640px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
    <div style="background:#6b2737;padding:20px 24px;">
      <h2 style="color:#FDF5E6;margin:0;font-size:18px;">&#128101; Neue Reisegruppen-Anfrage</h2>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;">
      ${rows}
    </table>
    <div style="padding:16px 24px;background:#f9f9f9;font-size:12px;color:#888;">
      Eingegangen am ${new Date().toLocaleString("de-DE")} · ristorantestoria.de
    </div>
  </div>
</body></html>`;
}

// ── Main handler ──────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const {
      companyName,
      contactName,
      email,
      phone,
      groupSize,
      preferredDate,
      preferredDateFlexible,
      arrivalTime,
      preferredMenu,
      message,
      travelPlanBase64,
      travelPlanFilename,
      language = "de",
      source,
      utm_source = null,
      utm_medium = null,
      utm_campaign = null,
      utm_term = null,
      utm_content = null,
    } = body;

    if (!contactName || !email || !groupSize) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY_RISTORANTE");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save to DB
    const { data: inquiry, error: dbError } = await supabase
      .from("group_inquiries")
      .insert({
        company_name: companyName ?? null,
        contact_name: contactName,
        email,
        phone: phone ?? null,
        group_size: groupSize,
        preferred_date: preferredDate ?? null,
        preferred_date_flexible: preferredDateFlexible ?? false,
        arrival_time: arrivalTime ?? null,
        preferred_menu: preferredMenu ?? null,
        message: message ?? null,
        has_travel_plan: !!travelPlanBase64,
        travel_plan_filename: travelPlanFilename ?? null,
        language,
        source: source ?? "web",
        status: "new",
        utm_source: utm_source ?? null,
        utm_medium: utm_medium ?? null,
        utm_campaign: utm_campaign ?? null,
        utm_term: utm_term ?? null,
        utm_content: utm_content ?? null,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("[group-inquiry] DB error:", dbError.message);
      // Don't fail the user if only DB has issues — still send emails
    }

    console.log(`[group-inquiry] Saved id=${inquiry?.id ?? "unknown"}`);

    // ── Forward to MAESTRO (non-blocking) ────────────────────────────────────
    const maestroUrl = Deno.env.get("MAESTRO_WEBHOOK_URL");
    const maestroSecret = Deno.env.get("MAESTRO_WEBHOOK_SECRET");

    if (maestroUrl && maestroSecret) {
      try {
        const maestroRes = await fetch(maestroUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-webhook-secret": maestroSecret,
          },
          body: JSON.stringify({
            external_id: inquiry?.id ?? null,
            contactName,
            companyName: companyName ?? null,
            email,
            phone: phone ?? null,
            groupSize,
            preferredDate: preferredDate ?? null,
            preferredDateFlexible: preferredDateFlexible ?? false,
            arrivalTime: arrivalTime ?? null,
            preferredMenu: preferredMenu ?? null,
            message: message ?? null,
            travelPlanBase64: travelPlanBase64 ?? null,
            travelPlanFilename: travelPlanFilename ?? null,
            language: language ?? "de",
            utm: {
              utm_source: utm_source ?? null,
              utm_medium: utm_medium ?? null,
              utm_campaign: utm_campaign ?? null,
              utm_term: utm_term ?? null,
              utm_content: utm_content ?? null,
            },
            source: "ristorantestoria-reisegruppen",
          }),
        });

        if (!maestroRes.ok) {
          const errBody = await maestroRes.text().catch(() => "(no body)");
          console.error(`[group-inquiry] MAESTRO webhook failed: ${maestroRes.status} — ${errBody}`);

          // Alert Antoine that MAESTRO sync is broken
          const alertResendKey = Deno.env.get("RESEND_API_KEY_RISTORANTE");
          if (alertResendKey) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { Authorization: `Bearer ${alertResendKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: "STORIA System <info@ristorantestoria.de>",
                to: ["info@monot.com"],
                subject: `[ALERT] MAESTRO-Sync fehlgeschlagen — Anfrage ${inquiry?.id ?? "unknown"}`,
                html: `<p>Der MAESTRO-Webhook hat einen Fehler zurückgegeben:</p>
<pre>Status: ${maestroRes.status}\n${errBody}</pre>
<p>Lokale DB und E-Mails wurden erfolgreich verarbeitet. Bitte MAESTRO manuell prüfen.</p>
<p>Inquiry-ID: <strong>${inquiry?.id ?? "unknown"}</strong> · ${contactName} · ${email}</p>`,
              }),
            }).catch((e: unknown) => console.error("[group-inquiry] Alert mail failed:", e));
          }
        } else {
          console.log("[group-inquiry] MAESTRO webhook OK");
        }
      } catch (webhookErr) {
        console.error("[group-inquiry] MAESTRO webhook threw:", webhookErr);
        // Same alert logic
        const alertResendKey = Deno.env.get("RESEND_API_KEY_RISTORANTE");
        if (alertResendKey) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${alertResendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "STORIA System <info@ristorantestoria.de>",
              to: ["info@monot.com"],
              subject: `[ALERT] MAESTRO-Sync Exception — Anfrage ${inquiry?.id ?? "unknown"}`,
              html: `<p>MAESTRO-Webhook hat eine Exception geworfen:</p>
<pre>${webhookErr instanceof Error ? webhookErr.message : String(webhookErr)}</pre>
<p>Inquiry-ID: <strong>${inquiry?.id ?? "unknown"}</strong> · ${contactName} · ${email}</p>`,
            }),
          }).catch((e: unknown) => console.error("[group-inquiry] Alert mail failed:", e));
        }
      }
    } else {
      console.log("[group-inquiry] MAESTRO_WEBHOOK_URL or MAESTRO_WEBHOOK_SECRET not set — skipping");
    }

    if (!resendApiKey) {
      console.log("[group-inquiry] No RESEND_API_KEY_RISTORANTE — skipping email send");
      return new Response(
        JSON.stringify({ success: true, id: inquiry?.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build attachments for notification email (PDF if provided)
    const attachments: Array<{ filename: string; content: string }> = [];
    if (travelPlanBase64 && travelPlanFilename) {
      attachments.push({ filename: travelPlanFilename, content: travelPlanBase64 });
    }

    // Notification email to Domenico
    const notificationData: Record<string, unknown> = {
      contactName,
      email,
      companyName: companyName || "—",
      phone: phone || "—",
      groupSize: `${groupSize} Personen`,
      preferredDate: preferredDate || "—",
      preferredDateFlexible: preferredDateFlexible ? "Ja" : "Nein",
      arrivalTime: arrivalTime || "—",
      preferredMenu: preferredMenu ? (MENU_LABELS[preferredMenu]?.de ?? preferredMenu) : "—",
      message: message || "—",
      language,
      hasTravelPlan: travelPlanBase64 ? `Ja (${travelPlanFilename})` : "Nein",
    };

    const notificationPayload: Record<string, unknown> = {
      from: "STORIA Anfrage <info@ristorantestoria.de>",
      to: ["info@ristorantestoria.de"],
      subject: `[Reisegruppe] ${contactName}${companyName ? ` · ${companyName}` : ""} · ${groupSize} Personen`,
      html: buildNotificationHtml(notificationData),
    };

    if (attachments.length > 0) {
      notificationPayload.attachments = attachments;
    }

    const [notifRes, confirmRes] = await Promise.all([
      // Notification to restaurant
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(notificationPayload),
      }),
      // Auto-confirmation to customer
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Ristorante STORIA <info@ristorantestoria.de>",
          to: [email],
          subject: CONFIRMATION_SUBJECTS[language] ?? CONFIRMATION_SUBJECTS.de,
          html: buildConfirmationHtml(contactName, language, groupSize, preferredDate ?? null, preferredMenu ?? null),
        }),
      }),
    ]);

    if (!notifRes.ok) console.error("[group-inquiry] Notification email failed:", await notifRes.text());
    if (!confirmRes.ok) console.error("[group-inquiry] Confirmation email failed:", await confirmRes.text());

    return new Response(
      JSON.stringify({ success: true, id: inquiry?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[group-inquiry] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
