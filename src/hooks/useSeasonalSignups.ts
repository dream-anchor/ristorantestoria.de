import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SeasonalSignup {
  id: string;
  email: string;
  seasonal_event: string;
  language: string;
  created_at: string;
  notified_at: string | null;
}

export const useSeasonalSignups = (eventFilter?: string) => {
  return useQuery({
    queryKey: ['seasonal-signups', eventFilter],
    queryFn: async (): Promise<SeasonalSignup[]> => {
      let query = supabase
        .from('seasonal_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventFilter) {
        query = query.eq('seasonal_event', eventFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as SeasonalSignup[];
    },
    staleTime: 30 * 1000,
  });
};

export const useSeasonalSignupCounts = () => {
  return useQuery({
    queryKey: ['seasonal-signup-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasonal_signups')
        .select('seasonal_event, language');

      if (error) throw error;

      const counts: Record<string, { total: number; byLang: Record<string, number> }> = {};
      for (const row of (data || []) as Array<{ seasonal_event: string; language: string }>) {
        if (!counts[row.seasonal_event]) {
          counts[row.seasonal_event] = { total: 0, byLang: {} };
        }
        counts[row.seasonal_event].total++;
        counts[row.seasonal_event].byLang[row.language] =
          (counts[row.seasonal_event].byLang[row.language] || 0) + 1;
      }
      return counts;
    },
    staleTime: 60 * 1000,
  });
};

export const useMarkAllNotified = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (seasonalEvent: string) => {
      const { error } = await supabase
        .from('seasonal_signups')
        .update({ notified_at: new Date().toISOString() })
        .eq('seasonal_event', seasonalEvent)
        .is('notified_at', null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-signups'] });
      queryClient.invalidateQueries({ queryKey: ['seasonal-signup-counts'] });
    },
  });
};
