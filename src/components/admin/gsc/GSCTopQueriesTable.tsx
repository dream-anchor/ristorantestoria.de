/**
 * GSC Top Queries Table Component
 * Displays top performing search queries with metrics
 */
import { cn } from "@/lib/utils";
import { formatPercentChange, getTrendIndicator } from "@/lib/urlNormalization";
import { ArrowUp, ArrowDown, Minus, Search } from "lucide-react";
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
import type { GSCQueryAggregate } from "@/hooks/useGSCMetrics";

interface GSCTopQueriesTableProps {
  queries: GSCQueryAggregate[];
  isLoading?: boolean;
  onQueryClick?: (query: string) => void;
  showTrends?: boolean;
  limit?: number;
}

const TrendCell = ({ change }: { change: number | null }) => {
  if (change === null || change === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  const trend = getTrendIndicator(change);
  const Icon = trend.direction === 'up' ? ArrowUp : trend.direction === 'down' ? ArrowDown : Minus;

  return (
    <span className={cn("inline-flex items-center gap-0.5 text-sm", trend.color)}>
      <Icon className="h-3 w-3" />
      {formatPercentChange(change)}
    </span>
  );
};

const getQueryBadge = (query: string): { label: string; variant: 'default' | 'secondary' | 'outline' } | null => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('storia') || lowerQuery.includes('ristorante')) {
    return { label: 'Brand', variant: 'default' };
  }
  if (lowerQuery.includes('münchen') || lowerQuery.includes('munich') || lowerQuery.includes('maxvorstadt')) {
    return { label: 'Lokal', variant: 'secondary' };
  }
  if (lowerQuery.includes('pizza') || lowerQuery.includes('pasta') || lowerQuery.includes('italienisch')) {
    return { label: 'Produkt', variant: 'outline' };
  }

  return null;
};

export default function GSCTopQueriesTable({
  queries,
  isLoading,
  onQueryClick,
  showTrends = true,
  limit = 50,
}: GSCTopQueriesTableProps) {
  const displayedQueries = queries.slice(0, limit);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine Suchanfragen verfügbar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[50%]">Suchanfrage</TableHead>
            <TableHead className="text-right">Klicks</TableHead>
            {showTrends && <TableHead className="text-right">Trend</TableHead>}
            <TableHead className="text-right">Impressions</TableHead>
            <TableHead className="text-right">CTR</TableHead>
            <TableHead className="text-right">Position</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedQueries.map((item, index) => {
            const badge = getQueryBadge(item.query);

            return (
              <TableRow
                key={item.id || index}
                className={cn(
                  "group cursor-pointer transition-colors",
                  onQueryClick && "hover:bg-accent/50"
                )}
                onClick={() => onQueryClick?.(item.query)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium truncate max-w-[300px]" title={item.query}>
                      {item.query}
                    </span>
                    {badge && (
                      <Badge variant={badge.variant} className="text-xs">
                        {badge.label}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.total_clicks.toLocaleString('de-DE')}
                </TableCell>
                {showTrends && (
                  <TableCell className="text-right">
                    <TrendCell change={item.delta_clicks_wow} />
                  </TableCell>
                )}
                <TableCell className="text-right text-muted-foreground">
                  {item.total_impressions.toLocaleString('de-DE')}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {(item.avg_ctr * 100).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="font-mono">
                    {item.avg_position.toFixed(1)}
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
