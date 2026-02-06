/**
 * SEO Briefing Card Component
 * Displays daily SEO briefing with executive summary and highlights
 */
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { SEOBriefing } from "@/hooks/useSEOOps";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface SEOBriefingCardProps {
  briefing: SEOBriefing | null | undefined;
  isLoading?: boolean;
  onViewFull?: () => void;
}

function MetricHighlight({
  label,
  value,
  change,
  format: formatType = "number",
}: {
  label: string;
  value: number;
  change?: number;
  format?: "number" | "position";
}) {
  const isPositive = formatType === "position" ? (change || 0) < 0 : (change || 0) > 0;
  const isNegative = formatType === "position" ? (change || 0) > 0 : (change || 0) < 0;

  const formattedValue =
    formatType === "position"
      ? value.toFixed(1)
      : value >= 1000
      ? `${(value / 1000).toFixed(1)}k`
      : value.toString();

  return (
    <div className="text-center">
      <div className="text-2xl font-semibold tracking-tight">{formattedValue}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      {change !== undefined && change !== 0 && (
        <div
          className={cn(
            "flex items-center justify-center gap-0.5 text-xs mt-1",
            isPositive && "text-green-600 dark:text-green-400",
            isNegative && "text-red-600 dark:text-red-400",
            !isPositive && !isNegative && "text-muted-foreground"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : isNegative ? (
            <ArrowDownRight className="h-3 w-3" />
          ) : null}
          <span>{Math.abs(change).toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}

export default function SEOBriefingCard({
  briefing,
  isLoading,
  onViewFull,
}: SEOBriefingCardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-2xl p-6",
          "bg-white/60 dark:bg-gray-900/60",
          "backdrop-blur-xl backdrop-saturate-150",
          "border border-white/20 dark:border-gray-700/30",
          "shadow-lg shadow-black/5"
        )}
      >
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!briefing) {
    return (
      <div
        className={cn(
          "rounded-2xl p-6",
          "bg-white/60 dark:bg-gray-900/60",
          "backdrop-blur-xl backdrop-saturate-150",
          "border border-white/20 dark:border-gray-700/30",
          "shadow-lg shadow-black/5"
        )}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-3 mb-3">
            <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="font-medium">Kein Briefing verfügbar</p>
          <p className="text-sm text-muted-foreground mt-1">
            Starten Sie die SEO-Pipeline, um ein Briefing zu generieren
          </p>
        </div>
      </div>
    );
  }

  // Safely parse the briefing date
  const briefingDate = (() => {
    try {
      if (!briefing.date) return null;
      const date = new Date(briefing.date);
      if (isNaN(date.getTime())) return null;
      return date;
    } catch {
      return null;
    }
  })();

  const formattedDate = briefingDate
    ? format(briefingDate, "EEEE, d. MMMM yyyy", { locale: de })
    : "-";

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10",
        "dark:from-indigo-500/20 dark:via-purple-500/10 dark:to-pink-500/20",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/20 dark:border-gray-700/30",
        "shadow-lg shadow-black/5"
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 dark:border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/80 dark:bg-gray-800/80 p-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold">SEO Briefing</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </div>
            </div>
          </div>
          {onViewFull && (
            <Button variant="ghost" size="sm" onClick={onViewFull}>
              Vollständig
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="px-6 py-4 bg-white/40 dark:bg-gray-900/40">
        <p className="text-sm leading-relaxed">{briefing.executive_summary}</p>
      </div>

      {/* Metrics Highlights */}
      <div className="px-6 py-4 border-t border-white/10 dark:border-gray-700/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricHighlight
            label="Klicks"
            value={briefing.highlights.total_clicks}
            change={briefing.highlights.clicks_change}
          />
          <MetricHighlight
            label="Impressionen"
            value={briefing.highlights.total_impressions}
            change={briefing.highlights.impressions_change}
          />
          <MetricHighlight
            label="Ø Position"
            value={briefing.highlights.avg_position}
            format="position"
          />
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              {briefing.new_alerts_count > 0 ? (
                <Badge variant="destructive" className="text-lg px-3 py-1">
                  {briefing.new_alerts_count}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  0
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1.5">Neue Alerts</div>
          </div>
        </div>
      </div>

      {/* Winners & Losers */}
      {(briefing.top_winners.length > 0 || briefing.top_losers.length > 0) && (
        <div className="px-6 py-4 border-t border-white/10 dark:border-gray-700/30 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Winners */}
          {briefing.top_winners.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Top Gewinner</span>
              </div>
              <div className="space-y-1.5">
                {briefing.top_winners.slice(0, 3).map((page, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs bg-white/50 dark:bg-gray-800/50 rounded-lg px-2 py-1.5"
                  >
                    <span className="truncate max-w-[180px] font-mono">{page.path}</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      +{page.change_pct.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Losers */}
          {briefing.top_losers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium">Top Verlierer</span>
              </div>
              <div className="space-y-1.5">
                {briefing.top_losers.slice(0, 3).map((page, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs bg-white/50 dark:bg-gray-800/50 rounded-lg px-2 py-1.5"
                  >
                    <span className="truncate max-w-[180px] font-mono">{page.path}</span>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {page.change_pct.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Critical Issues & Recommendations */}
      {(briefing.critical_issues.length > 0 || briefing.recommendations.length > 0) && (
        <div className="px-6 py-4 border-t border-white/10 dark:border-gray-700/30">
          {briefing.critical_issues.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Kritische Probleme
                </span>
              </div>
              <ul className="space-y-1">
                {briefing.critical_issues.map((issue, i) => (
                  <li key={i} className="text-xs text-red-600/80 dark:text-red-400/80 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{issue.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {briefing.recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">Empfehlungen</span>
              </div>
              <ul className="space-y-1">
                {briefing.recommendations.slice(0, 3).map((rec, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
