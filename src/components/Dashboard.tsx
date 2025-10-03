import { useEffect, useState } from 'react';
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
  Receipt
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { TaxChart } from './TaxChart';
import { StatusChart } from './StatusChart';
import { TopClientsChart } from './TopClientsChart';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { NotasList } from './NotasList';
import { OperationsChart } from './OperationsChart';
import { countByTaxRegime, filterByTaxRegime, type TaxRegime } from '@/lib/taxRegimeUtils';

interface OperationData {
  tipo: string;
  quantidade: number;
  valor: number;
  percentual: number;
}

interface DashboardData {
  totalNotas: number;
  notasAprovadas: number;
  notasReprovadas: number;
  notasAlerta: number;
  valorTotal: number;
  totalIcms: number;
  totalPis: number;
  totalCofins: number;
  totalIpi: number;
  topClientes: Array<{ cliente: string; total: number; valor: number }>;
  monthlyData: Array<{ month: string; count: number }>;
  operacoesPorTipo: OperationData[];
  simplesNacional: number;
  lucroPresumido: number;
  semInformacao: number;
  
  // Dados separados para Saquetto e Clientes
  saquetto: {
    totalNotas: number;
    notasAprovadas: number;
    notasReprovadas: number;
    notasAlerta: number;
    valorTotal: number;
    totalIcms: number;
    totalPis: number;
    totalCofins: number;
    totalIpi: number;
    operacoesPorTipo: OperationData[];
    simplesNacional: number;
    lucroPresumido: number;
    semInformacao: number;
  };
  clientes: {
    totalNotas: number;
    notasAprovadas: number;
    notasReprovadas: number;
    notasAlerta: number;
    valorTotal: number;
    totalIcms: number;
    totalPis: number;
    totalCofins: number;
    totalIpi: number;
    operacoesPorTipo: OperationData[];
    simplesNacional: number;
    lucroPresumido: number;
    semInformacao: number;
  };
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [rawNotasData, setRawNotasData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'notas'>('dashboard');
  const [filterType, setFilterType] = useState<'consolidado' | 'saquetto' | 'clientes'>('consolidado');
  const [taxRegimeFilter, setTaxRegimeFilter] = useState<TaxRegime>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

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
      const saquetoNotas = notasData.filter((n: any) => n.emitente_saquetto === true);
      const clientesNotas = notasData.filter((n: any) => n.emitente_saquetto === false || n.emitente_saquetto === null);

      // Função para extrair primeira palavra da operação
      const extrairTipoOperacao = (naturezaOperacao: string): string => {
        if (!naturezaOperacao) return 'OUTROS';
        
        // Limpar e normalizar
        const cleaned = naturezaOperacao.trim().toUpperCase();
        
        // Extrair primeira palavra
        const primeiraPalavra = cleaned.split(' ')[0];
        
        // Tratar casos especiais
        if (primeiraPalavra.match(/^\d/)) return 'OUTROS'; // Se começar com número
        if (primeiraPalavra.length < 3) return 'OUTROS'; // Se muito curta
        
        return primeiraPalavra;
      };

      // Função para calcular operações por tipo
      const calcularOperacoesPorTipo = (notas: any[]): OperationData[] => {
        const operacoesMap = new Map<string, { quantidade: number; valor: number }>();
        let valorTotalGeral = 0;

        notas.forEach(nota => {
          const tipo = extrairTipoOperacao(nota.natureza_operacao);
          const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
          
          valorTotalGeral += valor;
          
          if (operacoesMap.has(tipo)) {
            const existing = operacoesMap.get(tipo)!;
            operacoesMap.set(tipo, {
              quantidade: existing.quantidade + 1,
              valor: existing.valor + valor
            });
          } else {
            operacoesMap.set(tipo, { quantidade: 1, valor });
          }
        });

        return Array.from(operacoesMap.entries())
          .map(([tipo, stats]) => ({
            tipo,
            quantidade: stats.quantidade,
            valor: stats.valor,
            percentual: valorTotalGeral > 0 ? (stats.quantidade / notas.length) * 100 : 0
          }))
          .sort((a, b) => b.quantidade - a.quantidade);
      };

      // Função para calcular métricas de um conjunto de notas
      const calcularMetricas = (notas: any[]) => {
        const totalNotas = notas.length;
        const notasAprovadas = notas.filter(n => n.situacao === 'Aprovado').length;
        const notasReprovadas = notas.filter(n => n.situacao === 'Reprovado').length;
        const notasAlerta = notas.filter(n => n.situacao === 'Alerta').length;
        
        const valorTotal = notas.reduce((sum, nota) => {
          const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
          return sum + valor;
        }, 0);

        const totalIcms = notas.reduce((sum, nota) => {
          const valor = parseFloat(nota.icms_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
          return sum + valor;
        }, 0);

        const totalPis = notas.reduce((sum, nota) => {
          const valor = parseFloat(nota.pis_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
          return sum + valor;
        }, 0);

        const totalCofins = notas.reduce((sum, nota) => {
          const valor = parseFloat(nota.cofins_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
          return sum + valor;
        }, 0);

        const totalIpi = notas.reduce((sum, nota) => {
          const valor = parseFloat(nota.ipi_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
          return sum + valor;
        }, 0);

        const operacoesPorTipo = calcularOperacoesPorTipo(notas);
        
        // Calculate tax regime counts
        const taxRegimeCounts = countByTaxRegime(notas);

        return {
          totalNotas,
          notasAprovadas,
          notasReprovadas,
          notasAlerta,
          valorTotal,
          totalIcms,
          totalPis,
          totalCofins,
          totalIpi,
          operacoesPorTipo,
          simplesNacional: taxRegimeCounts.simples,
          lucroPresumido: taxRegimeCounts.presumido,
          semInformacao: taxRegimeCounts.sem_informacao
        };
      };

      // Calcular métricas para cada grupo
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
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Auditoria Fiscal
                  </h1>
                  <p className="text-muted-foreground">Dashboard de análise de notas fiscais</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={activeView === 'dashboard' ? 'default' : 'outline'}
                    onClick={() => setActiveView('dashboard')}
                    size="sm"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant={activeView === 'notas' ? 'default' : 'outline'}
                    onClick={() => setActiveView('notas')}
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Notas Fiscais
                  </Button>
                </div>
              </div>
              
              {activeView === 'dashboard' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={filterType === 'consolidado' ? 'default' : 'outline'}
                      onClick={() => setFilterType('consolidado')}
                      size="sm"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Consolidado
                    </Button>
                    <Button 
                      variant={filterType === 'saquetto' ? 'default' : 'outline'}
                      onClick={() => setFilterType('saquetto')}
                      size="sm"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Saquetto Industrial
                      <Badge variant="secondary" className="ml-2">
                        {data?.saquetto.totalNotas || 0}
                      </Badge>
                    </Button>
                    <Button 
                      variant={filterType === 'clientes' ? 'default' : 'outline'}
                      onClick={() => setFilterType('clientes')}
                      size="sm"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Clientes
                      <Badge variant="secondary" className="ml-2">
                        {data?.clientes.totalNotas || 0}
                      </Badge>
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground self-center">Regime Tributário:</span>
                    <Button 
                      variant={taxRegimeFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setTaxRegimeFilter('all')}
                      size="sm"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Todos
                    </Button>
                    <Button 
                      variant={taxRegimeFilter === 'simples' ? 'default' : 'outline'}
                      onClick={() => setTaxRegimeFilter('simples')}
                      size="sm"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Simples Nacional
                    </Button>
                    <Button 
                      variant={taxRegimeFilter === 'presumido' ? 'default' : 'outline'}
                      onClick={() => setTaxRegimeFilter('presumido')}
                      size="sm"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Presumido/Real
                    </Button>
                    <Button 
                      variant={taxRegimeFilter === 'sem_informacao' ? 'default' : 'outline'}
                      onClick={() => setTaxRegimeFilter('sem_informacao')}
                      size="sm"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Sem Informação
                    </Button>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {activeView === 'dashboard' ? (
          <>
            {(() => {
              // Get raw data based on filterType
              const saquetoNotas = rawNotasData.filter((n: any) => n.emitente_saquetto === true);
              const clientesNotas = rawNotasData.filter((n: any) => n.emitente_saquetto === false || n.emitente_saquetto === null);
              
              let selectedRawData = filterType === 'saquetto' ? saquetoNotas : 
                                   filterType === 'clientes' ? clientesNotas : rawNotasData;
              
              // Apply tax regime filter
              const filteredData = filterByTaxRegime(selectedRawData, taxRegimeFilter);
              
              // Calculate metrics with filtered data
              const calcularMetricas = (notas: any[]) => {
                const totalNotas = notas.length;
                const notasAprovadas = notas.filter(n => n.situacao === 'Aprovado').length;
                const notasReprovadas = notas.filter(n => n.situacao === 'Reprovado').length;
                const notasAlerta = notas.filter(n => n.situacao === 'Alerta').length;
                
                const valorTotal = notas.reduce((sum, nota) => {
                  const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
                  return sum + valor;
                }, 0);

                const totalIcms = notas.reduce((sum, nota) => {
                  const valor = parseFloat(nota.icms_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
                  return sum + valor;
                }, 0);

                const totalPis = notas.reduce((sum, nota) => {
                  const valor = parseFloat(nota.pis_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
                  return sum + valor;
                }, 0);

                const totalCofins = notas.reduce((sum, nota) => {
                  const valor = parseFloat(nota.cofins_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
                  return sum + valor;
                }, 0);

                const totalIpi = notas.reduce((sum, nota) => {
                  const valor = parseFloat(nota.ipi_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
                  return sum + valor;
                }, 0);

                const extrairTipoOperacao = (naturezaOperacao: string): string => {
                  if (!naturezaOperacao) return 'OUTROS';
                  const cleaned = naturezaOperacao.trim().toUpperCase();
                  const primeiraPalavra = cleaned.split(' ')[0];
                  if (primeiraPalavra.match(/^\d/)) return 'OUTROS';
                  if (primeiraPalavra.length < 3) return 'OUTROS';
                  return primeiraPalavra;
                };

                const operacoesMap = new Map<string, { quantidade: number; valor: number }>();
                notas.forEach(nota => {
                  const tipo = extrairTipoOperacao(nota.natureza_operacao);
                  const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0');
                  
                  if (operacoesMap.has(tipo)) {
                    const existing = operacoesMap.get(tipo)!;
                    operacoesMap.set(tipo, {
                      quantidade: existing.quantidade + 1,
                      valor: existing.valor + valor
                    });
                  } else {
                    operacoesMap.set(tipo, { quantidade: 1, valor });
                  }
                });

                const operacoesPorTipo = Array.from(operacoesMap.entries())
                  .map(([tipo, stats]) => ({
                    tipo,
                    quantidade: stats.quantidade,
                    valor: stats.valor,
                    percentual: totalNotas > 0 ? (stats.quantidade / notas.length) * 100 : 0
                  }))
                  .sort((a, b) => b.quantidade - a.quantidade);
                
                const taxRegimeCounts = countByTaxRegime(notas);

                return {
                  totalNotas,
                  notasAprovadas,
                  notasReprovadas,
                  notasAlerta,
                  valorTotal,
                  totalIcms,
                  totalPis,
                  totalCofins,
                  totalIpi,
                  operacoesPorTipo,
                  simplesNacional: taxRegimeCounts.simples,
                  lucroPresumido: taxRegimeCounts.presumido,
                  semInformacao: taxRegimeCounts.sem_informacao
                };
              };
              
              const currentData = filteredData.length > 0 ? calcularMetricas(filteredData) : {
                totalNotas: 0,
                notasAprovadas: 0,
                notasReprovadas: 0,
                notasAlerta: 0,
                valorTotal: 0,
                totalIcms: 0,
                totalPis: 0,
                totalCofins: 0,
                totalIpi: 0,
                operacoesPorTipo: [],
                simplesNacional: 0,
                lucroPresumido: 0,
                semInformacao: 0
              };
              
              return (
                <>
                  {/* Métricas Principais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    <MetricCard
                      title="Total de Notas"
                      value={currentData.totalNotas.toLocaleString()}
                      icon={FileText}
                      trend={filterType !== 'consolidado' ? `de ${data.totalNotas.toLocaleString()} total` : "+12% vs mês anterior"}
                      variant="default"
                    />
                    <MetricCard
                      title="Notas Aprovadas"
                      value={currentData.notasAprovadas.toLocaleString()}
                      icon={CheckCircle}
                      trend={`${currentData.totalNotas > 0 ? ((currentData.notasAprovadas / currentData.totalNotas) * 100).toFixed(1) : 0}% do total`}
                      variant="success"
                    />
                    <MetricCard
                      title="Notas com Alerta"
                      value={currentData.notasAlerta.toLocaleString()}
                      icon={AlertTriangle}
                      trend={`${currentData.totalNotas > 0 ? ((currentData.notasAlerta / currentData.totalNotas) * 100).toFixed(1) : 0}% do total`}
                      variant="warning"
                    />
                    <MetricCard
                      title="Notas Reprovadas"
                      value={currentData.notasReprovadas.toLocaleString()}
                      icon={XCircle}
                      trend={`${currentData.totalNotas > 0 ? ((currentData.notasReprovadas / currentData.totalNotas) * 100).toFixed(1) : 0}% do total`}
                      variant="destructive"
                    />
                  </div>

                  {/* Métricas Financeiras */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="sm:col-span-2 lg:col-span-4">
                      <MetricCard
                        title="Valor Total"
                        value={`R$ ${currentData.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        icon={DollarSign}
                        trend={filterType !== 'consolidado' ? `de R$ ${data.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} total` : "+8.5% vs mês anterior"}
                        variant="primary"
                      />
                    </div>
                  </div>

                  {/* Tributos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    <MetricCard
                      title="Total ICMS"
                      value={`R$ ${currentData.totalIcms.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      variant="accent"
                      size="sm"
                    />
                    <MetricCard
                      title="Total PIS"
                      value={`R$ ${currentData.totalPis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      variant="accent"
                      size="sm"
                    />
                    <MetricCard
                      title="Total COFINS"
                      value={`R$ ${currentData.totalCofins.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      variant="accent"
                      size="sm"
                    />
                    <MetricCard
                      title="Total IPI"
                      value={`R$ ${currentData.totalIpi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      variant="accent"
                      size="sm"
                    />
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