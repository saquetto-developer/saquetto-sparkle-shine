import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniSparkline } from './MiniSparkline';
import { useState } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  trend?: string;
  variant?: 'default' | 'success' | 'destructive' | 'primary' | 'accent' | 'warning';
  size?: 'default' | 'sm';
  sparklineData?: number[];
  subtitle?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  size = 'default',
  sparklineData,
  subtitle,
  onClick,
  clickable = false
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const variants = {
    default: 'border-border',
    success: 'border-success/20 bg-success/5',
    destructive: 'border-destructive/20 bg-destructive/5',
    primary: 'border-primary/20 bg-primary/5',
    accent: 'border-accent/20 bg-accent/5',
    warning: 'border-warning/20 bg-warning/5'
  };

  const iconVariants = {
    default: 'text-muted-foreground',
    success: 'text-success',
    destructive: 'text-destructive',
    primary: 'text-primary',
    accent: 'text-accent',
    warning: 'text-warning'
  };

  return (
    <Card
      className={cn(
        'bg-gradient-card shadow-card transition-all duration-300 group',
        clickable && 'cursor-pointer hover:shadow-2xl hover:border-primary/40 active:scale-[0.98]',
        !clickable && 'hover:shadow-elegant hover:scale-[1.02] hover:-translate-y-1',
        variants[variant]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      } : undefined}
    >
      <CardContent className={cn(
        'p-6 relative overflow-hidden',
        size === 'sm' && 'p-4'
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h3 className={cn(
              'font-semibold text-muted-foreground uppercase tracking-wide',
              size === 'sm' ? 'text-xs' : 'text-xs'
            )}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn(
              'rounded-full p-2 transition-all duration-300',
              'group-hover:scale-110',
              iconVariants[variant],
              variant === 'success' && 'bg-success/10',
              variant === 'destructive' && 'bg-destructive/10',
              variant === 'warning' && 'bg-warning/10',
              variant === 'primary' && 'bg-primary/10',
              variant === 'default' && 'bg-muted'
            )}>
              <Icon className={cn(
                size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
              )} />
            </div>
          )}
        </div>

        <div className={cn(
          'font-bold text-foreground transition-all duration-300',
          size === 'sm' ? 'text-xl' : 'text-3xl md:text-4xl',
          isHovered && 'scale-105'
        )}>
          {value}
        </div>

        <div className="mt-3 flex items-center justify-between">
          {trend && (
            <Badge
              variant="secondary"
              className={cn(
                'text-xs bg-muted/50 font-medium',
                size === 'sm' && 'text-xs px-2 py-0.5'
              )}
            >
              {trend}
            </Badge>
          )}

          {sparklineData && sparklineData.length > 0 && (
            <div className={cn(
              'transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-60'
            )}>
              <MiniSparkline
                data={sparklineData}
                width={80}
                height={20}
                color={iconVariants[variant].replace('text-', '')}
              />
            </div>
          )}
        </div>

        {/* Clickable indicator */}
        {clickable && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
        )}

        {/* Decorative gradient on hover */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
          )}
        />
      </CardContent>
    </Card>
  );
}