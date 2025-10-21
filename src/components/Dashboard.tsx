import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Building2,
  BarChart3,
  Calendar,
  Receipt,
  Download
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { HeroMetricCard } from './HeroMetricCard';
import { InsightsBanner } from './InsightsBanner';
import { TaxChart } from './TaxChart';
import { StatusChart } from './StatusChart';
import { TopClientsChart } from './TopClientsChart';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { NotasList } from './NotasList';
import { OperationsChart } from './OperationsChart';
import { NCMAlertsList } from './NCMAlertsList';
import { filterByTaxRegime, type TaxRegime } from '@/lib/taxRegimeUtils';
import { calcularMetricas, getEmptyMetrics } from '@/lib/dashboardMetrics';
import type { NotaFiscal, DashboardMetrics } from '@/types/notaFiscal';
import { exportToPDF, formatFilename } from '@/lib/pdfExport';
import { toast } from '@/hooks/use-toast';

interface DashboardData extends DashboardMetrics {
  topClientes: Array<{ cliente: string; total: number; valor: number }>;
  monthlyData: Array<{ month: string; count: number }>;
  saquetto: DashboardMetrics;
  clientes: DashboardMetrics;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [rawNotasData, setRawNotasData] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'notas'>('dashboard');
  const [filterType, setFilterType] = useState<'consolidado' | 'saquetto' | 'clientes'>('consolidado');
  const [taxRegimeFilter, setTaxRegimeFilter] = useState<TaxRegime>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCardClick = (situacao: 'Aprovado' | 'Alerta' | 'Reprovado') => {
    navigate(`/notas-fiscais?situacao=${situacao}`);
  };

  const handleExportPDF = async () => {
    try {
      const filename = formatFilename('Dashboard_Saquetto');
      const title = `Dashboard - ${filterType === 'consolidado' ? 'Consolidado' : filterType === 'saquetto' ? 'Saquetto Industrial' : 'Clientes'}`;

      await exportToPDF('dashboard-content', {
        filename,
        title,
        orientation: 'landscape',
        pageSize: 'a4'
      });

      toast({
        title: "PDF gerado com sucesso!",
        description: `O arquivo ${filename}.pdf foi baixado.`,
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o arquivo PDF. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados da tabela saquetto
      const { data: notasData, error } = await supabase
        .from('saquetto')
        .select('*');

      if (error) {
        console.error('Erro ao carregar dados:', error);
        return;
      }

      if (!notasData) return;

      // Store raw data for filtering
      setRawNotasData(notasData);

      // Separar dados por tipo de emitente
      const saquetoNotas = notasData.filter((n: NotaFiscal) => n.emitente_saquetto === true);
      const clientesNotas = notasData.filter((n: NotaFiscal) => n.emitente_saquetto === false || n.emitente_saquetto === null);

      // Calcular métricas para cada grupo usando função importada
      const metricas = calcularMetricas(notasData);
      const metricasSaquetto = calcularMetricas(saquetoNotas);
      const metricasClientes = calcularMetricas(clientesNotas);

      // Top clientes por volume
      const clientesMap = new Map();
      notasData.forEach(nota => {
        const cliente = nota.destinatario_razao_social || nota.emitente_razao_social || 'Cliente não identificado';
        const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
        
        if (clientesMap.has(cliente)) {
          const existing = clientesMap.get(cliente);
          clientesMap.set(cliente, {
            total: existing.total + 1,
            valor: existing.valor + valor
          });
        } else {
          clientesMap.set(cliente, { total: 1, valor });
        }
      });

      const topClientes = Array.from(clientesMap.entries())
        .map(([cliente, stats]) => ({ cliente, ...stats }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      // Dados mensais
      const monthlyMap = new Map();
      notasData.forEach(nota => {
        const date = new Date(nota.data_emissao || nota.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
      });

      const monthlyData = Array.from(monthlyMap.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6); // Últimos 6 meses

      setData({
        ...metricas,
        topClientes,
        monthlyData,
        saquetto: metricasSaquetto,
        clientes: metricasClientes
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="bg-gradient-card shadow-card animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados</h2>
            <p className="text-muted-foreground mb-4">Não foi possível carregar os dados do dashboard.</p>
            <Button onClick={loadDashboardData} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Auditoria Fiscal
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base">Dashboard de análise de notas fiscais</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant={activeView === 'dashboard' ? 'default' : 'outline'}
                    onClick={() => setActiveView('dashboard')}
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={activeView === 'notas' ? 'default' : 'outline'}
                    onClick={() => setActiveView('notas')}
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Notas Fiscais
                  </Button>
                  {activeView === 'dashboard' && (
                    <Button
                      variant="outline"
                      onClick={handleExportPDF}
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Exportar PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </Button>
                  )}
                </div>
              </div>
              
              {activeView === 'dashboard' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                    <Button
                      variant={filterType === 'consolidado' ? 'default' : 'outline'}
                      onClick={() => setFilterType('consolidado')}
                      size="sm"
                      className="w-full sm:w-auto justify-start sm:justify-center"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Consolidado
                    </Button>
                    <Button
                      variant={filterType === 'saquetto' ? 'default' : 'outline'}
                      onClick={() => setFilterType('saquetto')}
                      size="sm"
                      className="w-full sm:w-auto justify-between sm:justify-center"
                    >
                      <span className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Saquetto Industrial
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {data?.saquetto.totalNotas || 0}
                      </Badge>
                    </Button>
                    <Button
                      variant={filterType === 'clientes' ? 'default' : 'outline'}
                      onClick={() => setFilterType('clientes')}
                      size="sm"
                      className="w-full sm:w-auto justify-between sm:justify-center"
                    >
                      <span className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Clientes
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {data?.clientes.totalNotas || 0}
                      </Badge>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">Regime Tributário:</span>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                      <Button
                        variant={taxRegimeFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setTaxRegimeFilter('all')}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Todos
                      </Button>
                      <Button
                        variant={taxRegimeFilter === 'simples' ? 'default' : 'outline'}
                        onClick={() => setTaxRegimeFilter('simples')}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Simples Nacional
                      </Button>
                      <Button
                        variant={taxRegimeFilter === 'presumido' ? 'default' : 'outline'}
                        onClick={() => setTaxRegimeFilter('presumido')}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Presumido/Real
                      </Button>
                      <Button
                        variant={taxRegimeFilter === 'sem_informacao' ? 'default' : 'outline'}
                        onClick={() => setTaxRegimeFilter('sem_informacao')}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Sem Informação
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      <div id="dashboard-content" className="max-w-7xl mx-auto p-6 md:p-8">
        {activeView === 'dashboard' ? (
          <>
            {(() => {
              // Get raw data based on filterType
              const saquetoNotas = rawNotasData.filter((n: NotaFiscal) => n.emitente_saquetto === true);
              const clientesNotas = rawNotasData.filter((n: NotaFiscal) => n.emitente_saquetto === false || n.emitente_saquetto === null);

              const selectedRawData = filterType === 'saquetto' ? saquetoNotas :
                                   filterType === 'clientes' ? clientesNotas : rawNotasData;

              // Apply tax regime filter
              const filteredData = filterByTaxRegime(selectedRawData, taxRegimeFilter);

              // Calculate metrics with filtered data using imported function
              const currentData = filteredData.length > 0 ? calcularMetricas(filteredData) : getEmptyMetrics();
              
              // Generate insights
              const complianceRate = currentData.totalNotas > 0 ? ((currentData.notasAprovadas / currentData.totalNotas) * 100).toFixed(1) : '0';
              const insights = [
                {
                  type: 'success' as const,
                  message: `Compliance: ${complianceRate}% - ${parseFloat(complianceRate) > 90 ? 'Excelente! 🎉' : parseFloat(complianceRate) > 70 ? 'Bom desempenho' : 'Precisa atenção'}`
                },
                ...(currentData.notasAlerta > 0 ? [{
                  type: 'warning' as const,
                  message: `Atenção: ${currentData.notasAlerta} notas precisam de revisão`
                }] : []),
                ...(currentData.notasReprovadas > 0 ? [{
                  type: 'warning' as const,
                  message: `Crítico: ${currentData.notasReprovadas} notas reprovadas`
                }] : [])
              ];

              return (
                <>
                  {/* Hero Card - Valor Total */}
                  <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <HeroMetricCard
                      title="Valor Total"
                      value={`R$ ${currentData.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      subtitle="Volume financeiro processado"
                      trend={{
                        value: "+8.5%",
                        direction: "up"
                      }}
                      sparklineData={data.monthlyData.map(m => m.count)}
                    />
                  </div>

                  {/* Métricas Principais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <MetricCard
                      title="Total de Notas"
                      value={currentData.totalNotas.toLocaleString()}
                      icon={FileText}
                      trend={filterType !== 'consolidado' ? `de ${data.totalNotas.toLocaleString()} total` : "+12% vs mês anterior"}
                      variant="default"
                      sparklineData={data.monthlyData.map(m => m.count)}
                    />
                    <MetricCard
                      title="Notas Aprovadas"
                      value={currentData.notasAprovadas.toLocaleString()}
                      icon={CheckCircle}
                      trend={`${currentData.totalNotas > 0 ? ((currentData.notasAprovadas / currentData.totalNotas) * 100).toFixed(1) : 0}% do total`}
                      variant="success"
                      subtitle="Compliance"
                      onClick={() => handleCardClick('Aprovado')}
                      clickable={true}
                    />
                    <MetricCard
                      title="Notas com Alerta"
                      value={currentData.notasAlerta.toLocaleString()}
                      icon={AlertTriangle}
                      trend={`${currentData.totalNotas > 0 ? ((currentData.notasAlerta / currentData.totalNotas) * 100).toFixed(1) : 0}% do total`}
                      variant="warning"
                      subtitle="Requerem atenção"
                      onClick={() => handleCardClick('Alerta')}
                      clickable={true}
                    />
                    <MetricCard
                      title="Notas Reprovadas"
                      value={currentData.notasReprovadas.toLocaleString()}
                      icon={XCircle}
                      trend={`${currentData.totalNotas > 0 ? ((currentData.notasReprovadas / currentData.totalNotas) * 100).toFixed(1) : 0}% do total`}
                      variant="destructive"
                      subtitle="Não conformes"
                      onClick={() => handleCardClick('Reprovado')}
                      clickable={true}
                    />
                  </div>

                  {/* Insights Banner */}
                  <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <InsightsBanner insights={insights} />
                  </div>

                  {/* NCM Alerts Section */}
                  <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <NCMAlertsList limit={10} />
                  </div>

                  {/* Tax Regime Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                    <MetricCard
                      title="Simples Nacional"
                      value={currentData.simplesNacional.toLocaleString()}
                      icon={Receipt}
                      trend={`${currentData.totalNotas > 0 ? ((currentData.simplesNacional / currentData.totalNotas) * 100).toFixed(1) : 0}% do total`}
                      variant="success"
                    />
                    <MetricCard
                      title="Lucro Presumido/Real"
                      value={currentData.lucroPresumido.toLocaleString()}
                      icon={Receipt}
                      trend={`${currentData.totalNotas > 0 ? ((currentData.lucroPresumido / currentData.totalNotas) * 100).toFixed(1) : 0}% do total`}
                      variant="primary"
                    />
                    <MetricCard
                      title="Sem Informação"
                      value={currentData.semInformacao.toLocaleString()}
                      icon={Receipt}
                      trend={`${currentData.totalNotas > 0 ? ((currentData.semInformacao / currentData.totalNotas) * 100).toFixed(1) : 0}% do total`}
                      variant="default"
                    />
                  </div>

                  {/* Gráficos */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="w-full">
                      <StatusChart 
                        aprovadas={currentData.notasAprovadas} 
                        reprovadas={currentData.notasReprovadas}
                        alertas={currentData.notasAlerta}
                      />
                    </div>
                    <div className="w-full">
                      <TaxChart 
                        icms={currentData.totalIcms}
                        pis={currentData.totalPis}
                        cofins={currentData.totalCofins}
                        ipi={currentData.totalIpi}
                      />
                    </div>
                  </div>

                  {/* Operações por Tipo */}
                  <div className="mb-6 md:mb-8">
                    <OperationsChart operacoes={currentData.operacoesPorTipo} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="w-full">
                      <TopClientsChart clientes={data.topClientes} />
                    </div>
                    <div className="w-full">
                      <MonthlyTrendChart data={data.monthlyData} />
                    </div>
                  </div>
                </>
              );
            })()}
          </>
        ) : (
          <NotasList 
            filterBySaquetto={filterType === 'saquetto' ? true : filterType === 'clientes' ? false : undefined}
            filterByTaxRegime={taxRegimeFilter}
          />
        )}
      </div>
    </div>
  );
}