import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryData {
  inquiry_id?: string;
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

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendEmailWithRetry(
  smtpUser: string,
  smtpPassword: string,
  inquiry: InquiryData,
  eventLabel: string,
  htmlContent: string
): Promise<{ success: boolean; error?: string; attempts: number }> {
  let lastError: string | undefined;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`SMTP attempt ${attempt}/${MAX_RETRIES}`);
      
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

      await client.send({
        from: smtpUser,
        to: "info@ristorantestoria.de",
        subject: `Neue Event-Anfrage: ${inquiry.company_name} - ${eventLabel}`,
        content: "auto",
        html: htmlContent,
      });

      await client.close();
      
      console.log(`Email sent successfully on attempt ${attempt}`);
      return { success: true, attempts: attempt };
    } catch (error: any) {
      lastError = error.message || String(error);
      console.error(`SMTP attempt ${attempt} failed:`, lastError);
      
      if (attempt < MAX_RETRIES) {
        console.log(`Waiting ${RETRY_DELAY_MS}ms before retry...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  
  return { success: false, error: lastError, attempts: MAX_RETRIES };
}

async function updateInquiryStatus(
  supabase: any,
  inquiryId: string,
  success: boolean,
  attempts: number,
  error?: string
): Promise<void> {
  try {
    const { error: updateError } = await supabase
      .from('event_inquiries')
      .update({
        notification_sent: success,
        notification_attempts: attempts,
        notification_error: error || null,
      })
      .eq('id', inquiryId);
    
    if (updateError) {
      console.error('Failed to update inquiry status:', updateError);
    } else {
      console.log(`Updated inquiry ${inquiryId}: sent=${success}, attempts=${attempts}`);
    }
  } catch (e) {
    console.error('Error updating inquiry status:', e);
  }
}

serve(async (req: Request): Promise<Response> => {
  console.log("Received request to send-inquiry-notification");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!smtpUser || !smtpPassword) {
      throw new Error("SMTP credentials nicht konfiguriert");
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials nicht konfiguriert");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const inquiry: InquiryData = await req.json();
    
    console.log("Processing inquiry for:", inquiry.company_name);
    console.log("Inquiry ID:", inquiry.inquiry_id);

    const eventLabel = eventTypeLabels[inquiry.event_type] || inquiry.event_type;

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

    // Send email with retry logic
    const result = await sendEmailWithRetry(smtpUser, smtpPassword, inquiry, eventLabel, htmlContent);
    
    // Update inquiry status in database if we have an inquiry_id
    if (inquiry.inquiry_id) {
      await updateInquiryStatus(supabase, inquiry.inquiry_id, result.success, result.attempts, result.error);
    }

    if (result.success) {
      console.log("Email sent successfully via IONOS SMTP");
      return new Response(JSON.stringify({ success: true, attempts: result.attempts }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      console.error("All SMTP attempts failed:", result.error);
      return new Response(
        JSON.stringify({ success: false, error: result.error, attempts: result.attempts }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
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
