/**
 * SEO Tasks Panel Component
 * Displays and manages SEO tasks with status tracking
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
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Calendar,
  Link2,
  Play,
  Check,
  X,
  Loader2,
  Filter,
} from "lucide-react";
import type { SEOTask } from "@/hooks/useSEOOps";
import { formatDistanceToNow, format, isPast, isToday } from "date-fns";
import { de } from "date-fns/locale";

interface SEOTasksPanelProps {
  tasks: SEOTask[];
  isLoading?: boolean;
  onUpdateStatus?: (taskId: string, status: SEOTask["status"], notes?: string) => void;
  onViewAlert?: (alertId: string) => void;
  compact?: boolean;
  showFilters?: boolean;
}

const getPriorityConfig = (priority: SEOTask["priority"]) => {
  switch (priority) {
    case "critical":
      return {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-900/50",
        label: "Kritisch",
        dot: "bg-red-500",
      };
    case "high":
      return {
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-900/50",
        label: "Hoch",
        dot: "bg-orange-500",
      };
    case "medium":
      return {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-900/50",
        label: "Mittel",
        dot: "bg-amber-500",
      };
    default:
      return {
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900/50",
        label: "Niedrig",
        dot: "bg-blue-500",
      };
  }
};

const getStatusConfig = (status: SEOTask["status"]) => {
  switch (status) {
    case "done":
      return {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        label: "Erledigt",
      };
    case "in_progress":
      return {
        icon: Clock,
        color: "text-blue-600 dark:text-blue-400",
        label: "In Bearbeitung",
      };
    case "wont_fix":
      return {
        icon: XCircle,
        color: "text-gray-500 dark:text-gray-400",
        label: "Nicht umsetzen",
      };
    default:
      return {
        icon: Circle,
        color: "text-amber-600 dark:text-amber-400",
        label: "Offen",
      };
  }
};

const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    traffic_drop: "Traffic-Rückgang",
    ranking_loss: "Ranking-Verlust",
    technical: "Technisch",
    content: "Content",
    duplicate: "Duplikate",
    cannibalization: "Kannibalisierung",
    opportunity: "Chance",
  };
  return labels[category] || category;
};

function TaskCard({
  task,
  onUpdateStatus,
  onViewAlert,
  compact = false,
}: {
  task: SEOTask;
  onUpdateStatus?: (taskId: string, status: SEOTask["status"], notes?: string) => void;
  onViewAlert?: (alertId: string) => void;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;

  const isDone = task.status === "done" || task.status === "wont_fix";
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isDone;
  const isDueToday = task.due_date && isToday(new Date(task.due_date));

  const handleStatusUpdate = async (newStatus: SEOTask["status"]) => {
    if (!onUpdateStatus) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(task.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
          "bg-white/60 dark:bg-gray-900/60",
          "hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors",
          isDone && "opacity-60"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <StatusIcon className={cn("h-4 w-4 flex-shrink-0", statusConfig.color)} />
        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityConfig.dot)} />
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate", isDone && "line-through")}>{task.title}</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {getCategoryLabel(task.category)}
        </Badge>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden",
        "bg-white/60 dark:bg-gray-900/60",
        "backdrop-blur-sm",
        isDone && "opacity-70"
      )}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <StatusIcon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", statusConfig.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={cn("font-medium", isDone && "line-through text-muted-foreground")}>
              {task.title}
            </h4>
            <div className={cn("w-2 h-2 rounded-full", priorityConfig.dot)} />
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(task.category)}
            </Badge>
            {task.alert && (
              <Badge variant="secondary" className="text-xs">
                <Link2 className="h-3 w-3 mr-1" />
                Alert
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {task.due_date && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue && "text-red-600 dark:text-red-400",
                isDueToday && !isOverdue && "text-amber-600 dark:text-amber-400",
                !isOverdue && !isDueToday && "text-muted-foreground"
              )}
            >
              <Calendar className="h-3 w-3" />
              {format(new Date(task.due_date), "d. MMM", { locale: de })}
            </div>
          )}
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <>
          {/* Details */}
          <div className="px-4 py-3 bg-muted/20 border-t space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Status:</span>
                <span className={statusConfig.color}>{statusConfig.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Priorität:</span>
                <span className={priorityConfig.color}>{priorityConfig.label}</span>
              </div>
            </div>

            {task.entity_key && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Betrifft:</span>
                <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded truncate max-w-[400px]">
                  {task.entity_key}
                </code>
              </div>
            )}

            {task.due_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Fällig:</span>
                <span className={isOverdue ? "text-red-600" : ""}>
                  {format(new Date(task.due_date), "d. MMMM yyyy", { locale: de })}
                  {isOverdue && " (überfällig)"}
                </span>
              </div>
            )}

            {task.follow_up_days.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Follow-up nach:</span>
                <span>{task.follow_up_days.join(", ")} Tagen</span>
              </div>
            )}

            {task.completed_at && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  Erledigt am {format(new Date(task.completed_at), "d. MMMM yyyy", { locale: de })}
                </span>
              </div>
            )}

            {task.completion_notes && (
              <div className="text-sm">
                <span className="text-muted-foreground">Notizen:</span>
                <p className="mt-1 text-muted-foreground italic">{task.completion_notes}</p>
              </div>
            )}
          </div>

          {/* Related Alert */}
          {task.alert && (
            <div className="px-4 py-2 bg-amber-50/50 dark:bg-amber-950/20 border-t flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-700 dark:text-amber-300">
                  Verknüpft mit Alert: {task.alert.title}
                </span>
              </div>
              {onViewAlert && (
                <Button variant="ghost" size="sm" onClick={() => onViewAlert(task.alert!.id)}>
                  Zum Alert
                </Button>
              )}
            </div>
          )}

          {/* Actions */}
          {!isDone && onUpdateStatus && (
            <div className="px-4 py-3 bg-muted/30 border-t flex items-center justify-end gap-2">
              {task.status === "open" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate("in_progress")}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3 mr-1" />
                  )}
                  Starten
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusUpdate("wont_fix")}
                disabled={isUpdating}
              >
                <X className="h-3 w-3 mr-1" />
                Nicht umsetzen
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleStatusUpdate("done")}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                Erledigt
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SEOTasksPanel({
  tasks,
  isLoading,
  onUpdateStatus,
  onViewAlert,
  compact = false,
  showFilters = false,
}: SEOTasksPanelProps) {
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Get unique categories
  const categories = Array.from(new Set(tasks.map((t) => t.category)));

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "active" && (task.status === "done" || task.status === "wont_fix")) return false;
    if (statusFilter !== "all" && statusFilter !== "active" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    if (categoryFilter !== "all" && task.category !== categoryFilter) return false;
    return true;
  });

  // Sort: critical first, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
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
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="open">Offen</SelectItem>
              <SelectItem value="in_progress">In Bearbeitung</SelectItem>
              <SelectItem value="done">Erledigt</SelectItem>
              <SelectItem value="wont_fix">Nicht umsetzen</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Prios</SelectItem>
              <SelectItem value="critical">Kritisch</SelectItem>
              <SelectItem value="high">Hoch</SelectItem>
              <SelectItem value="medium">Mittel</SelectItem>
              <SelectItem value="low">Niedrig</SelectItem>
            </SelectContent>
          </Select>
          {categories.length > 1 && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {sortedTasks.length} von {tasks.length}
          </span>
        </div>
      )}

      {sortedTasks.length === 0 ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-8 text-center",
            "rounded-xl border-2 border-dashed border-green-200 dark:border-green-900",
            "bg-green-50/50 dark:bg-green-950/20"
          )}
        >
          <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-3 mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="font-medium text-green-700 dark:text-green-300">Keine Tasks gefunden</p>
          <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-1">
            {statusFilter === "open" || statusFilter === "active"
              ? "Alle offenen Tasks wurden erledigt"
              : "Keine Tasks entsprechen den Filterkriterien"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={onUpdateStatus}
              onViewAlert={onViewAlert}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}
