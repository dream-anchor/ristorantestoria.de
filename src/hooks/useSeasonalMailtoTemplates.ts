import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SeasonalMailtoTemplate {
  seasonal_event: string;
  subject: string;
  body: string;
  updated_at: string | null;
}

/** Alle manuellen Mailto-Vorlagen, indiziert nach Event-Key. */
export const useSeasonalMailtoTemplates = () => {
  return useQuery({
    queryKey: ["seasonal-mailto-templates"],
    queryFn: async (): Promise<Record<string, SeasonalMailtoTemplate>> => {
      const { data, error } = await supabase.from("seasonal_mailto_templates").select("*");
      if (error) throw error;
      const byEvent: Record<string, SeasonalMailtoTemplate> = {};
      for (const row of (data || []) as SeasonalMailtoTemplate[]) {
        byEvent[row.seasonal_event] = row;
      }
      return byEvent;
    },
    staleTime: 30 * 1000,
  });
};

export const useSaveSeasonalMailtoTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: { seasonal_event: string; subject: string; body: string }) => {
      const { error } = await supabase
        .from("seasonal_mailto_templates")
        .upsert({ ...template, updated_at: new Date().toISOString() }, { onConflict: "seasonal_event" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonal-mailto-templates"] });
    },
  });
};

/** Markiert ausgewählte Vormerkungen als benachrichtigt — gleiches Feld wie der KI-Versand,
 *  damit beide Versandwege denselben "bereits kontaktiert"-Status teilen. */
export const useMarkSignupsNotified = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("seasonal_signups")
        .update({ notified_at: new Date().toISOString() })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonal-signups"] });
      queryClient.invalidateQueries({ queryKey: ["seasonal-signup-counts"] });
    },
  });
};
