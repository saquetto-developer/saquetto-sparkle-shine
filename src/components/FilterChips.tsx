import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterChip {
  id: string;
  label: string;
  value: string;
  removable?: boolean;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterChips({
  filters,
  onRemove,
  onClearAll,
  className
}: FilterChipsProps) {
  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="text-sm text-muted-foreground font-medium">
        Filtros ativos:
      </span>

      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant="secondary"
          className={cn(
            'px-3 py-1.5 text-sm font-medium',
            'bg-primary/10 text-primary border-primary/20',
            'transition-all duration-200 hover:bg-primary/20',
            filter.removable && 'pr-1'
          )}
        >
          <span className="mr-1">{filter.label}:</span>
          <span className="font-semibold">{filter.value}</span>

          {filter.removable && onRemove && (
            <button
              onClick={() => onRemove(filter.id)}
              className="ml-2 p-0.5 rounded-full hover:bg-primary/30 transition-colors"
              aria-label={`Remover filtro ${filter.label}`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </Badge>
      ))}

      {onClearAll && filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          Limpar todos
        </Button>
      )}
    </div>
  );
}
