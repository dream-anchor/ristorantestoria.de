import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GroupMenu {
  id: string;
  menu_key: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  badge: Record<string, string> | null;
  items: Record<string, string[]>;
  duration: Record<string, string>;
  price_label: Record<string, string>;
  price_note: Record<string, string>;
  price_amount: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupMenuSetting {
  id: string;
  setting_key: string;
  setting_value: unknown;
  updated_at: string;
}

/** Extract a localized string from a JSONB field, falling back to "de" or first available. */
export function getLocalizedText(
  jsonb: Record<string, string> | null | undefined,
  language: string
): string {
  if (!jsonb) return "";
  return jsonb[language] ?? jsonb["de"] ?? Object.values(jsonb)[0] ?? "";
}

/** Extract a localized string array from a JSONB field. */
export function getLocalizedArray(
  jsonb: Record<string, string[]> | null | undefined,
  language: string
): string[] {
  if (!jsonb) return [];
  return jsonb[language] ?? jsonb["de"] ?? Object.values(jsonb)[0] ?? [];
}

// ── Public hook: active menus for /reisegruppen/ page ───────────────────────

export const useGroupMenus = () => {
  const menusQuery = useQuery({
    queryKey: ["group-menus"],
    queryFn: async (): Promise<GroupMenu[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("group_menus")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as GroupMenu[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const settingsQuery = useQuery({
    queryKey: ["group-menu-settings"],
    queryFn: async (): Promise<GroupMenuSetting[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("group_menu_settings")
        .select("*");
      if (error) throw error;
      return (data ?? []) as unknown as GroupMenuSetting[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const settings = Object.fromEntries(
    (settingsQuery.data ?? []).map((s) => [s.setting_key, s.setting_value])
  );

  return {
    menus: menusQuery.data ?? [],
    settings,
    isLoading: menusQuery.isLoading || settingsQuery.isLoading,
    error: menusQuery.error || settingsQuery.error,
  };
};

// ── Admin hooks: all menus including inactive ────────────────────────────────

export const useAllGroupMenus = () => {
  return useQuery({
    queryKey: ["group-menus-all"],
    queryFn: async (): Promise<GroupMenu[]> => {
      const { data, error } = await supabase
        .from("group_menus")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as GroupMenu[];
    },
    staleTime: 30 * 1000,
  });
};

export const useAllGroupMenuSettings = () => {
  return useQuery({
    queryKey: ["group-menu-settings-all"],
    queryFn: async (): Promise<GroupMenuSetting[]> => {
      const { data, error } = await supabase
        .from("group_menu_settings")
        .select("*")
        .order("setting_key", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as GroupMenuSetting[];
    },
    staleTime: 30 * 1000,
  });
};

export const useUpsertGroupMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (menu: Partial<GroupMenu> & { id?: string }) => {
      const { id, ...payload } = menu;
      if (id) {
        const { error } = await supabase
          .from("group_menus")
          .update(payload as unknown as Record<string, unknown>)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("group_menus")
          .insert(payload as unknown as Record<string, unknown>);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-menus"] });
      queryClient.invalidateQueries({ queryKey: ["group-menus-all"] });
    },
  });
};

export const useDeleteGroupMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("group_menus")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-menus"] });
      queryClient.invalidateQueries({ queryKey: ["group-menus-all"] });
    },
  });
};

export const useUpsertGroupMenuSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      const { error } = await supabase
        .from("group_menu_settings")
        .upsert(
          { setting_key: key, setting_value: value } as unknown as Record<string, unknown>,
          { onConflict: "setting_key" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-menu-settings"] });
      queryClient.invalidateQueries({ queryKey: ["group-menu-settings-all"] });
    },
  });
};
