/**
 * SEO Alerts Panel Component
 * Displays and manages SEO alerts with filtering and status updates
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Check,
  X,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Filter,
  Clock,
  Target,
  Zap,
} from "lucide-react";
import type { SEOAlertEvent } from "@/hooks/useSEOOps";
import { formatDistanceToNow, format } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "sonner";

interface SEOAlertsPanelProps {
  alerts: SEOAlertEvent[];
  isLoading?: boolean;
  onUpdateStatus?: (alertId: string, status: SEOAlertEvent["status"], notes?: string) => void;
  onViewPrompts?: (alertId: string) => void;
  compact?: boolean;
  showFilters?: boolean;
}

const getSeverityConfig = (severity: SEOAlertEvent["severity"]) => {
  switch (severity) {
    case "critical":
      return {
        icon: AlertCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-900",
        badge: "destructive" as const,
        label: "Kritisch",
      };
    case "high":
      return {
        icon: AlertTriangle,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-950/30",
        border: "border-orange-200 dark:border-orange-900",
        badge: "destructive" as const,
        label: "Hoch",
      };
    case "medium":
      return {
        icon: AlertTriangle,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-900",
        badge: "secondary" as const,
        label: "Mittel",
      };
    default:
      return {
        icon: Info,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-200 dark:border-blue-900",
        badge: "outline" as const,
        label: "Niedrig",
      };
  }
};

const getStatusConfig = (status: SEOAlertEvent["status"]) => {
  switch (status) {
    case "resolved":
      return { label: "Gelöst", color: "text-green-600 dark:text-green-400" };
    case "acknowledged":
      return { label: "Bestätigt", color: "text-blue-600 dark:text-blue-400" };
    case "false_positive":
      return { label: "Fehlalarm", color: "text-gray-600 dark:text-gray-400" };
    default:
      return { label: "Offen", color: "text-amber-600 dark:text-amber-400" };
  }
};

const getScopeLabel = (scope: SEOAlertEvent["scope"]) => {
  const labels: Record<string, string> = {
    site: "Gesamtseite",
    page: "Seite",
    query: "Suchanfrage",
    canonical_group: "Canonical-Gruppe",
    device: "Gerät",
    country: "Land",
    appearance: "Erscheinungsbild",
  };
  return labels[scope] || scope;
};

const getWindowLabel = (window: SEOAlertEvent["window"]) => {
  const labels: Record<string, string> = {
    daily: "Täglich",
    wow: "Woche/Woche",
    mom: "Monat/Monat",
  };
  return labels[window] || window;
};

function AlertCard({
  alert,
  onUpdateStatus,
  onViewPrompts,
  compact = false,
}: {
  alert: SEOAlertEvent;
  onUpdateStatus?: (alertId: string, status: SEOAlertEvent["status"], notes?: string) => void;
  onViewPrompts?: (alertId: string) => void;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = getSeverityConfig(alert.severity);
  const statusConfig = getStatusConfig(alert.status);
  const Icon = config.icon;

  const timeAgo = formatDistanceToNow(new Date(alert.date_detected), {
    addSuffix: true,
    locale: de,
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kopiert");
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
          config.bg,
          config.border,
          "hover:opacity-90 transition-opacity"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <Icon className={cn("h-4 w-4 flex-shrink-0", config.color)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{alert.title}</p>
          <p className="text-xs text-muted-foreground truncate">{alert.entity_label || alert.entity_key}</p>
        </div>
        <Badge variant={config.badge} className="text-xs">
          {config.label}
        </Badge>
        <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-90")} />
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border overflow-hidden", config.border)}>
      {/* Header */}
      <div
        className={cn("px-4 py-3 flex items-start gap-3 cursor-pointer", config.bg)}
        onClick={() => setExpanded(!expanded)}
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium">{alert.title}</h4>
            <Badge variant={config.badge} className="text-xs">
              {config.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getScopeLabel(alert.scope)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{alert.summary}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-medium", statusConfig.color)}>{statusConfig.label}</span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")}
          />
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <>
          {/* Entity Info */}
          <div className="px-4 py-3 bg-background/50 border-t border-inherit space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Betrifft:</span>
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded truncate max-w-[400px]">
                {alert.entity_label || alert.entity_key}
              </code>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(alert.entity_key)}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Erkannt:</span>
                <span>{timeAgo}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Fenster:</span>
                <span>{getWindowLabel(alert.window)}</span>
              </div>
            </div>

            {/* Metrics */}
            {alert.change_pct !== null && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Änderung:</span>
                  <span className={alert.change_pct < 0 ? "text-red-600" : "text-green-600"}>
                    {alert.change_pct > 0 ? "+" : ""}
                    {alert.change_pct.toFixed(1)}%
                  </span>
                </div>
                {alert.baseline_value !== null && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Baseline:</span>
                    <span>{alert.baseline_value.toFixed(1)}</span>
                  </div>
                )}
                {alert.current_value !== null && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Aktuell:</span>
                    <span>{alert.current_value.toFixed(1)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Affected Pages/Queries */}
          {(alert.affected_pages.length > 0 || alert.affected_queries.length > 0) && (
            <div className="px-4 py-3 bg-muted/20 border-t border-inherit">
              {alert.affected_pages.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Betroffene Seiten:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alert.affected_pages.slice(0, 5).map((page, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-mono">
                        {page}
                      </Badge>
                    ))}
                    {alert.affected_pages.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{alert.affected_pages.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              {alert.affected_queries.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Betroffene Queries:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alert.affected_queries.slice(0, 5).map((query, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        "{query}"
                      </Badge>
                    ))}
                    {alert.affected_queries.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{alert.affected_queries.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommended Actions */}
          {alert.recommended_actions.length > 0 && (
            <div className="px-4 py-3 bg-blue-50/50 dark:bg-blue-950/20 border-t border-inherit">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Empfohlene Aktionen:</span>
              <ul className="mt-1 space-y-1">
                {alert.recommended_actions.map((action, i) => (
                  <li key={i} className="text-xs text-blue-600/80 dark:text-blue-400/80 flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="px-4 py-3 bg-muted/30 border-t border-inherit flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {alert.rule && (
                <span className="text-xs text-muted-foreground">
                  Regel: {alert.rule.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onViewPrompts && (
                <Button variant="outline" size="sm" onClick={() => onViewPrompts(alert.id)}>
                  Prompts
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              )}
              {onUpdateStatus && alert.status === "open" && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdateStatus(alert.id, "false_positive")}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Fehlalarm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateStatus(alert.id, "acknowledged")}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Bestätigen
                  </Button>
                </>
              )}
              {onUpdateStatus && alert.status === "acknowledged" && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onUpdateStatus(alert.id, "resolved")}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Als gelöst markieren
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function SEOAlertsPanel({
  alerts,
  isLoading,
  onUpdateStatus,
  onViewPrompts,
  compact = false,
  showFilters = false,
}: SEOAlertsPanelProps) {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("open");

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
    if (scopeFilter !== "all" && alert.scope !== scopeFilter) return false;
    if (statusFilter !== "all" && alert.status !== statusFilter) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="open">Offen</SelectItem>
              <SelectItem value="acknowledged">Bestätigt</SelectItem>
              <SelectItem value="resolved">Gelöst</SelectItem>
              <SelectItem value="false_positive">Fehlalarm</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Level</SelectItem>
              <SelectItem value="critical">Kritisch</SelectItem>
              <SelectItem value="high">Hoch</SelectItem>
              <SelectItem value="medium">Mittel</SelectItem>
              <SelectItem value="low">Niedrig</SelectItem>
            </SelectContent>
          </Select>
          <Select value={scopeFilter} onValueChange={setScopeFilter}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Bereiche</SelectItem>
              <SelectItem value="site">Gesamtseite</SelectItem>
              <SelectItem value="page">Seiten</SelectItem>
              <SelectItem value="query">Queries</SelectItem>
              <SelectItem value="canonical_group">Canonical</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">
            {filteredAlerts.length} von {alerts.length}
          </span>
        </div>
      )}

      {filteredAlerts.length === 0 ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-8 text-center",
            "rounded-xl border-2 border-dashed border-green-200 dark:border-green-900",
            "bg-green-50/50 dark:bg-green-950/20"
          )}
        >
          <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-3 mb-3">
            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="font-medium text-green-700 dark:text-green-300">
            Keine Alerts gefunden
          </p>
          <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-1">
            {statusFilter === "open"
              ? "Alle offenen Alerts wurden bearbeitet"
              : "Keine Alerts entsprechen den Filterkriterien"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onUpdateStatus={onUpdateStatus}
              onViewPrompts={onViewPrompts}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}
