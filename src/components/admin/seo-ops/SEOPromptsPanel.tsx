/**
 * SEO Prompts Panel Component
 * Displays PromptPacks for Claude Code with copy functionality
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
  Copy,
  Check,
  ChevronDown,
  FileCode,
  Target,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  File,
  Wand2,
} from "lucide-react";
import type { SEOPromptPack } from "@/hooks/useSEOOps";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "sonner";

interface SEOPromptsPanelProps {
  prompts: SEOPromptPack[];
  isLoading?: boolean;
  onMarkUsed?: (promptId: string) => void;
  compact?: boolean;
  showFilters?: boolean;
}

const getTargetAreaConfig = (area: SEOPromptPack["target_area"]) => {
  const configs: Record<
    SEOPromptPack["target_area"],
    { label: string; icon: typeof FileCode; color: string }
  > = {
    redirects: { label: "Redirects", icon: FileCode, color: "text-blue-600 dark:text-blue-400" },
    titles: { label: "Titles", icon: FileCode, color: "text-purple-600 dark:text-purple-400" },
    content: { label: "Content", icon: FileCode, color: "text-green-600 dark:text-green-400" },
    schema: { label: "Schema", icon: FileCode, color: "text-orange-600 dark:text-orange-400" },
    internal_linking: { label: "Verlinkung", icon: FileCode, color: "text-cyan-600 dark:text-cyan-400" },
    new_page: { label: "Neue Seite", icon: FileCode, color: "text-pink-600 dark:text-pink-400" },
    canonicalization: { label: "Canonical", icon: FileCode, color: "text-amber-600 dark:text-amber-400" },
    technical: { label: "Technisch", icon: FileCode, color: "text-gray-600 dark:text-gray-400" },
  };
  return configs[area] || { label: area, icon: FileCode, color: "text-gray-600" };
};

function PromptCard({
  prompt,
  onMarkUsed,
  compact = false,
}: {
  prompt: SEOPromptPack;
  onMarkUsed?: (promptId: string) => void;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const areaConfig = getTargetAreaConfig(prompt.target_area);
  const AreaIcon = areaConfig.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    toast.success("Prompt in Zwischenablage kopiert");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkUsed = async () => {
    if (!onMarkUsed) return;
    setIsMarking(true);
    try {
      await onMarkUsed(prompt.id);
      toast.success("Prompt als verwendet markiert");
    } finally {
      setIsMarking(false);
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
          "bg-white/60 dark:bg-gray-900/60",
          "hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors",
          prompt.is_used && "opacity-60"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <Wand2 className={cn("h-4 w-4 flex-shrink-0", areaConfig.color)} />
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate", prompt.is_used && "line-through")}>
            {prompt.title}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {areaConfig.label}
        </Badge>
        {prompt.is_used && (
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden",
        "bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5",
        "dark:from-indigo-500/10 dark:via-purple-500/5 dark:to-pink-500/10",
        prompt.is_used && "opacity-70"
      )}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-white/30 dark:hover:bg-gray-900/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={cn("rounded-lg p-2 bg-white/80 dark:bg-gray-800/80")}>
          <Sparkles className={cn("h-4 w-4", areaConfig.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={cn("font-medium", prompt.is_used && "line-through text-muted-foreground")}>
              {prompt.title}
            </h4>
            <Badge variant="secondary" className={cn("text-xs", areaConfig.color)}>
              {areaConfig.label}
            </Badge>
            {prompt.is_used && (
              <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verwendet
              </Badge>
            )}
          </div>
          {prompt.estimated_complexity && (
            <p className="text-xs text-muted-foreground mt-1">
              Komplexität: {prompt.estimated_complexity}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {copied ? (
              <Check className="h-3 w-3 mr-1 text-green-600" />
            ) : (
              <Copy className="h-3 w-3 mr-1" />
            )}
            {copied ? "Kopiert!" : "Kopieren"}
          </Button>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <>
          {/* Prompt Text */}
          <div className="px-4 py-3 bg-white/40 dark:bg-gray-900/40 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Claude Code Prompt:</span>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 mr-1" />
                )}
                {copied ? "Kopiert!" : "In Zwischenablage"}
              </Button>
            </div>
            <pre
              className={cn(
                "text-sm font-mono whitespace-pre-wrap",
                "bg-gray-900 text-gray-100 dark:bg-black dark:text-gray-200",
                "rounded-lg p-4 overflow-x-auto max-h-[400px] overflow-y-auto"
              )}
            >
              {prompt.prompt_text}
            </pre>
          </div>

          {/* Files to Inspect */}
          {prompt.files_to_inspect.length > 0 && (
            <div className="px-4 py-3 bg-muted/20 border-t">
              <div className="flex items-center gap-2 mb-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Relevante Dateien:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {prompt.files_to_inspect.map((file, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-mono">
                    {file}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Acceptance Criteria */}
          {prompt.acceptance_criteria.length > 0 && (
            <div className="px-4 py-3 bg-green-50/50 dark:bg-green-950/20 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Akzeptanzkriterien:
                </span>
              </div>
              <ul className="space-y-1">
                {prompt.acceptance_criteria.map((criterion, i) => (
                  <li
                    key={i}
                    className="text-xs text-green-600/80 dark:text-green-400/80 flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="px-4 py-3 bg-muted/30 border-t flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Erstellt{" "}
              {formatDistanceToNow(new Date(prompt.created_at), {
                addSuffix: true,
                locale: de,
              })}
              {prompt.used_at && (
                <>
                  {" "}
                  • Verwendet{" "}
                  {formatDistanceToNow(new Date(prompt.used_at), {
                    addSuffix: true,
                    locale: de,
                  })}
                </>
              )}
            </div>
            {!prompt.is_used && onMarkUsed && (
              <Button variant="outline" size="sm" onClick={handleMarkUsed} disabled={isMarking}>
                {isMarking ? (
                  <Clock className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                Als verwendet markieren
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function SEOPromptsPanel({
  prompts,
  isLoading,
  onMarkUsed,
  compact = false,
  showFilters = false,
}: SEOPromptsPanelProps) {
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [usedFilter, setUsedFilter] = useState<string>("unused");

  // Get unique areas
  const areas = Array.from(new Set(prompts.map((p) => p.target_area)));

  const filteredPrompts = prompts.filter((prompt) => {
    if (areaFilter !== "all" && prompt.target_area !== areaFilter) return false;
    if (usedFilter === "unused" && prompt.is_used) return false;
    if (usedFilter === "used" && !prompt.is_used) return false;
    return true;
  });

  // Sort: unused first, then by creation date
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (a.is_used !== b.is_used) return a.is_used ? 1 : -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
          <Select value={usedFilter} onValueChange={setUsedFilter}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="unused">Unbenutzt</SelectItem>
              <SelectItem value="used">Verwendet</SelectItem>
            </SelectContent>
          </Select>
          {areas.length > 1 && (
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Bereiche</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {getTargetAreaConfig(area).label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {sortedPrompts.length} von {prompts.length}
          </span>
        </div>
      )}

      {sortedPrompts.length === 0 ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-8 text-center",
            "rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700",
            "bg-gray-50/50 dark:bg-gray-900/20"
          )}
        >
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-3">
            <Sparkles className="h-6 w-6 text-gray-400" />
          </div>
          <p className="font-medium text-gray-600 dark:text-gray-300">Keine Prompts gefunden</p>
          <p className="text-sm text-muted-foreground mt-1">
            {usedFilter === "unused"
              ? "Alle Prompts wurden bereits verwendet"
              : "Keine Prompts entsprechen den Filterkriterien"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onMarkUsed={onMarkUsed} compact={compact} />
          ))}
        </div>
      )}
    </div>
  );
}
