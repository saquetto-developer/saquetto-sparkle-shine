import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  type: 'success' | 'warning' | 'info' | 'highlight';
  message: string;
  icon?: React.ReactNode;
}

interface InsightsBannerProps {
  insights: Insight[];
  className?: string;
}

export function InsightsBanner({ insights, className }: InsightsBannerProps) {
  if (!insights || insights.length === 0) {
    return null;
  }

  const getIcon = (insight: Insight) => {
    if (insight.icon) return insight.icon;

    switch (insight.type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'highlight':
        return <Crown className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getColors = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'highlight':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className={cn("border-primary/20 bg-gradient-to-r from-primary/5 to-transparent", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Insights Rápidos
            </h3>

            <div className="space-y-2.5">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01]",
                    getColors(insight.type)
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(insight)}
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
