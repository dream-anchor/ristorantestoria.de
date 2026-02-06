/**
 * GSC Metric Card Component
 * Apple 2026 Glassmorphism design with trend indicators
 */
import { cn } from "@/lib/utils";
import { formatPercentChange, getTrendIndicator } from "@/lib/urlNormalization";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface GSCMetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  percentChange?: number | null;
  format?: 'number' | 'decimal' | 'percent' | 'position';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const formatValue = (value: string | number, format: string): string => {
  if (typeof value === 'string') return value;

  switch (format) {
    case 'number':
      return value.toLocaleString('de-DE');
    case 'decimal':
      return value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    case 'percent':
      return `${(value * 100).toFixed(1)}%`;
    case 'position':
      return value.toFixed(1);
    default:
      return value.toString();
  }
};

export default function GSCMetricCard({
  title,
  value,
  previousValue,
  percentChange,
  format = 'number',
  className,
  size = 'md',
}: GSCMetricCardProps) {
  const trend = getTrendIndicator(percentChange ?? null);

  // For position, lower is better - invert the colors
  const isPositionMetric = format === 'position';
  const trendColor = isPositionMetric
    ? trend.direction === 'up' ? 'text-red-600' : trend.direction === 'down' ? 'text-green-600' : 'text-muted-foreground'
    : trend.color;

  const TrendIcon = trend.direction === 'up'
    ? ArrowUp
    : trend.direction === 'down'
      ? ArrowDown
      : Minus;

  const sizeClasses = {
    sm: { card: 'p-3', title: 'text-xs', value: 'text-lg', trend: 'text-xs' },
    md: { card: 'p-4', title: 'text-sm', value: 'text-2xl', trend: 'text-sm' },
    lg: { card: 'p-6', title: 'text-base', value: 'text-4xl', trend: 'text-base' },
  };

  return (
    <div
      className={cn(
        // Glassmorphism effect
        "relative overflow-hidden rounded-2xl",
        "bg-white/60 dark:bg-gray-900/60",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/20 dark:border-gray-700/30",
        "shadow-lg shadow-black/5",
        "transition-all duration-300 hover:shadow-xl hover:bg-white/70 dark:hover:bg-gray-900/70",
        sizeClasses[size].card,
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />

      <div className="relative z-10">
        <p className={cn("font-medium text-muted-foreground mb-1", sizeClasses[size].title)}>
          {title}
        </p>

        <div className="flex items-end justify-between gap-2">
          <p className={cn("font-semibold tracking-tight", sizeClasses[size].value)}>
            {formatValue(value, format)}
          </p>

          {percentChange !== undefined && percentChange !== null && (
            <div className={cn("flex items-center gap-0.5", trendColor, sizeClasses[size].trend)}>
              <TrendIcon className="h-3 w-3" />
              <span>{formatPercentChange(percentChange)}</span>
            </div>
          )}
        </div>

        {previousValue !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            vs. {formatValue(previousValue, format)} vorher
          </p>
        )}
      </div>
    </div>
  );
}
