/**
 * SEO Crawler Panel Component
 * Displays crawl results, run history, and triggers crawls
 * Apple 2026 Glassmorphism design matching SEOAlertsPanel/SEOTasksPanel
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Play,
  Zap,
  Clock,
  AlertTriangle,
  Check,
  X,
  Minus,
  ChevronDown,
  ChevronRight,
  Loader2,
  ExternalLink,
  Activity,
  Timer,
  Search,
  Shield,
} from "lucide-react";
import {
  useCrawlRuns,
  useCrawlResults,
  useCrawlerStats,
  useTriggerCrawl,
} from "@/hooks/useSEOCrawler";
import type { CrawlRun, CrawlResult, CrawlIssue } from "@/hooks/useSEOCrawler";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "sonner";

// ============================================================================
// Helpers
// ============================================================================

function formatDuration(ms: number | null): string {
  if (!ms) return "-";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return formatDistanceToNow(date, { addSuffix: true, locale: de });
  } catch {
    return "-";
  }
}

function getStatusBadge(code: number | null) {
  if (!code) return { variant: "outline" as const, label: "-", color: "" };
  if (code >= 200 && code < 300) return { variant: "default" as const, label: String(code), color: "bg-green-500" };
  if (code >= 300 && code < 400) return { variant: "secondary" as const, label: String(code), color: "bg-amber-500" };
  return { variant: "destructive" as const, label: String(code), color: "bg-red-500" };
}

function CheckIcon({ ok }: { ok: boolean | null }) {
  if (ok === null || ok === undefined) return <Minus className="h-3.5 w-3.5 text-gray-400" />;
  if (ok) return <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />;
  return <X className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />;
}

function getIssueSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900';
    case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900';
    case 'medium': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900';
    default: return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900';
  }
}

// ============================================================================
// Summary Card
// ============================================================================

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className={cn(
      "rounded-xl p-4",
      "bg-white/60 dark:bg-gray-900/60",
      "backdrop-blur-sm border border-white/20 dark:border-gray-700/30",
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("rounded-lg p-2", color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-xs text-muted-foreground">{title}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Result Row
// ============================================================================

function ResultRow({ result }: { result: CrawlResult }) {
  const [expanded, setExpanded] = useState(false);
  const hasIssues = result.issues.length > 0;
  const statusBadge = getStatusBadge(result.status_code);

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden",
      hasIssues
        ? "border-amber-200 dark:border-amber-900"
        : "border-gray-200 dark:border-gray-800",
    )}>
      <div
        className={cn(
          "px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-muted/30 transition-colors",
          hasIssues && "bg-amber-50/50 dark:bg-amber-950/10"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Path */}
        <code className="text-xs font-mono truncate flex-1 min-w-0">
          {result.normalized_path}
        </code>

        {/* Status Code */}
        <Badge variant={statusBadge.variant} className="text-xs tabular-nums">
          {statusBadge.label}
        </Badge>

        {/* Response Time */}
        <span className={cn(
          "text-xs tabular-nums w-16 text-right",
          result.response_time_ms && result.response_time_ms > 2000
            ? "text-red-600 dark:text-red-400"
            : "text-muted-foreground"
        )}>
          {result.response_time_ms ? `${result.response_time_ms}ms` : "-"}
        </span>

        {/* Check Icons */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-0.5" title="Title">
            <CheckIcon ok={result.has_title} />
          </div>
          <div className="flex items-center gap-0.5" title="H1">
            <CheckIcon ok={result.has_h1} />
          </div>
          <div className="flex items-center gap-0.5" title="Canonical">
            <CheckIcon ok={result.canonical_match} />
          </div>
          <div className="flex items-center gap-0.5" title="hreflang">
            <CheckIcon ok={result.has_hreflang} />
          </div>
        </div>

        {/* Issues Count */}
        {hasIssues ? (
          <Badge variant="destructive" className="text-xs tabular-nums">
            {result.issues.length}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400 border-green-300 dark:border-green-800">
            OK
          </Badge>
        )}

        <ChevronRight className={cn(
          "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
          expanded && "rotate-90"
        )} />
      </div>

      {expanded && (
        <div className="border-t border-inherit">
          {/* Details Grid */}
          <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-muted/20">
            <div>
              <span className="text-muted-foreground">Title:</span>
              <p className="font-medium truncate mt-0.5">{result.title_text || "-"}</p>
              {result.title_length !== null && (
                <span className={cn(
                  "text-muted-foreground",
                  result.title_length > 60 && "text-amber-600"
                )}>
                  ({result.title_length} Zeichen)
                </span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">H1 Tags:</span>
              <p className="font-medium mt-0.5">{result.h1_count ?? "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Canonical:</span>
              <p className="font-mono truncate mt-0.5">{result.canonical_url || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">hreflang:</span>
              <p className="font-medium mt-0.5">{result.hreflang_count ?? "-"} Tags</p>
            </div>
            {result.redirect_count > 0 && (
              <div>
                <span className="text-muted-foreground">Redirects:</span>
                <p className="font-medium mt-0.5">{result.redirect_count} Hops</p>
                {result.redirect_target && (
                  <p className="font-mono truncate text-muted-foreground">{result.redirect_target}</p>
                )}
              </div>
            )}
            {result.has_robots_noindex && (
              <div>
                <span className="text-red-600 dark:text-red-400 font-medium">noindex erkannt</span>
              </div>
            )}
          </div>

          {/* Issues */}
          {hasIssues && (
            <div className="px-4 py-3 border-t border-inherit space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">Issues:</span>
              {result.issues.map((issue: CrawlIssue, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "text-xs px-2.5 py-1.5 rounded border",
                    getIssueSeverityColor(issue.severity)
                  )}
                >
                  <span className="font-medium">[{issue.check}]</span> {issue.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Run History Card
// ============================================================================

function RunHistoryCard({ run }: { run: CrawlRun }) {
  const isRunning = run.status === 'running';

  return (
    <div className="flex items-center gap-3 py-2 text-sm">
      <div className={cn(
        "h-2 w-2 rounded-full flex-shrink-0",
        run.status === 'completed' && "bg-green-500",
        run.status === 'failed' && "bg-red-500",
        isRunning && "bg-amber-500 animate-pulse",
      )} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs">{run.action}</span>
          <Badge variant="outline" className="text-xs">
            {run.status === 'completed' ? 'OK' : run.status}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">{formatTimeAgo(run.started_at)}</span>
      </div>
      <div className="text-right text-xs text-muted-foreground tabular-nums">
        <div>{run.urls_crawled} URLs</div>
        <div>{formatDuration(run.duration_ms)}</div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Panel
// ============================================================================

export default function SEOCrawlerPanel() {
  const [selectedRunId, setSelectedRunId] = useState<string | undefined>();
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { data: crawlerStats, isLoading: statsLoading } = useCrawlerStats();
  const { data: runs, isLoading: runsLoading } = useCrawlRuns(5);
  const triggerCrawl = useTriggerCrawl();

  // Auto-select latest run
  const activeRunId = selectedRunId || (runs && runs.length > 0 ? runs[0].id : undefined);

  const { data: results, isLoading: resultsLoading } = useCrawlResults({
    runId: activeRunId,
    hasIssues: onlyIssues,
    limit: 200,
  });

  const lastRun = crawlerStats?.last_crawl_run;

  // Compute summary from results
  const avgResponseTime = results && results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.response_time_ms || 0), 0) / results.length)
    : 0;
  const issueCount = results
    ? results.filter(r => r.issues.length > 0).length
    : 0;

  const handleFullCrawl = async () => {
    try {
      await triggerCrawl.mutateAsync({ action: 'full_crawl' });
      toast.success("Full Crawl gestartet");
    } catch {
      toast.error("Fehler beim Starten des Crawls");
    }
  };

  const handleQuickCheck = async () => {
    try {
      await triggerCrawl.mutateAsync({ action: 'quick_check' });
      toast.success("Quick Check gestartet");
    } catch {
      toast.error("Fehler beim Starten des Quick Checks");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg p-2 bg-gradient-to-br from-cyan-500 to-blue-600">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Site Crawler</h2>
            {lastRun && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Letzter Crawl: {formatTimeAgo(lastRun.completed_at || lastRun.started_at)}
                {lastRun.duration_ms && ` (${formatDuration(lastRun.duration_ms)})`}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickCheck}
            disabled={triggerCrawl.isPending}
          >
            {triggerCrawl.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Quick Check
          </Button>
          <Button
            size="sm"
            onClick={handleFullCrawl}
            disabled={triggerCrawl.isPending}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            {triggerCrawl.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Full Crawl
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))
        ) : (
          <>
            <SummaryCard
              title="URLs geprüft"
              value={lastRun?.urls_crawled || 0}
              icon={Search}
              color="bg-blue-500"
            />
            <SummaryCard
              title="Issues gefunden"
              value={lastRun?.issues_found || 0}
              icon={AlertTriangle}
              color={lastRun?.issues_found ? "bg-amber-500" : "bg-green-500"}
            />
            <SummaryCard
              title="Ø Response"
              value={avgResponseTime ? `${avgResponseTime}ms` : "-"}
              icon={Timer}
              color="bg-purple-500"
            />
            <SummaryCard
              title="Alerts erstellt"
              value={lastRun?.alerts_created || 0}
              icon={Shield}
              color="bg-red-500"
            />
          </>
        )}
      </div>

      {/* Results Table */}
      <div className={cn(
        "rounded-2xl overflow-hidden",
        "bg-white/60 dark:bg-gray-900/60",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/20 dark:border-gray-700/30",
        "shadow-lg shadow-black/5"
      )}>
        {/* Table Header */}
        <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/30 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">Ergebnisse</h3>
            {results && (
              <span className="text-xs text-muted-foreground">
                {onlyIssues ? `${results.length} mit Issues` : `${results.length} URLs`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Issues Only Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={onlyIssues}
                onCheckedChange={setOnlyIssues}
                id="only-issues"
              />
              <label htmlFor="only-issues" className="text-xs text-muted-foreground cursor-pointer">
                Nur Probleme
              </label>
            </div>

            {/* Run Selector */}
            {runs && runs.length > 1 && (
              <Select
                value={activeRunId}
                onValueChange={(val) => setSelectedRunId(val)}
              >
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Run auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {runs.map((run) => (
                    <SelectItem key={run.id} value={run.id}>
                      {run.action} - {formatTimeAgo(run.started_at)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Table Header Row */}
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <span className="flex-1">Pfad</span>
          <span className="w-14 text-center">Status</span>
          <span className="w-16 text-right">Response</span>
          <div className="hidden md:flex items-center gap-2 w-24 justify-center">
            <span>T</span>
            <span>H1</span>
            <span>C</span>
            <span>HL</span>
          </div>
          <span className="w-10 text-center">Issues</span>
          <span className="w-4" />
        </div>

        {/* Results List */}
        <div className="p-3 space-y-1.5 max-h-[600px] overflow-y-auto">
          {resultsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))
          ) : !results || results.length === 0 ? (
            <div className={cn(
              "flex flex-col items-center justify-center py-8 text-center",
              "rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800",
            )}>
              <Globe className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="font-medium text-muted-foreground">
                {activeRunId ? "Keine Ergebnisse" : "Noch kein Crawl durchgeführt"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {activeRunId
                  ? "Keine URLs entsprechen den Filterkriterien"
                  : "Starte einen Full Crawl oder Quick Check"
                }
              </p>
            </div>
          ) : (
            results.map((result) => (
              <ResultRow key={result.id} result={result} />
            ))
          )}
        </div>
      </div>

      {/* Run History (Collapsible) */}
      <div className={cn(
        "rounded-2xl overflow-hidden",
        "bg-white/60 dark:bg-gray-900/60",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/20 dark:border-gray-700/30",
        "shadow-lg shadow-black/5"
      )}>
        <div
          className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors"
          onClick={() => setShowHistory(!showHistory)}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">Run-Historie</h3>
            {runs && (
              <span className="text-xs text-muted-foreground">{runs.length} Runs</span>
            )}
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            showHistory && "rotate-180"
          )} />
        </div>
        {showHistory && (
          <div className="px-4 pb-4 border-t border-gray-200/50 dark:border-gray-700/30">
            {runsLoading ? (
              <div className="space-y-2 pt-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : !runs || runs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Keine Runs vorhanden</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {runs.map((run) => (
                  <RunHistoryCard key={run.id} run={run} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
