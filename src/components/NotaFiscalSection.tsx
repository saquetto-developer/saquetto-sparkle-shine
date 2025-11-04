import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { displayValue } from '@/lib/notaFiscalFormatters';

export interface SectionField {
  label: string;
  value: any;
  formatter?: (value: any) => string;
  className?: string;
  copyable?: boolean;
  showWhenEmpty?: boolean;
}

interface NotaFiscalSectionProps {
  title: string;
  icon?: LucideIcon;
  fields: SectionField[];
  iconClassName?: string;
  containerClassName?: string;
}

export const NotaFiscalSection = React.memo(function NotaFiscalSection({
  title,
  icon: Icon,
  fields,
  iconClassName = '',
  containerClassName = ''
}: NotaFiscalSectionProps) {
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className={`space-y-3 ${containerClassName}`}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className={`h-5 w-5 ${iconClassName}`} />}
        <h4 className="font-semibold text-base">{title}</h4>
      </div>

      <div className="space-y-2">
        {fields
          .filter(field => field.showWhenEmpty || (field.value !== null && field.value !== undefined && field.value !== ''))
          .map((field, index) => {
            const formattedValue = field.formatter
              ? field.formatter(field.value)
              : displayValue(field.value);

            return (
              <div key={index} className="flex justify-between items-start gap-4 py-1">
                <span className="text-sm text-muted-foreground min-w-[140px]">
                  {field.label}:
                </span>
                <div className="flex items-center gap-2 flex-1 justify-end text-right">
                  <span className={`text-sm ${field.className || ''}`}>
                    {formattedValue}
                  </span>
                  {field.copyable && formattedValue !== 'N/A' && (
                    <button
                      onClick={() => handleCopy(String(field.value))}
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                      title="Copiar"
                    >
                      📋
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {fields.filter(field => field.showWhenEmpty || (field.value !== null && field.value !== undefined && field.value !== '')).length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          Nenhuma informação disponível nesta seção
        </p>
      )}
    </div>
  );
});

interface DataGridProps {
  title: string;
  icon?: LucideIcon;
  iconClassName?: string;
  children: ReactNode;
}

export const DataGrid = React.memo(function DataGrid({
  title,
  icon: Icon,
  iconClassName = '',
  children
}: DataGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`h-5 w-5 ${iconClassName}`} />}
        <h4 className="font-semibold text-base">{title}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
});
