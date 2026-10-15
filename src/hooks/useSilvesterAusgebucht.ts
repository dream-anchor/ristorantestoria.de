import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FACTS } from "@/config/facts";

/**
 * Schalter „Silvester ausgebucht“ (Admin → Vormerkungen → Silvester).
 * Liegt als Zeile `silvester_ausgebucht` in `group_menu_settings` (anon liest, nur Admins schreiben).
 * prerender.js lädt denselben Wert vor und legt ihn unter SILVESTER_AUSGEBUCHT_KEY in den
 * Query-Cache, damit statisches HTML und Hydration übereinstimmen.
 * Fallback ohne DB-Zeile/Verbindung: FACTS.silvester.ausgebucht.
 */
export const SILVESTER_AUSGEBUCHT_KEY = ["silvester-ausgebucht"] as const;
const SETTING_KEY = "silvester_ausgebucht";

export const useSilvesterAusgebucht = (): boolean => {
  const { data } = useQuery({
    queryKey: SILVESTER_AUSGEBUCHT_KEY,
    queryFn: async (): Promise<boolean | null> => {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from("group_menu_settings")
        .select("setting_value")
        .eq("setting_key", SETTING_KEY)
        .maybeSingle();
      if (error) throw error;
      return data ? data.setting_value === true : null;
    },
  });
  return data ?? FACTS.silvester.ausgebucht;
};

export const useSetSilvesterAusgebucht = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value: boolean) => {
      const { error } = await supabase
        .from("group_menu_settings")
        .upsert({ setting_key: SETTING_KEY, setting_value: value }, { onConflict: "setting_key" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: SILVESTER_AUSGEBUCHT_KEY }),
  });
};
