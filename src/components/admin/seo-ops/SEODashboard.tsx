/**
 * SEO Operations Dashboard Component
 * Main dashboard with Apple 2026 60/40 Split-View design
 * Displays briefings, alerts, tasks, and prompts
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  AlertCircle,
  CheckSquare,
  Sparkles,
  Clock,
  Loader2,
  Calendar,
  X,
  Activity,
  TrendingUp,
  FileText,
} from "lucide-react";
import SEOBriefingCard from "./SEOBriefingCard";
import SEOAlertsPanel from "./SEOAlertsPanel";
import SEOTasksPanel from "./SEOTasksPanel";
import SEOPromptsPanel from "./SEOPromptsPanel";
import {
  useSEOBriefing,
  useSEOAlerts,
  useSEOTasks,
  useSEOPrompts,
  useSEOStats,
  useUpdateSEOAlert,
  useUpdateSEOTask,
  useMarkPromptUsed,
  useTriggerSEOPipeline,
} from "@/hooks/useSEOOps";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

type DetailView = "alerts" | "tasks" | "prompts" | "briefing" | null;

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  onClick,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 cursor-pointer transition-all",
        "bg-white/60 dark:bg-gray-900/60",
        "backdrop-blur-sm border border-white/20 dark:border-gray-700/30",
        "hover:shadow-lg hover:scale-[1.02]",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
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

export default function SEODashboard() {
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // Data hooks
  const { data: briefing, isLoading: briefingLoading } = useSEOBriefing();
  const { data: alertsData, isLoading: alertsLoading } = useSEOAlerts({ status: "open", limit: 50 });
  const { data: tasksData, isLoading: tasksLoading } = useSEOTasks({ status: "open" });
  const { data: promptsData, isLoading: promptsLoading } = useSEOPrompts({ used: false });
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useSEOStats();

  // Mutation hooks
  const updateAlert = useUpdateSEOAlert();
  const updateTask = useUpdateSEOTask();
  const markPromptUsed = useMarkPromptUsed();
  const triggerPipeline = useTriggerSEOPipeline();

  const isRefreshing = triggerPipeline.isPending;

  const handleRunPipeline = async () => {
    try {
      await triggerPipeline.mutateAsync(undefined);
      toast.success("SEO Pipeline erfolgreich ausgeführt");
      refetchStats();
    } catch (error) {
      toast.error("Fehler beim Ausführen der Pipeline");
    }
  };

  const handleUpdateAlertStatus = async (
    alertId: string,
    status: "open" | "acknowledged" | "resolved" | "false_positive",
    notes?: string
  ) => {
    try {
      await updateAlert.mutateAsync({
        alertId,
        updates: {
          status,
          ...(status === "resolved" && { resolution_notes: notes }),
        },
      });
      toast.success(`Alert ${status === "resolved" ? "gelöst" : status === "acknowledged" ? "bestätigt" : "aktualisiert"}`);
    } catch (error) {
      toast.error("Fehler beim Aktualisieren");
    }
  };

  const handleUpdateTaskStatus = async (
    taskId: string,
    status: "open" | "in_progress" | "done" | "wont_fix",
    notes?: string
  ) => {
    try {
      await updateTask.mutateAsync({
        taskId,
        updates: {
          status,
          ...(status === "done" && { completion_notes: notes }),
        },
      });
      toast.success(`Task ${status === "done" ? "erledigt" : "aktualisiert"}`);
    } catch (error) {
      toast.error("Fehler beim Aktualisieren");
    }
  };

  const handleMarkPromptUsed = async (promptId: string) => {
    try {
      await markPromptUsed.mutateAsync(promptId);
    } catch (error) {
      toast.error("Fehler beim Markieren");
    }
  };

  const handleViewPromptsForAlert = (alertId: string) => {
    setSelectedAlertId(alertId);
    setDetailView("prompts");
  };

  const alerts = alertsData?.alerts || [];
  const tasks = tasksData?.tasks || [];
  const prompts = promptsData?.prompts || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-12 z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">SEO Operations</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Automatisierte SEO-Analyse & Handlungsempfehlungen
              </p>
            </div>
            <div className="flex items-center gap-3">
              {stats?.last_pipeline_run && (stats.last_pipeline_run.completed_at || stats.last_pipeline_run.started_at) && (
                <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Letzte Analyse:{" "}
                    {(() => {
                      try {
                        const dateStr = stats.last_pipeline_run.completed_at || stats.last_pipeline_run.started_at;
                        const date = new Date(dateStr!);
                        if (isNaN(date.getTime())) return "-";
                        return formatDistanceToNow(date, { addSuffix: true, locale: de });
                      } catch {
                        return "-";
                      }
                    })()}
                  </span>
                </div>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={handleRunPipeline}
                disabled={isRefreshing}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Activity className="h-4 w-4 mr-2" />
                )}
                Pipeline ausführen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: 60/40 Split View */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - 60% (Briefing & Overview) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))
              ) : (
                <>
                  <StatCard
                    title="Offene Alerts"
                    value={stats?.open_alerts || 0}
                    icon={AlertCircle}
                    color="bg-red-500"
                    onClick={() => setDetailView("alerts")}
                  />
                  <StatCard
                    title="Offene Tasks"
                    value={stats?.open_tasks || 0}
                    icon={CheckSquare}
                    color="bg-amber-500"
                    onClick={() => setDetailView("tasks")}
                  />
                  <StatCard
                    title="Unbenutzte Prompts"
                    value={stats?.unused_prompts || 0}
                    icon={Sparkles}
                    color="bg-purple-500"
                    onClick={() => setDetailView("prompts")}
                  />
                  <StatCard
                    title="Letztes Briefing"
                    value={(() => {
                      try {
                        if (!stats?.latest_briefing_date) return "-";
                        const date = new Date(stats.latest_briefing_date);
                        if (isNaN(date.getTime())) return "-";
                        return format(date, "d. MMM", { locale: de });
                      } catch {
                        return "-";
                      }
                    })()}
                    icon={FileText}
                    color="bg-indigo-500"
                    onClick={() => setDetailView("briefing")}
                  />
                </>
              )}
            </div>

            {/* Daily Briefing */}
            <SEOBriefingCard
              briefing={briefing}
              isLoading={briefingLoading}
              onViewFull={() => setDetailView("briefing")}
            />

            {/* Tabs for Alerts/Tasks */}
            <div
              className={cn(
                "rounded-2xl overflow-hidden",
                "bg-white/60 dark:bg-gray-900/60",
                "backdrop-blur-xl backdrop-saturate-150",
                "border border-white/20 dark:border-gray-700/30",
                "shadow-lg shadow-black/5"
              )}
            >
              <Tabs defaultValue="alerts" className="w-full">
                <div className="px-4 pt-4 pb-2 border-b border-gray-200/50 dark:border-gray-700/30">
                  <TabsList className="grid w-full grid-cols-2 max-w-[300px]">
                    <TabsTrigger value="alerts" className="gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Alerts
                      {alerts.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {alerts.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Tasks
                      {tasks.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {tasks.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="alerts" className="p-4 pt-2 m-0">
                  <SEOAlertsPanel
                    alerts={alerts.slice(0, 5)}
                    isLoading={alertsLoading}
                    onUpdateStatus={handleUpdateAlertStatus}
                    onViewPrompts={handleViewPromptsForAlert}
                  />
                  {alerts.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button variant="ghost" size="sm" onClick={() => setDetailView("alerts")}>
                        Alle {alerts.length} Alerts anzeigen
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tasks" className="p-4 pt-2 m-0">
                  <SEOTasksPanel
                    tasks={tasks.slice(0, 5)}
                    isLoading={tasksLoading}
                    onUpdateStatus={handleUpdateTaskStatus}
                  />
                  {tasks.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button variant="ghost" size="sm" onClick={() => setDetailView("tasks")}>
                        Alle {tasks.length} Tasks anzeigen
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - 40% (Prompts & Quick Actions) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompts Card */}
            <div
              className={cn(
                "rounded-2xl overflow-hidden",
                "bg-white/60 dark:bg-gray-900/60",
                "backdrop-blur-xl backdrop-saturate-150",
                "border border-white/20 dark:border-gray-700/30",
                "shadow-lg shadow-black/5"
              )}
            >
              <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <h3 className="font-medium">Claude Code Prompts</h3>
                  {prompts.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {prompts.length}
                    </Badge>
                  )}
                </div>
                {prompts.length > 3 && (
                  <Button variant="ghost" size="sm" onClick={() => setDetailView("prompts")}>
                    Alle anzeigen
                  </Button>
                )}
              </div>
              <div className="p-4">
                <SEOPromptsPanel
                  prompts={prompts.slice(0, 3)}
                  isLoading={promptsLoading}
                  onMarkUsed={handleMarkPromptUsed}
                  compact
                />
              </div>
            </div>

            {/* Pipeline Status */}
            {stats?.last_pipeline_run && (
              <div
                className={cn(
                  "rounded-2xl p-4",
                  "bg-white/60 dark:bg-gray-900/60",
                  "backdrop-blur-xl backdrop-saturate-150",
                  "border border-white/20 dark:border-gray-700/30",
                  "shadow-lg shadow-black/5"
                )}
              >
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Letzte Pipeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Datum:</span>
                    <span>
                      {(() => {
                        try {
                          if (!stats.last_pipeline_run.date) return "-";
                          const date = new Date(stats.last_pipeline_run.date);
                          if (isNaN(date.getTime())) return "-";
                          return format(date, "d. MMMM yyyy", { locale: de });
                        } catch {
                          return "-";
                        }
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={stats.last_pipeline_run.status === "completed" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {stats.last_pipeline_run.status === "completed" ? "Abgeschlossen" : stats.last_pipeline_run.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Baselines berechnet:</span>
                    <span>{stats.last_pipeline_run.baselines_computed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alerts erstellt:</span>
                    <span>{stats.last_pipeline_run.alerts_created}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tasks erstellt:</span>
                    <span>{stats.last_pipeline_run.tasks_created}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prompts generiert:</span>
                    <span>{stats.last_pipeline_run.prompts_generated}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div
              className={cn(
                "rounded-2xl p-4",
                "bg-white/60 dark:bg-gray-900/60",
                "backdrop-blur-xl backdrop-saturate-150",
                "border border-white/20 dark:border-gray-700/30",
                "shadow-lg shadow-black/5"
              )}
            >
              <h3 className="font-medium mb-3">Schnellaktionen</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setDetailView("alerts")}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Alle Alerts prüfen
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setDetailView("tasks")}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Tasks bearbeiten
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setDetailView("prompts")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Prompts durchgehen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel (Slide-over) */}
      {detailView && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div
            className="absolute inset-y-0 right-0 w-full max-w-3xl bg-background shadow-2xl overflow-y-auto"
            style={{ animation: "slideIn 0.2s ease-out" }}
          >
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {detailView === "alerts" && "Alle SEO Alerts"}
                {detailView === "tasks" && "Alle SEO Tasks"}
                {detailView === "prompts" && "Alle Claude Code Prompts"}
                {detailView === "briefing" && "Vollständiges Briefing"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setDetailView(null);
                  setSelectedAlertId(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              {detailView === "alerts" && (
                <SEOAlertsPanel
                  alerts={alertsData?.alerts || []}
                  isLoading={alertsLoading}
                  onUpdateStatus={handleUpdateAlertStatus}
                  onViewPrompts={handleViewPromptsForAlert}
                  showFilters
                />
              )}
              {detailView === "tasks" && (
                <SEOTasksPanel
                  tasks={tasksData?.tasks || []}
                  isLoading={tasksLoading}
                  onUpdateStatus={handleUpdateTaskStatus}
                  showFilters
                />
              )}
              {detailView === "prompts" && (
                <SEOPromptsPanel
                  prompts={
                    selectedAlertId
                      ? (promptsData?.prompts || []).filter((p) => p.alert_event_id === selectedAlertId)
                      : promptsData?.prompts || []
                  }
                  isLoading={promptsLoading}
                  onMarkUsed={handleMarkPromptUsed}
                  showFilters
                />
              )}
              {detailView === "briefing" && briefing && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h1 className="text-xl font-semibold mb-4">
                    SEO Briefing - {(() => {
                      try {
                        if (!briefing.date) return "-";
                        const date = new Date(briefing.date);
                        if (isNaN(date.getTime())) return "-";
                        return format(date, "d. MMMM yyyy", { locale: de });
                      } catch {
                        return "-";
                      }
                    })()}
                  </h1>
                  <div className="whitespace-pre-wrap font-mono text-sm bg-muted/50 rounded-xl p-6">
                    {briefing.briefing_md}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
