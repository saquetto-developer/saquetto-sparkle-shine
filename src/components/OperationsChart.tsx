import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Truck, 
  RotateCcw, 
  Package, 
  ArrowRightLeft,
  Building,
  FileText,
  MoreHorizontal
} from 'lucide-react';

interface OperationData {
  tipo: string;
  quantidade: number;
  valor: number;
  percentual: number;
}

interface OperationsChartProps {
  operacoes: OperationData[];
}

const getOperationIcon = (tipo: string) => {
  const lowerTipo = tipo.toLowerCase();
  
  if (lowerTipo.includes('venda')) return ShoppingCart;
  if (lowerTipo.includes('remessa')) return Truck;
  if (lowerTipo.includes('devolução') || lowerTipo.includes('devolucao')) return RotateCcw;
  if (lowerTipo.includes('transferência') || lowerTipo.includes('transferencia')) return ArrowRightLeft;
  if (lowerTipo.includes('compra')) return Package;
  if (lowerTipo.includes('industrialização') || lowerTipo.includes('industrializacao')) return Building;
  
  return FileText;
};

const getOperationColor = (index: number) => {
  const colors = [
    'bg-blue-500/10 text-blue-600 border-blue-200',
    'bg-green-500/10 text-green-600 border-green-200',
    'bg-orange-500/10 text-orange-600 border-orange-200',
    'bg-purple-500/10 text-purple-600 border-purple-200',
    'bg-red-500/10 text-red-600 border-red-200',
    'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    'bg-cyan-500/10 text-cyan-600 border-cyan-200',
    'bg-pink-500/10 text-pink-600 border-pink-200',
  ];
  
  return colors[index % colors.length];
};

export function OperationsChart({ operacoes }: OperationsChartProps) {
  if (!operacoes || operacoes.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Operações por Tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhuma operação encontrada
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalOperacoes = operacoes.reduce((sum, op) => sum + op.quantidade, 0);

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Operações por Tipo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {operacoes.slice(0, 6).map((operacao, index) => {
            const Icon = getOperationIcon(operacao.tipo);
            const colorClass = getOperationColor(index);
            
            return (
              <div
                key={operacao.tipo}
                className={`p-4 rounded-lg border ${colorClass} transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  <Badge variant="secondary" className="text-xs">
                    {operacao.percentual.toFixed(1)}%
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-sm mb-1 capitalize">
                  {operacao.tipo.toLowerCase()}
                </h3>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Notas:</span>
                    <span className="font-medium">{operacao.quantidade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-medium">
                      R$ {operacao.valor.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {operacoes.length > 6 && (
            <div className="p-4 rounded-lg border bg-muted/10 text-muted-foreground border-muted-foreground/20 transition-all hover:shadow-md flex items-center justify-center">
              <div className="text-center">
                <MoreHorizontal className="w-5 h-5 mx-auto mb-2" />
                <span className="text-sm">
                  +{operacoes.length - 6} outros tipos
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total de operações:</span>
            <span className="font-semibold">{totalOperacoes} notas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}