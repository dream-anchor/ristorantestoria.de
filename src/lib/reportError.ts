import { supabase } from "@/integrations/supabase/client";

export interface ReportErrorInput {
  source: string;
  severity?: "warning" | "error" | "critical";
  message: string;
  payload?: Record<string, unknown>;
}

export async function reportError(input: ReportErrorInput): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("report-error", {
      body: {
        source: input.source,
        severity: input.severity ?? "error",
        message: input.message,
        payload: input.payload ?? null,
        url: typeof window !== "undefined" ? window.location.href : null,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      },
    });
    if (error) console.warn("[reportError] function error", error);
  } catch (err) {
    console.warn("[reportError] failed", err);
  }
}