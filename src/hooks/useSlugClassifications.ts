import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SlugClassification {
  id: string;
  menu_id: string | null;
  original_title: string;
  classified_as: string | null;
  slugs_updated: boolean;
  conflict: boolean;
  created_at: string;
}

export const useSlugClassifications = () => {
  return useQuery({
    queryKey: ['slug-classifications'],
    queryFn: async (): Promise<SlugClassification[]> => {
      const { data, error } = await supabase
        .from('slug_classifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []) as SlugClassification[];
    },
    staleTime: 30 * 1000,
  });
};
