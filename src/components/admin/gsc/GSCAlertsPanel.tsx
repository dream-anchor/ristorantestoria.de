/**
 * GSC Alerts Panel Component
 * Displays SEO alerts with severity indicators and actions
 */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Check,
  ExternalLink,
  Copy,
  ChevronRight,
} from "lucide-react";
import type { GSCAlert } from "@/hooks/useGSCMetrics";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "sonner";

interface GSCAlertsProps {
  alerts: GSCAlert[];
  isLoading?: boolean;
  onAcknowledge?: (alertId: string) => void;
  onViewDetails?: (alert: GSCAlert) => void;
  compact?: boolean;
}

const getSeverityConfig = (severity: 'info' | 'warning' | 'critical') => {
  switch (severity) {
    case 'critical':
      return {
        icon: AlertCircle,
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-900',
        badge: 'destructive' as const,
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-900',
        badge: 'secondary' as const,
      };
    default:
      return {
        icon: Info,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-900',
        badge: 'outline' as const,
      };
  }
};

const getAlertTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    duplicate_url: 'Duplicate URL',
    legacy_cms: 'Legacy CMS',
    cannibalization: 'Kannibalisierung',
    performance_drop: 'Traffic-Rückgang',
    position_drop: 'Ranking-Verlust',
  };
  return labels[type] || type;
};

export default function GSCAlertsPanel({
  alerts,
  isLoading,
  onAcknowledge,
  onViewDetails,
  compact = false,
}: GSCAlertsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center py-8 text-center",
        "rounded-xl border-2 border-dashed border-green-200 dark:border-green-900",
        "bg-green-50/50 dark:bg-green-950/20"
      )}>
        <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-3 mb-3">
          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <p className="font-medium text-green-700 dark:text-green-300">
          Keine aktiven Alerts
        </p>
        <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-1">
          Alle SEO-Metriken sehen gut aus
        </p>
      </div>
    );
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL kopiert');
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const config = getSeverityConfig(alert.severity);
        const Icon = config.icon;
        const timeAgo = formatDistanceToNow(new Date(alert.created_at), {
          addSuffix: true,
          locale: de,
        });

        if (compact) {
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                config.bg,
                config.border,
                "cursor-pointer hover:opacity-90 transition-opacity"
              )}
              onClick={() => onViewDetails?.(alert)}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", config.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{alert.title}</p>
              </div>
              <Badge variant={config.badge} className="text-xs">
                {getAlertTypeLabel(alert.alert_type)}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          );
        }

        return (
          <div
            key={alert.id}
            className={cn(
              "rounded-xl border overflow-hidden",
              config.border
            )}
          >
            {/* Header */}
            <div className={cn("px-4 py-3 flex items-start gap-3", config.bg)}>
              <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium">{alert.title}</h4>
                  <Badge variant={config.badge} className="text-xs">
                    {getAlertTypeLabel(alert.alert_type)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {alert.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {timeAgo}
              </span>
            </div>

            {/* Details */}
            {(alert.affected_url || alert.affected_query) && (
              <div className="px-4 py-2 bg-background/50 border-t border-inherit">
                {alert.affected_url && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">URL:</span>
                    <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded truncate max-w-[300px]">
                      {alert.affected_url}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopyUrl(alert.affected_url!)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <a
                      href={alert.affected_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {alert.affected_query && (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-muted-foreground">Query:</span>
                    <span className="font-medium">"{alert.affected_query}"</span>
                  </div>
                )}
                {alert.metric_value !== null && alert.threshold_value !== null && (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-muted-foreground">Wert:</span>
                    <span className={config.color}>{alert.metric_value.toFixed(1)}%</span>
                    <span className="text-muted-foreground">
                      (Schwelle: {alert.threshold_value}%)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="px-4 py-2 bg-muted/30 border-t border-inherit flex items-center justify-end gap-2">
              {onViewDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(alert)}
                >
                  Details
                </Button>
              )}
              {onAcknowledge && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAcknowledge(alert.id)}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Bestätigen
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
