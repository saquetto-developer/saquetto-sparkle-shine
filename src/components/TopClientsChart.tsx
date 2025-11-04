import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface Cliente {
  cliente: string;
  total: number;
  valor: number;
}

interface TopClientsChartProps {
  clientes: Cliente[];
}

export function TopClientsChart({ clientes }: TopClientsChartProps) {
  const maxTotal = Math.max(...clientes.map(c => c.total));

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Top 5 Clientes por Volume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clientes.map((cliente, index) => (
            <div key={cliente.cliente} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <span className="font-medium text-sm truncate max-w-[200px]" title={cliente.cliente}>
                    {cliente.cliente}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{cliente.total} notas</div>
                  <div className="text-xs text-muted-foreground">
                    R$ {cliente.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(cliente.total / maxTotal) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {clientes.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum cliente encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}