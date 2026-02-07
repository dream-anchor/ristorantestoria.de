import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  menu_id: string | null;
  is_read: boolean;
  created_at: string;
}

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ['admin-notifications-unread'],
    queryFn: async (): Promise<AdminNotification[]> => {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as AdminNotification[];
    },
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread'] });
    },
  });
};
