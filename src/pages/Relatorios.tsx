import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Download,
  Filter
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface RelatorioData {
  faturamentoMensal: Array<{ mes: string; valor: number; quantidade: number }>
  impostosPorTipo: Array<{ tipo: string; valor: number; cor: string }>
  topProdutos: Array<{ produto: string; quantidade: number; valor: number }>
  naturezasOperacao: Array<{ natureza: string; quantidade: number; valor: number }>
  statusDistribuicao: Array<{ status: string; quantidade: number; percentual: number }>
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1']

export default function Relatorios() {
  const [data, setData] = useState<RelatorioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtroAno, setFiltroAno] = useState<string>('2024')
  const [tipoRelatorio, setTipoRelatorio] = useState<'mensal' | 'trimestral' | 'anual'>('mensal')

  useEffect(() => {
    fetchRelatorioData()
  }, [filtroAno, tipoRelatorio])

  const fetchRelatorioData = async () => {
    try {
      setLoading(true)
      
      const { data: notasData, error } = await supabase
        .from('saquetto')
        .select('*')
        .gte('data_emissao', `${filtroAno}-01-01`)
        .lte('data_emissao', `${filtroAno}-12-31`)

      if (error) throw error

      if (!notasData) return

      // Faturamento Mensal
      const faturamentoMap = new Map()
      notasData.forEach(nota => {
        const data = new Date(nota.data_emissao || nota.created_at)
        const mesKey = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
        const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0')
        
        if (faturamentoMap.has(mesKey)) {
          const existing = faturamentoMap.get(mesKey)
          faturamentoMap.set(mesKey, {
            valor: existing.valor + valor,
            quantidade: existing.quantidade + 1
          })
        } else {
          faturamentoMap.set(mesKey, { valor, quantidade: 1 })
        }
      })

      const faturamentoMensal = Array.from(faturamentoMap.entries())
        .map(([mes, stats]) => ({
          mes: new Date(mes + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          valor: stats.valor,
          quantidade: stats.quantidade
        }))
        .sort((a, b) => a.mes.localeCompare(b.mes))

      // Impostos por Tipo
      const impostos = {
        ICMS: notasData.reduce((sum, n) => sum + parseFloat(n.icms_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'), 0),
        PIS: notasData.reduce((sum, n) => sum + parseFloat(n.pis_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'), 0),
        COFINS: notasData.reduce((sum, n) => sum + parseFloat(n.cofins_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'), 0),
        IPI: notasData.reduce((sum, n) => sum + parseFloat(n.ipi_valor?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'), 0)
      }

      const impostosPorTipo = Object.entries(impostos)
        .map(([tipo, valor], index) => ({
          tipo,
          valor,
          cor: COLORS[index] || '#8884d8'
        }))
        .filter(item => item.valor > 0)

      // Top Produtos
      const produtosMap = new Map()
      notasData.forEach(nota => {
        const produto = nota.descricao_produto || 'Produto não identificado'
        const valor = parseFloat(nota.valor_total_produto?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0')
        const quantidade = parseFloat(nota.quantidade?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '1')
        
        if (produtosMap.has(produto)) {
          const existing = produtosMap.get(produto)
          produtosMap.set(produto, {
            quantidade: existing.quantidade + quantidade,
            valor: existing.valor + valor
          })
        } else {
          produtosMap.set(produto, { quantidade, valor })
        }
      })

      const topProdutos = Array.from(produtosMap.entries())
        .map(([produto, stats]) => ({
          produto: produto.substring(0, 30) + (produto.length > 30 ? '...' : ''),
          quantidade: stats.quantidade,
          valor: stats.valor
        }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 10)

      // Naturezas de Operação
      const naturezasMap = new Map()
      notasData.forEach(nota => {
        const natureza = nota.natureza_operacao?.split(' ')[0] || 'OUTROS'
        const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0')
        
        if (naturezasMap.has(natureza)) {
          const existing = naturezasMap.get(natureza)
          naturezasMap.set(natureza, {
            quantidade: existing.quantidade + 1,
            valor: existing.valor + valor
          })
        } else {
          naturezasMap.set(natureza, { quantidade: 1, valor })
        }
      })

      const naturezasOperacao = Array.from(naturezasMap.entries())
        .map(([natureza, stats]) => ({
          natureza,
          quantidade: stats.quantidade,
          valor: stats.valor
        }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 8)

      // Status Distribution
      const statusCount = {
        Aprovado: notasData.filter(n => n.situacao === 'Aprovado').length,
        Alerta: notasData.filter(n => n.situacao === 'Alerta').length,
        Reprovado: notasData.filter(n => n.situacao === 'Reprovado').length
      }

      const total = Object.values(statusCount).reduce((a, b) => a + b, 0)
      const statusDistribuicao = Object.entries(statusCount).map(([status, quantidade]) => ({
        status,
        quantidade,
        percentual: total > 0 ? (quantidade / total) * 100 : 0
      }))

      setData({
        faturamentoMensal,
        impostosPorTipo,
        topProdutos,
        naturezasOperacao,
        statusDistribuicao
      })

    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados dos relatórios",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const exportarRelatorio = () => {
    if (!data) return
    
    // Criar CSV simples dos dados
    const csvContent = [
      'Relatório de Notas Fiscais',
      '',
      'Faturamento Mensal:',
      'Mês,Valor,Quantidade',
      ...data.faturamentoMensal.map(item => `${item.mes},${item.valor},${item.quantidade}`),
      '',
      'Top Produtos:',
      'Produto,Quantidade,Valor',
      ...data.topProdutos.map(item => `${item.produto},${item.quantidade},${item.valor}`)
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio-fiscal-${filtroAno}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Sucesso",
      description: "Relatório exportado com sucesso",
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Relatórios Fiscais</h1>
        <p className="text-muted-foreground">
          Análises detalhadas e relatórios gerenciais do sistema fiscal
        </p>
      </div>

      {/* Filtros e Ações */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Select value={filtroAno} onValueChange={setFiltroAno}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tipoRelatorio} onValueChange={(value: 'mensal' | 'trimestral' | 'anual') => setTipoRelatorio(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportarRelatorio} className="w-fit">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.faturamentoMensal.reduce((acc, item) => acc + item.valor, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.faturamentoMensal.reduce((acc, item) => acc + item.quantidade, 0)} notas processadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Impostos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.impostosPorTipo.reduce((acc, item) => acc + item.valor, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  ICMS, PIS, COFINS e IPI
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa Aprovação</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.statusDistribuicao.find(s => s.status === 'Aprovado')?.percentual.toFixed(1) || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Notas aprovadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.topProdutos.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Produtos diferentes movimentados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Faturamento Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Faturamento Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.faturamentoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Valor']}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Bar dataKey="valor" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráficos de Pizza - Impostos e Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Impostos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.impostosPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, valor }) => `${tipo}: ${formatCurrency(valor)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {data.impostosPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.statusDistribuicao.map((item, index) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="font-medium">{item.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.quantidade}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.percentual.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Produtos por Valor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.topProdutos} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="produto" type="category" width={120} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Valor']}
                  />
                  <Bar dataKey="valor" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Naturezas de Operação */}
          <Card>
            <CardHeader>
              <CardTitle>Operações por Natureza</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.naturezasOperacao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="natureza" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'valor' ? formatCurrency(Number(value)) : value,
                      name === 'valor' ? 'Valor' : 'Quantidade'
                    ]}
                  />
                  <Bar dataKey="quantidade" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}