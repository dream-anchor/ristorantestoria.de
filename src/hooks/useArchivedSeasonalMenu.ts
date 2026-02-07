import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEASONAL_MENUS } from "@/config/seasonalMenus";

/**
 * Fetches the most recent archived menu for a seasonal event.
 * An archived menu has archive_year set and matches one of the
 * seasonal slugs for the given event key.
 */
export const useArchivedSeasonalMenu = (seasonalEventKey: string | undefined) => {
  return useQuery({
    queryKey: ['archived-seasonal-menu', seasonalEventKey],
    queryFn: async () => {
      if (!seasonalEventKey) return null;

      const config = SEASONAL_MENUS.find(m => m.key === seasonalEventKey);
      if (!config) return null;

      const slugVariants = Object.values(config.slugs);

      // Query for the most recently archived menu matching any slug variant
      const orFilter = slugVariants
        .map(s => `slug.eq.${s},slug_en.eq.${s},slug_it.eq.${s},slug_fr.eq.${s}`)
        .join(',');

      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('menu_type', 'special')
        .not('archive_year', 'is', null)
        .or(orFilter)
        .order('archive_year', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!seasonalEventKey,
    staleTime: 10 * 60 * 1000,
  });
};
