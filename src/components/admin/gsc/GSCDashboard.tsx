/**
 * GSC Dashboard Component
 * Main dashboard with Apple 2026 60/40 Split-View design
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  TrendingUp,
  FileText,
  Search,
  AlertCircle,
  Copy,
  Clock,
  Loader2,
} from "lucide-react";
import GSCMetricCard from "./GSCMetricCard";
import GSCTopPagesTable from "./GSCTopPagesTable";
import GSCTopQueriesTable from "./GSCTopQueriesTable";
import GSCAlertsPanel from "./GSCAlertsPanel";
import {
  useGSCDashboard,
  useGSCTopPages,
  useGSCTopQueries,
  useGSCAlerts,
  useUpdateAlertStatus,
  useTriggerGSCSync,
  useTriggerGSCAggregate,
} from "@/hooks/useGSCMetrics";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

type WindowType = '7d' | '28d' | '90d';
type DetailView = 'pages' | 'queries' | 'alerts' | 'duplicates' | null;

export default function GSCDashboard() {
  const [windowType, setWindowType] = useState<WindowType>('28d');
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Data hooks
  const { data: dashboard, isLoading: dashboardLoading, refetch } = useGSCDashboard(windowType);
  const { data: topPages, isLoading: pagesLoading } = useGSCTopPages(windowType, 'total_clicks', 20);
  const { data: topQueries, isLoading: queriesLoading } = useGSCTopQueries(windowType, 'total_clicks', 50);
  const { data: alerts, isLoading: alertsLoading } = useGSCAlerts(false);

  // Mutation hooks
  const updateAlertMutation = useUpdateAlertStatus();
  const syncMutation = useTriggerGSCSync();
  const aggregateMutation = useTriggerGSCAggregate();

  const isRefreshing = syncMutation.isPending || aggregateMutation.isPending;

  const handleRefresh = async () => {
    try {
      await syncMutation.mutateAsync('daily_sync');
      await aggregateMutation.mutateAsync();
      toast.success('Daten aktualisiert');
      refetch();
    } catch (error) {
      toast.error('Fehler beim Aktualisieren');
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      await updateAlertMutation.mutateAsync({ alertId, status: 'acknowledged' });
      toast.success('Alert bestätigt');
    } catch (error) {
      toast.error('Fehler beim Bestätigen');
    }
  };

  const handleBackfill = async () => {
    try {
      await syncMutation.mutateAsync('backfill');
      toast.success('Backfill gestartet');
    } catch (error) {
      toast.error('Fehler beim Backfill');
    }
  };

  // Get first site aggregate for the selected window
  const siteAggregate = dashboard?.siteAggregates?.[0];
  const lastSync = dashboard?.recentSync;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Search Console</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                SEO-Performance für ristorantestoria.de
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastSync && (
                <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Letzte Sync: {formatDistanceToNow(new Date(lastSync.created_at), {
                      addSuffix: true,
                      locale: de,
                    })}
                  </span>
                </div>
              )}
              <Select value={windowType} onValueChange={(v) => setWindowType(v as WindowType)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Tage</SelectItem>
                  <SelectItem value="28d">28 Tage</SelectItem>
                  <SelectItem value="90d">90 Tage</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Aktualisieren
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: 60/40 Split View */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - 60% (Overview) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dashboardLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))
              ) : (
                <>
                  <GSCMetricCard
                    title="Klicks"
                    value={siteAggregate?.total_clicks || 0}
                    percentChange={siteAggregate?.pct_change_clicks_wow}
                    format="number"
                  />
                  <GSCMetricCard
                    title="Impressionen"
                    value={siteAggregate?.total_impressions || 0}
                    percentChange={siteAggregate?.pct_change_impressions_wow}
                    format="number"
                  />
                  <GSCMetricCard
                    title="CTR"
                    value={siteAggregate?.avg_ctr || 0}
                    percentChange={null}
                    format="percent"
                  />
                  <GSCMetricCard
                    title="Position"
                    value={siteAggregate?.avg_position || 0}
                    percentChange={null}
                    format="position"
                  />
                </>
              )}
            </div>

            {/* Tabs for Pages/Queries */}
            <div className={cn(
              "rounded-2xl overflow-hidden",
              "bg-white/60 dark:bg-gray-900/60",
              "backdrop-blur-xl backdrop-saturate-150",
              "border border-white/20 dark:border-gray-700/30",
              "shadow-lg shadow-black/5"
            )}>
              <Tabs defaultValue="pages" className="w-full">
                <div className="px-4 pt-4 pb-2 border-b border-gray-200/50 dark:border-gray-700/30">
                  <TabsList className="grid w-full grid-cols-2 max-w-[300px]">
                    <TabsTrigger value="pages" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Top Seiten
                    </TabsTrigger>
                    <TabsTrigger value="queries" className="gap-2">
                      <Search className="h-4 w-4" />
                      Top Queries
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="pages" className="p-4 pt-2 m-0">
                  <GSCTopPagesTable
                    pages={topPages || []}
                    isLoading={pagesLoading}
                    onPageClick={(url) => {
                      setDetailView('pages');
                      setSelectedItem(url);
                    }}
                    limit={10}
                  />
                  {(topPages?.length || 0) > 10 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailView('pages')}
                      >
                        Alle {topPages?.length} Seiten anzeigen
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="queries" className="p-4 pt-2 m-0">
                  <GSCTopQueriesTable
                    queries={topQueries || []}
                    isLoading={queriesLoading}
                    onQueryClick={(query) => {
                      setDetailView('queries');
                      setSelectedItem(query);
                    }}
                    limit={10}
                  />
                  {(topQueries?.length || 0) > 10 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailView('queries')}
                      >
                        Alle {topQueries?.length} Queries anzeigen
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - 40% (Alerts & Actions) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts Card */}
            <div className={cn(
              "rounded-2xl overflow-hidden",
              "bg-white/60 dark:bg-gray-900/60",
              "backdrop-blur-xl backdrop-saturate-150",
              "border border-white/20 dark:border-gray-700/30",
              "shadow-lg shadow-black/5"
            )}>
              <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <h3 className="font-medium">Alerts</h3>
                  {(alerts?.length || 0) > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {alerts?.length}
                    </Badge>
                  )}
                </div>
                {(alerts?.length || 0) > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailView('alerts')}
                  >
                    Alle anzeigen
                  </Button>
                )}
              </div>
              <div className="p-4">
                <GSCAlertsPanel
                  alerts={(alerts || []).slice(0, 3)}
                  isLoading={alertsLoading}
                  onAcknowledge={handleAcknowledge}
                  compact
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className={cn(
              "rounded-2xl p-4",
              "bg-white/60 dark:bg-gray-900/60",
              "backdrop-blur-xl backdrop-saturate-150",
              "border border-white/20 dark:border-gray-700/30",
              "shadow-lg shadow-black/5"
            )}>
              <h3 className="font-medium mb-3">Schnellaktionen</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setDetailView('duplicates')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate URLs prüfen
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleBackfill}
                  disabled={syncMutation.isPending}
                >
                  {syncMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  90-Tage Backfill
                </Button>
              </div>
            </div>

            {/* Trend Summary */}
            <div className={cn(
              "rounded-2xl p-4",
              "bg-white/60 dark:bg-gray-900/60",
              "backdrop-blur-xl backdrop-saturate-150",
              "border border-white/20 dark:border-gray-700/30",
              "shadow-lg shadow-black/5"
            )}>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                WoW Änderungen
              </h3>
              {siteAggregate ? (
                <div className="grid grid-cols-2 gap-3">
                  <GSCMetricCard
                    title="Klicks"
                    value={siteAggregate.delta_clicks_wow || 0}
                    percentChange={siteAggregate.pct_change_clicks_wow}
                    format="number"
                    size="sm"
                  />
                  <GSCMetricCard
                    title="Impressionen"
                    value={siteAggregate.delta_impressions_wow || 0}
                    percentChange={siteAggregate.pct_change_impressions_wow}
                    format="number"
                    size="sm"
                  />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Keine Vergleichsdaten verfügbar
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel (Slide-over) */}
      {detailView && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div
            className="absolute inset-y-0 right-0 w-full max-w-2xl bg-background shadow-2xl overflow-y-auto"
            style={{ animation: 'slideIn 0.2s ease-out' }}
          >
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {detailView === 'pages' && 'Alle Seiten'}
                {detailView === 'queries' && 'Alle Suchanfragen'}
                {detailView === 'alerts' && 'Alle Alerts'}
                {detailView === 'duplicates' && 'Duplicate URLs'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setDetailView(null)}>
                Schließen
              </Button>
            </div>
            <div className="p-6">
              {detailView === 'pages' && (
                <GSCTopPagesTable
                  pages={topPages || []}
                  isLoading={pagesLoading}
                  limit={100}
                />
              )}
              {detailView === 'queries' && (
                <GSCTopQueriesTable
                  queries={topQueries || []}
                  isLoading={queriesLoading}
                  limit={100}
                />
              )}
              {detailView === 'alerts' && (
                <GSCAlertsPanel
                  alerts={alerts || []}
                  isLoading={alertsLoading}
                  onAcknowledge={handleAcknowledge}
                />
              )}
              {detailView === 'duplicates' && (
                <div className="text-center py-8 text-muted-foreground">
                  Duplicate-Analyse wird geladen...
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
