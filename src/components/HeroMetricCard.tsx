import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroMetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  sparklineData?: number[];
  className?: string;
}

export function HeroMetricCard({
  title,
  value,
  subtitle,
  trend,
  sparklineData,
  className
}: HeroMetricCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;

    const iconProps = { className: 'w-5 h-5' };

    switch (trend.direction) {
      case 'up':
        return <TrendingUp {...iconProps} className="w-5 h-5 text-success" />;
      case 'down':
        return <TrendingDown {...iconProps} className="w-5 h-5 text-destructive" />;
      default:
        return <Minus {...iconProps} className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';

    switch (trend.direction) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  // Simple sparkline path generation
  const generateSparklinePath = () => {
    if (!sparklineData || sparklineData.length === 0) return '';

    const width = 200;
    const height = 40;
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;

    const points = sparklineData.map((value, index) => {
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]",
        "bg-gradient-to-br from-primary/5 via-background to-background",
        "border-primary/20",
        className
      )}
    >
      <CardContent className="p-8">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground/80 mt-1">
                  {subtitle}
                </p>
              )}
            </div>

            {trend && (
              <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50", getTrendColor())}>
                {getTrendIcon()}
                <span className="text-sm font-semibold">
                  {trend.value}
                </span>
              </div>
            )}
          </div>

          {/* Main Value */}
          <div className="space-y-2">
            <h2 className="text-5xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              {value}
            </h2>

            {/* Sparkline */}
            {sparklineData && sparklineData.length > 0 && (
              <div className="mt-4 h-10 opacity-40">
                <svg
                  width="200"
                  height="40"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d={generateSparklinePath()}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
      </CardContent>
    </Card>
  );
}
