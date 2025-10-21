import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertTriangle, ExternalLink, PackageX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NCMAlert {
  id: number;
  numero_nfe: string | null;
  destinatario_razao_social: string | null;
  descricao_produto: string | null;
  ncm: string | null;
  explicacao: string | null;
  situacao: string | null;
  data_emissao: string | null;
  valor_total_nfe: string | null;
}

interface NCMAlertsListProps {
  limit?: number;
}

export function NCMAlertsList({ limit = 10 }: NCMAlertsListProps) {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<NCMAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalNCMAlerts, setTotalNCMAlerts] = useState(0);

  useEffect(() => {
    loadNCMAlerts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNCMAlerts = async () => {
    try {
      setLoading(true);

      // Buscar notas com alertas ou reprovações que mencionam NCM
      const { data, error, count } = await supabase
        .from('saquetto')
        .select('id, numero_nfe, destinatario_razao_social, descricao_produto, ncm, explicacao, situacao, data_emissao, valor_total_nfe', { count: 'exact' })
        .in('situacao', ['Alerta', 'Reprovado'])
        .not('explicacao', 'is', null)
        .ilike('explicacao', '%ncm%')
        .order('data_emissao', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setAlerts(data || []);
      setTotalNCMAlerts(count || 0);
    } catch (error) {
      console.error('Erro ao carregar alertas de NCM:', error);
      setAlerts([]);
      setTotalNCMAlerts(0);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (notaId: number) => {
    navigate(`/notas-fiscais?notaId=${notaId}`);
  };

  const handleViewAllNCMAlerts = () => {
    navigate('/erros-alertas?tipo=NCM Inválido');
  };

  if (loading) {
    return (
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning animate-pulse" />
            Alertas Críticos de NCM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se não houver alertas, retorna null ou mensagem
  if (alerts.length === 0) {
    return null; // Não exibe o card se não houver alertas
  }

  return (
    <Card className="border-warning/50 bg-warning/5 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alertas Críticos de NCM
            <Badge variant="destructive" className="ml-2">
              {totalNCMAlerts}
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllNCMAlerts}
            className="gap-2"
          >
            Ver Todos
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Notas fiscais com problemas de classificação NCM detectados
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-warning/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-warning/10 hover:bg-warning/15">
                <TableHead className="w-[100px]">NFe</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="w-[100px]">NCM</TableHead>
                <TableHead className="hidden md:table-cell">Erro Detectado</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow
                  key={alert.id}
                  className="hover:bg-warning/5 transition-colors"
                >
                  <TableCell className="font-mono text-xs">
                    {alert.numero_nfe || 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate text-sm">
                    {alert.destinatario_razao_social || 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">
                    <div className="flex items-center gap-2">
                      <PackageX className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      {alert.descricao_produto || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold">
                    {alert.ncm || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[250px]">
                    <p className="text-xs text-destructive truncate" title={alert.explicacao || ''}>
                      {alert.explicacao || 'Sem descrição'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alert.situacao === 'Reprovado' ? 'destructive' : 'secondary'
                      }
                      className={
                        alert.situacao === 'Alerta'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : ''
                      }
                    >
                      {alert.situacao}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(alert.id)}
                      className="h-8 px-2 text-xs"
                    >
                      Ver Nota
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalNCMAlerts > limit && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Mostrando {alerts.length} de {totalNCMAlerts} alertas de NCM
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAllNCMAlerts}
              className="gap-2"
            >
              Ver Todos os Alertas de NCM
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
