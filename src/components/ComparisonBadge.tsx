import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonBadgeProps {
  value: string;
  direction: 'up' | 'down' | 'neutral';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ComparisonBadge({
  value,
  direction,
  className,
  size = 'md'
}: ComparisonBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getIcon = () => {
    const iconClass = iconSizes[size];

    switch (direction) {
      case 'up':
        return <TrendingUp className={iconClass} />;
      case 'down':
        return <TrendingDown className={iconClass} />;
      default:
        return <Minus className={iconClass} />;
    }
  };

  const getColorClasses = () => {
    switch (direction) {
      case 'up':
        return 'bg-success/10 text-success border-success/20';
      case 'down':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold transition-all duration-200',
        sizeClasses[size],
        getColorClasses(),
        className
      )}
    >
      {getIcon()}
      <span>{value}</span>
    </span>
  );
}
