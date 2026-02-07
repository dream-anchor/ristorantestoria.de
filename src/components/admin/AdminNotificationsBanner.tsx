import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUnreadNotifications, useMarkNotificationRead } from "@/hooks/useAdminNotifications";

const AdminNotificationsBanner = () => {
  const { data: notifications } = useUnreadNotifications();
  const markRead = useMarkNotificationRead();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            notification.type === 'slug_conflict'
              ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800'
              : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
          }`}
        >
          <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
            notification.type === 'slug_conflict'
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-blue-600 dark:text-blue-400'
          }`} />
          <div className="flex-grow">
            <p className="text-sm font-medium">
              {notification.type === 'slug_conflict' ? 'Slug-Konflikt' : 'Benachrichtigung'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(notification.created_at).toLocaleString('de-DE')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
            onClick={() => markRead.mutate(notification.id)}
            disabled={markRead.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AdminNotificationsBanner;
