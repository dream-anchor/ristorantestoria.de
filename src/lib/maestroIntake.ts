/**
 * STORIA Lead-Cutover: schlanker, typisierter Client für den öffentlichen MAESTRO-2.0-Intake.
 *
 * Alle aktiven Website-Leads (ristorantestoria.de) gehen ausschließlich hierüber nach MAESTRO 2.0
 * (Tenant `storia` wird SERVERSEITIG aus dem Ziel-Host aufgelöst — der Browser sendet NIE eine
 * tenant_id). Erfolg gilt NUR bei konkreter Inquiry-ID; jeder 4xx/5xx oder eine Antwort ohne ID
 * wirft (kein Silent-Fallback auf Supabase v1, keine falsche Erfolgsmeldung).
 */
export const MAESTRO_INTAKE_URL = "https://storia.schrittmacher.ai/api/public/inquiries";

export interface MaestroInquiryInput {
  customerName: string;
  customerEmail?: string;
  company?: string;
  phone?: string;
  guests?: number;
  eventType?: string;
  eventDate?: string; // ISO datetime
  eventTime?: string;
  message?: string;
  language?: "de" | "en";
  packageId?: string;
  packageName?: string;
  /** Konkreter Eingang, z. B. ristorante_filmfest (server-validiert: [A-Za-z0-9_-]). */
  sourceDetail: string;
  details?: Record<string, unknown>;
  /** Opake Upload-Ids + Claim-Token aus POST /api/public/inquiries/upload (optional). */
  attachments?: Array<{ uploadId: string; claimToken: string }>;
}

export interface MaestroInquiryResult {
  id: string;
  deduped?: boolean;
}

function clean(input: MaestroInquiryInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

export async function submitMaestroInquiry(input: MaestroInquiryInput): Promise<MaestroInquiryResult> {
  let res: Response;
  try {
    res = await fetch(MAESTRO_INTAKE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clean(input)),
    });
  } catch (e) {
    throw new Error(`intake_network_error: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (!res.ok) {
    let detail = "";
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      /* ignore */
    }
    throw new Error(`intake_failed_${res.status}${detail ? `: ${detail}` : ""}`);
  }
  let body: { data?: { id?: string; deduped?: boolean } } | null = null;
  try {
    body = (await res.json()) as { data?: { id?: string; deduped?: boolean } };
  } catch {
    throw new Error("intake_bad_response");
  }
  const id = body?.data?.id;
  if (!id) throw new Error("intake_no_id"); // KEIN Erfolg ohne konkrete Inquiry-ID
  return { id, deduped: body.data?.deduped };
}

/**
 * Optionaler Anhang-Upload (z. B. Reiseplan-PDF): staged nach R2, liefert {uploadId, claimToken}
 * für den anschliessenden Inquiry-Submit. Wirft bei Fehler; der Aufrufer entscheidet, ob der Anhang
 * zwingend ist (bei Reisegruppen: NICHT — die Anfrage geht auch ohne durch).
 */
export const MAESTRO_UPLOAD_URL = "https://storia.schrittmacher.ai/api/public/inquiries/upload";
export async function uploadMaestroAttachment(file: File): Promise<{ uploadId: string; claimToken: string }> {
  const buf = await file.arrayBuffer();
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const dataBase64 = btoa(bin);
  const res = await fetch(MAESTRO_UPLOAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mediaType: file.type, dataBase64 }),
  });
  if (!res.ok) throw new Error(`upload_failed_${res.status}`);
  const body = (await res.json()) as { data?: { uploadId?: string; claimToken?: string } };
  const uploadId = body?.data?.uploadId;
  const claimToken = body?.data?.claimToken;
  if (!uploadId || !claimToken) throw new Error("upload_no_id");
  return { uploadId, claimToken };
}

export function collectIntakeDetails(extra?: Record<string, unknown>): Record<string, unknown> {
  const details: Record<string, unknown> = { ...(extra ?? {}) };
  try {
    if (typeof window !== "undefined") {
      details.originalPage = (window.location.pathname + window.location.search).slice(0, 500);
      if (document.referrer) details.referrer = document.referrer.slice(0, 500);
      const p = new URLSearchParams(window.location.search);
      const utm: Array<[string, string]> = [
        ["utmSource", "utm_source"], ["utmMedium", "utm_medium"], ["utmCampaign", "utm_campaign"],
        ["utmTerm", "utm_term"], ["utmContent", "utm_content"],
      ];
      for (const [key, param] of utm) {
        const val = p.get(param);
        if (val) details[key] = val.slice(0, 200);
      }
    }
  } catch {
    /* Kontext ist optional */
  }
  return details;
}
