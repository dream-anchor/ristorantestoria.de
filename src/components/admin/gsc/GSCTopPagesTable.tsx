/**
 * GSC Top Pages Table Component
 * Displays top performing pages with metrics and trends
 */
import { cn } from "@/lib/utils";
import { formatUrlForDisplay, formatPercentChange, getTrendIndicator, extractPath } from "@/lib/urlNormalization";
import { ArrowUp, ArrowDown, Minus, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { GSCPageAggregate } from "@/hooks/useGSCMetrics";

interface GSCTopPagesTableProps {
  pages: GSCPageAggregate[];
  isLoading?: boolean;
  onPageClick?: (pageUrl: string) => void;
  showTrends?: boolean;
  limit?: number;
}

const TrendCell = ({ change, inverted = false }: { change: number | null; inverted?: boolean }) => {
  if (change === null || change === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  const trend = getTrendIndicator(change);
  // For position, lower is better
  const color = inverted
    ? trend.direction === 'up' ? 'text-red-600' : trend.direction === 'down' ? 'text-green-600' : 'text-muted-foreground'
    : trend.color;

  const Icon = trend.direction === 'up' ? ArrowUp : trend.direction === 'down' ? ArrowDown : Minus;

  return (
    <span className={cn("inline-flex items-center gap-0.5 text-sm", color)}>
      <Icon className="h-3 w-3" />
      {formatPercentChange(change)}
    </span>
  );
};

export default function GSCTopPagesTable({
  pages,
  isLoading,
  onPageClick,
  showTrends = true,
  limit = 20,
}: GSCTopPagesTableProps) {
  const displayedPages = pages.slice(0, limit);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine Seitendaten verfügbar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[50%]">Seite</TableHead>
            <TableHead className="text-right">Klicks</TableHead>
            {showTrends && <TableHead className="text-right">Trend</TableHead>}
            <TableHead className="text-right">Impressions</TableHead>
            <TableHead className="text-right">CTR</TableHead>
            <TableHead className="text-right">Position</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedPages.map((page, index) => {
            const path = extractPath(page.page_url);
            const displayPath = formatUrlForDisplay(page.page_url, 40);

            return (
              <TableRow
                key={page.id || index}
                className={cn(
                  "group cursor-pointer transition-colors",
                  onPageClick && "hover:bg-accent/50"
                )}
                onClick={() => onPageClick?.(page.page_url)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-sm truncate max-w-[300px]"
                      title={path}
                    >
                      {displayPath}
                    </span>
                    <a
                      href={page.page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {page.clicks.toLocaleString('de-DE')}
                </TableCell>
                {showTrends && (
                  <TableCell className="text-right">
                    <TrendCell change={page.clicks_pct_change} />
                  </TableCell>
                )}
                <TableCell className="text-right text-muted-foreground">
                  {page.impressions.toLocaleString('de-DE')}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {(page.ctr * 100).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="font-mono">
                    {page.position.toFixed(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
