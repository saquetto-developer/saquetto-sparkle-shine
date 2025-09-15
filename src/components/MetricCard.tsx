import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  trend?: string;
  variant?: 'default' | 'success' | 'destructive' | 'primary' | 'accent' | 'warning';
  size?: 'default' | 'sm';
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  size = 'default' 
}: MetricCardProps) {
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
    <Card className={cn(
      'bg-gradient-card shadow-card transition-all duration-300 hover:shadow-elegant hover:scale-105',
      variants[variant]
    )}>
      <CardContent className={cn(
        'p-6',
        size === 'sm' && 'p-4'
      )}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={cn(
            'font-medium text-muted-foreground',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {title}
          </h3>
          {Icon && (
            <Icon className={cn(
              iconVariants[variant],
              size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
            )} />
          )}
        </div>
        
        <div className={cn(
          'font-bold text-foreground',
          size === 'sm' ? 'text-lg' : 'text-2xl md:text-3xl'
        )}>
          {value}
        </div>
        
        {trend && (
          <div className="mt-2">
            <Badge 
              variant="secondary" 
              className={cn(
                'text-xs bg-muted/50',
                size === 'sm' && 'text-xs px-2 py-0.5'
              )}
            >
              {trend}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}