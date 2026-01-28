import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryData {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  guest_count: string;
  event_type: string;
  preferred_date?: string;
  message?: string;
}

const eventTypeLabels: Record<string, string> = {
  'weihnachtsfeier': 'Weihnachtsfeier',
  'sommerfest': 'Sommerfest',
  'team-building': 'Team-Building',
  'business-dinner': 'Business-Dinner',
  'jubilaeum': 'Firmenjubiläum',
  'firmenfeier': 'Firmenfeier',
  'sonstiges': 'Sonstiges',
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Nicht angegeben';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

serve(async (req: Request): Promise<Response> => {
  console.log("Received request to send-inquiry-notification");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    
    if (!smtpUser || !smtpPassword) {
      throw new Error("SMTP credentials nicht konfiguriert");
    }

    const inquiry: InquiryData = await req.json();
    console.log("Processing inquiry for:", inquiry.company_name);

    const eventLabel = eventTypeLabels[inquiry.event_type] || inquiry.event_type;

    // Create SMTP client for IONOS with STARTTLS
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.ionos.de",
        port: 465,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPassword,
        },
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #722F37; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 24px; border: 1px solid #eee; }
          .section { margin-bottom: 20px; }
          .section h3 { color: #722F37; margin: 0 0 12px 0; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
          .row { display: flex; margin-bottom: 8px; }
          .label { font-weight: 600; width: 140px; color: #666; }
          .value { flex: 1; }
          .message-box { background: white; border: 1px solid #ddd; padding: 16px; border-radius: 4px; margin-top: 8px; }
          .footer { background: #f0f0f0; padding: 16px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .cta { display: inline-block; background: #722F37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Neue Event-Anfrage</h1>
          </div>
          <div class="content">
            <div class="section">
              <h3>📋 Kontaktdaten</h3>
              <div class="row"><span class="label">Firma:</span><span class="value">${inquiry.company_name}</span></div>
              <div class="row"><span class="label">Ansprechpartner:</span><span class="value">${inquiry.contact_name}</span></div>
              <div class="row"><span class="label">E-Mail:</span><span class="value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></span></div>
              <div class="row"><span class="label">Telefon:</span><span class="value">${inquiry.phone || 'Nicht angegeben'}</span></div>
            </div>
            
            <div class="section">
              <h3>🎊 Event-Details</h3>
              <div class="row"><span class="label">Veranstaltungsart:</span><span class="value"><strong>${eventLabel}</strong></span></div>
              <div class="row"><span class="label">Personenanzahl:</span><span class="value"><strong>${inquiry.guest_count} Personen</strong></span></div>
              <div class="row"><span class="label">Wunschtermin:</span><span class="value">${formatDate(inquiry.preferred_date)}</span></div>
            </div>
            
            ${inquiry.message ? `
            <div class="section">
              <h3>💬 Nachricht</h3>
              <div class="message-box">${inquiry.message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            
            <div style="text-align: center;">
              <a href="mailto:${inquiry.email}?subject=Re: Ihre Event-Anfrage bei STORIA" class="cta">
                ✉️ Direkt antworten
              </a>
            </div>
          </div>
          <div class="footer">
            Diese E-Mail wurde automatisch generiert.<br>
            STORIA Restaurant · Karlstraße 47a · 80333 München
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via IONOS SMTP
    await client.send({
      from: smtpUser,
      to: "info@ristorantestoria.de",
      subject: `Neue Event-Anfrage: ${inquiry.company_name} - ${eventLabel}`,
      content: "auto",
      html: htmlContent,
    });

    await client.close();
    
    console.log("Email sent successfully via IONOS SMTP");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-inquiry-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
