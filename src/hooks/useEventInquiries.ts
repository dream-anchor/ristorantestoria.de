import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EventInquiry {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  guest_count: string;
  event_type: string;
  preferred_date: string | null;
  message: string | null;
  created_at: string;
}

export const useEventInquiries = () => {
  return useQuery({
    queryKey: ['event-inquiries'],
    queryFn: async (): Promise<EventInquiry[]> => {
      const { data, error } = await supabase
        .from('event_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useDeleteEventInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('event_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-inquiries'] });
    },
  });
};
