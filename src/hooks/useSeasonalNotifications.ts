import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SeasonalNotification {
  id: string;
  seasonal_event: string;
  menu_id: string | null;
  trigger_type: string;
  status: string;
  total_recipients: number;
  sent_at: string | null;
  subjects: Record<string, string> | null;
  created_at: string;
}

export interface SeasonalNotificationRecipient {
  id: string;
  notification_id: string;
  email: string;
  language: string;
  status: string;
  sent_at: string | null;
  error: string | null;
  created_at: string;
}

export interface NotifyPreviewResult {
  preview: true;
  total: number;
  counts_by_lang: Record<string, number>;
  previews: Record<string, { subject: string }>;
}

export interface NotifySendResult {
  success: boolean;
  notification_id: string;
  sent: number;
  failed: number;
  status: string;
}

export const useSeasonalNotifications = () => {
  return useQuery({
    queryKey: ["seasonal-notifications"],
    queryFn: async (): Promise<SeasonalNotification[]> => {
      const { data, error } = await supabase
        .from("seasonal_notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as SeasonalNotification[];
    },
    staleTime: 30 * 1000,
  });
};

export const useSeasonalNotificationRecipients = (notificationId: string | null) => {
  return useQuery({
    queryKey: ["seasonal-notification-recipients", notificationId],
    queryFn: async (): Promise<SeasonalNotificationRecipient[]> => {
      if (!notificationId) return [];
      const { data, error } = await supabase
        .from("seasonal_notification_recipients")
        .select("*")
        .eq("notification_id", notificationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as SeasonalNotificationRecipient[];
    },
    enabled: !!notificationId,
    staleTime: 30 * 1000,
  });
};

export const useNotifySeasonalSignups = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      seasonal_event: string;
      menu_id?: string;
      trigger_type?: string;
      preview?: boolean;
    }): Promise<NotifyPreviewResult | NotifySendResult> => {
      const { data, error } = await supabase.functions.invoke("notify-seasonal-signups", {
        body: params,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      if (!variables.preview) {
        queryClient.invalidateQueries({ queryKey: ["seasonal-notifications"] });
        queryClient.invalidateQueries({ queryKey: ["seasonal-signups"] });
        queryClient.invalidateQueries({ queryKey: ["seasonal-signup-counts"] });
      }
    },
  });
};
