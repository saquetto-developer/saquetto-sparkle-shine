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
  Filter,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  Building2,
  ReceiptText,
  Clock
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import RelatorioTabs from '@/components/RelatorioTabs'
import RelatorioProdutos from '@/components/RelatorioProdutos'
import RelatorioClientes from '@/components/RelatorioClientes'
import RelatorioGeografico from '@/components/RelatorioGeografico'
import RelatorioTendencias from '@/components/RelatorioTendencias'
import { exportToPDF, formatFilename } from '@/lib/pdfExport'

interface RelatorioData {
  faturamentoMensal: Array<{ mes: string; valor: number; quantidade: number }>
  impostosPorTipo: Array<{ tipo: string; valor: number; cor: string }>
  topProdutos: Array<{ produto: string; quantidade: number; valor: number }>
  naturezasOperacao: Array<{ natureza: string; quantidade: number; valor: number }>
  statusDistribuicao: Array<{ status: string; quantidade: number; percentual: number }>
  topClientes: Array<{ cliente: string; total: number; valor: number }>
  cidadesEmissao: Array<{ cidade: string; quantidade: number; valor: number }>
  tendenciasSemanal: Array<{ semana: string; quantidade: number; valor: number }>
  // Novas métricas para auditor fiscal
  variacaoMensal: number
  notasDivergencias: number
  percentualDivergencias: number
  taxaConformidade: number
  topFornecedores: Array<{ fornecedor: string; total: number; valor: number }>
  analiseICMS: Array<{ aliquota: string; quantidade: number; valor: number }>
  tempoMedioAuditoria: number
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent-2))', 'hsl(var(--accent-3))', 'hsl(var(--accent-4))', 'hsl(var(--accent-5))']

// Cores semânticas por status
const STATUS_COLORS = {
  Aprovado: '#22c55e',    // Verde
  Alerta: '#eab308',      // Amarelo
  Reprovado: '#ef4444'    // Vermelho
}

export default function Relatorios() {
  const [data, setData] = useState<RelatorioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtroAno, setFiltroAno] = useState<string>('2025')
  const [tipoRelatorio, setTipoRelatorio] = useState<'mensal' | 'trimestral' | 'anual'>('mensal')
  const [anosDisponiveis, setAnosDisponiveis] = useState<string[]>(['2025'])

  useEffect(() => {
    fetchAnosDisponiveis()
  }, [])

  useEffect(() => {
    fetchRelatorioData()
  }, [filtroAno, tipoRelatorio])

  const fetchAnosDisponiveis = async () => {
    try {
      const { data: notasData, error } = await supabase
        .from('saquetto')
        .select('data_emissao, created_at')
        .not('data_emissao', 'is', null)
        
      if (error) throw error
      
      if (notasData) {
        const anos = new Set<string>()
        notasData.forEach(nota => {
          const dataString = nota.data_emissao || nota.created_at
          if (dataString) {
            // Extrair o ano da data ISO ou formatada
            const ano = new Date(dataString).getFullYear().toString()
            if (!isNaN(parseInt(ano))) {
              anos.add(ano)
            }
          }
        })
        
        const anosOrdenados = Array.from(anos).sort((a, b) => parseInt(b) - parseInt(a))
        setAnosDisponiveis(anosOrdenados)
        
        // Se 2025 não estiver disponível mas houver dados, usar o ano mais recente
        if (!anosOrdenados.includes('2025') && anosOrdenados.length > 0) {
          setFiltroAno(anosOrdenados[0])
        }
      }
    } catch (error) {
      console.error('Erro ao buscar anos disponíveis:', error)
    }
  }

  const fetchRelatorioData = async () => {
    try {
      setLoading(true)
      
      console.log('Buscando dados para o ano:', filtroAno)
      
      // Buscar dados com filtro mais flexível
      const { data: notasData, error } = await supabase
        .from('saquetto')
        .select('*')
        
      if (error) throw error

      if (!notasData) {
        console.log('Nenhum dado encontrado')
        return
      }
      
      console.log('Total de registros encontrados:', notasData.length)
      
      // Filtrar no cliente por ano
      const notasFiltradas = notasData.filter(nota => {
        const dataString = nota.data_emissao || nota.created_at
        if (!dataString) return false
        
        const data = new Date(dataString)
        const ano = data.getFullYear().toString()
        return ano === filtroAno
      })
      
      console.log('Registros após filtro por ano:', notasFiltradas.length)

      // Faturamento Mensal
      const faturamentoMap = new Map()
      notasFiltradas.forEach(nota => {
        const dataString = nota.data_emissao || nota.created_at
        if (!dataString) return
        
        const data = new Date(dataString)
        const mesKey = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
        const valorString = nota.valor_total_nfe || '0'
        const valor = parseFloat(valorString.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
        
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

      let faturamentoMensal = Array.from(faturamentoMap.entries())
        .sort(([mesA], [mesB]) => mesA.localeCompare(mesB)) // Ordenar por mesKey (YYYY-MM) ANTES de formatar
        .map(([mes, stats]) => {
          const data = new Date(mes + '-01')
          const mesFormatado = data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
          const mesCapitalizado = mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1).replace(/\./g, '')

          return {
            mesKey: mes, // Manter mesKey para agregação posterior
            mes: mesCapitalizado,
            valor: stats.valor,
            quantidade: stats.quantidade
          }
        })

      // Aplicar agregação por tipo de relatório
      if (tipoRelatorio === 'trimestral') {
        const trimestreMap = new Map()
        faturamentoMensal.forEach(item => {
          const [ano, mes] = item.mesKey.split('-')
          const trimestre = Math.ceil(parseInt(mes) / 3)
          const trimestreKey = `${ano}-Q${trimestre}`

          if (trimestreMap.has(trimestreKey)) {
            const existing = trimestreMap.get(trimestreKey)
            trimestreMap.set(trimestreKey, {
              valor: existing.valor + item.valor,
              quantidade: existing.quantidade + item.quantidade
            })
          } else {
            trimestreMap.set(trimestreKey, {
              valor: item.valor,
              quantidade: item.quantidade
            })
          }
        })

        faturamentoMensal = Array.from(trimestreMap.entries()).map(([key, stats]) => ({
          mesKey: key,
          mes: key,
          valor: stats.valor,
          quantidade: stats.quantidade
        }))
      } else if (tipoRelatorio === 'anual') {
        const anoMap = new Map()
        faturamentoMensal.forEach(item => {
          const ano = item.mesKey.split('-')[0]

          if (anoMap.has(ano)) {
            const existing = anoMap.get(ano)
            anoMap.set(ano, {
              valor: existing.valor + item.valor,
              quantidade: existing.quantidade + item.quantidade
            })
          } else {
            anoMap.set(ano, {
              valor: item.valor,
              quantidade: item.quantidade
            })
          }
        })

        faturamentoMensal = Array.from(anoMap.entries()).map(([key, stats]) => ({
          mesKey: key,
          mes: key,
          valor: stats.valor,
          quantidade: stats.quantidade
        }))
      }

      // Impostos por Tipo
      const impostos = {
        ICMS: notasFiltradas.reduce((sum, n) => sum + (parseFloat(n.icms_valor?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0), 0),
        PIS: notasFiltradas.reduce((sum, n) => sum + (parseFloat(n.pis_valor?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0), 0),
        COFINS: notasFiltradas.reduce((sum, n) => sum + (parseFloat(n.cofins_valor?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0), 0),
        IPI: notasFiltradas.reduce((sum, n) => sum + (parseFloat(n.ipi_valor?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0), 0)
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
      notasFiltradas.forEach(nota => {
        const produto = nota.descricao_produto || 'Produto não identificado'
        const valor = parseFloat(nota.valor_total_produto?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0
        const quantidade = parseFloat(nota.quantidade?.replace(/[^\d,.-]/g, '').replace(',', '.') || '1') || 1
        
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
      notasFiltradas.forEach(nota => {
        const natureza = nota.natureza_operacao?.split(' ')[0] || 'OUTROS'
        const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0
        
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
        Aprovado: notasFiltradas.filter(n => n.situacao === 'Aprovado').length,
        Alerta: notasFiltradas.filter(n => n.situacao === 'Alerta').length,
        Reprovado: notasFiltradas.filter(n => n.situacao === 'Reprovado').length
      }

      const total = Object.values(statusCount).reduce((a, b) => a + b, 0)
      const statusDistribuicao = Object.entries(statusCount).map(([status, quantidade]) => ({
        status,
        quantidade,
        percentual: total > 0 ? (quantidade / total) * 100 : 0
      }))

      // Top Clientes por Valor
      const clientesMap = new Map()
      notasFiltradas.forEach(nota => {
        const cliente = nota.destinatario_razao_social || nota.emitente_razao_social || 'Cliente não identificado'
        const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0
        
        if (clientesMap.has(cliente)) {
          const existing = clientesMap.get(cliente)
          clientesMap.set(cliente, {
            total: existing.total + 1,
            valor: existing.valor + valor
          })
        } else {
          clientesMap.set(cliente, { total: 1, valor })
        }
      })

      const topClientes = Array.from(clientesMap.entries())
        .map(([cliente, stats]) => ({
          cliente: cliente.substring(0, 50) + (cliente.length > 50 ? '...' : ''),
          total: stats.total,
          valor: stats.valor
        }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 10)

      // Cidades que mais emitem notas
      const cidadesMap = new Map()
      notasFiltradas.forEach(nota => {
        const endereco = nota.emitente_endereco || ''
        // Extrair cidade do endereço usando regex
        const cidadeMatch = endereco.match(/([A-ZÁÊÔÇÀÚÍ\s]+)\s*-\s*[A-Z]{2}/)
        const cidade = cidadeMatch ? cidadeMatch[1].trim() : 'Cidade não identificada'
        const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0
        
        if (cidadesMap.has(cidade)) {
          const existing = cidadesMap.get(cidade)
          cidadesMap.set(cidade, {
            quantidade: existing.quantidade + 1,
            valor: existing.valor + valor
          })
        } else {
          cidadesMap.set(cidade, { quantidade: 1, valor })
        }
      })

      const cidadesEmissao = Array.from(cidadesMap.entries())
        .map(([cidade, stats]) => ({
          cidade,
          quantidade: stats.quantidade,
          valor: stats.valor
        }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5)

      // Tendências Semanais (últimas 12 semanas)
      const semanasMap = new Map()
      notasFiltradas.forEach(nota => {
        const dataString = nota.data_emissao || nota.created_at
        if (!dataString) return
        
        const data = new Date(dataString)
        const inicioSemana = new Date(data)
        inicioSemana.setDate(data.getDate() - data.getDay())
        
        const semanaKey = inicioSemana.toISOString().split('T')[0]
        const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0
        
        if (semanasMap.has(semanaKey)) {
          const existing = semanasMap.get(semanaKey)
          semanasMap.set(semanaKey, {
            quantidade: existing.quantidade + 1,
            valor: existing.valor + valor
          })
        } else {
          semanasMap.set(semanaKey, { quantidade: 1, valor })
        }
      })

      const tendenciasSemanal = Array.from(semanasMap.entries())
        .map(([semana, stats]) => ({
          semana: new Date(semana).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          quantidade: stats.quantidade,
          valor: stats.valor
        }))
        .sort((a, b) => a.semana.localeCompare(b.semana))
        .slice(-12) // Últimas 12 semanas

      // === NOVAS MÉTRICAS PARA AUDITOR FISCAL ===

      // 1. Comparativo Período Anterior (MoM - Month over Month)
      const mesAtual = faturamentoMensal[faturamentoMensal.length - 1]
      const mesAnterior = faturamentoMensal[faturamentoMensal.length - 2]
      const variacaoMensal = mesAnterior && mesAnterior.valor > 0
        ? ((mesAtual?.valor || 0) - mesAnterior.valor) / mesAnterior.valor * 100
        : 0

      // 2. Notas com Divergências (Alertas)
      const notasDivergencias = notasFiltradas.filter(n => n.situacao === 'Alerta').length
      const percentualDivergencias = notasFiltradas.length > 0
        ? (notasDivergencias / notasFiltradas.length) * 100
        : 0

      // 3. Taxa de Conformidade Fiscal (aprovadas sem ressalvas)
      const notasConformes = notasFiltradas.filter(n => n.situacao === 'Aprovado').length
      const taxaConformidade = notasFiltradas.length > 0
        ? (notasConformes / notasFiltradas.length) * 100
        : 0

      // 4. Top 5 Fornecedores por Volume
      const fornecedoresMap = new Map()
      notasFiltradas.forEach(nota => {
        const fornecedor = nota.emitente_razao_social || 'Fornecedor não identificado'
        const valor = parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0

        if (fornecedoresMap.has(fornecedor)) {
          const existing = fornecedoresMap.get(fornecedor)
          fornecedoresMap.set(fornecedor, {
            total: existing.total + 1,
            valor: existing.valor + valor
          })
        } else {
          fornecedoresMap.set(fornecedor, { total: 1, valor })
        }
      })

      const topFornecedores = Array.from(fornecedoresMap.entries())
        .map(([fornecedor, stats]) => ({
          fornecedor: fornecedor.substring(0, 40) + (fornecedor.length > 40 ? '...' : ''),
          total: stats.total,
          valor: stats.valor
        }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5)

      // 5. Análise ICMS Detalhada
      const icmsPorAliquota = new Map()
      notasFiltradas.forEach(nota => {
        const aliquota = nota.icms_aliquota || 'Não informado'
        const valor = parseFloat(nota.icms_valor?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0') || 0

        if (icmsPorAliquota.has(aliquota)) {
          const existing = icmsPorAliquota.get(aliquota)
          icmsPorAliquota.set(aliquota, {
            quantidade: existing.quantidade + 1,
            valor: existing.valor + valor
          })
        } else {
          icmsPorAliquota.set(aliquota, { quantidade: 1, valor })
        }
      })

      const analiseICMS = Array.from(icmsPorAliquota.entries())
        .map(([aliquota, stats]) => ({
          aliquota,
          quantidade: stats.quantidade,
          valor: stats.valor
        }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5)

      // 6. Tempo Médio de Auditoria (em horas) - Usando apenas created_at por enquanto
      const notasComTempo = notasFiltradas.filter(n => n.created_at)
      const tempoMedioAuditoria = 0 // Calculado quando tivermos campo updated_at na tabela

      setData({
        faturamentoMensal,
        impostosPorTipo,
        topProdutos,
        naturezasOperacao,
        statusDistribuicao,
        topClientes,
        cidadesEmissao,
        tendenciasSemanal,
        // Novas métricas
        variacaoMensal,
        notasDivergencias,
        percentualDivergencias,
        taxaConformidade,
        topFornecedores,
        analiseICMS,
        tempoMedioAuditoria
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

  const handleExportPDF = async () => {
    try {
      const filename = formatFilename(`Relatorio_Fiscal_${filtroAno}`);
      const title = `Relatório Fiscal ${filtroAno} - ${tipoRelatorio.charAt(0).toUpperCase() + tipoRelatorio.slice(1)}`;

      await exportToPDF('relatorios-content', {
        filename,
        title,
        orientation: 'portrait',
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
              {anosDisponiveis.map(ano => (
                <SelectItem key={ano} value={ano}>{ano}</SelectItem>
              ))}
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

        <div className="flex gap-2">
          <Button onClick={exportarRelatorio} variant="outline" className="w-fit">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>

          <Button onClick={handleExportPDF} className="w-fit">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>

      {data && (
        <div id="relatorios-content">
          <RelatorioTabs
            data={data}
            formatCurrency={formatCurrency}
          >
            {{
              visaoGeral: (
                <div className="space-y-6">
                {/* Métricas Principais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-transparent transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                      <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(data.faturamentoMensal.reduce((acc, item) => acc + item.valor, 0))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data.faturamentoMensal.reduce((acc, item) => acc + item.quantidade, 0)} notas processadas
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-transparent transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Impostos</CardTitle>
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(data.impostosPorTipo.reduce((acc, item) => acc + item.valor, 0))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ICMS, PIS, COFINS e IPI
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-transparent transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Taxa Aprovação</CardTitle>
                      <FileText className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-success">
                        {data.statusDistribuicao.find(s => s.status === 'Aprovado')?.percentual.toFixed(1) || 0}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Notas aprovadas
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500/10 to-transparent transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
                      <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {data.topProdutos.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Produtos diferentes movimentados
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Métricas Adicionais para Auditor Fiscal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-primary/5 to-transparent transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Variação Mensal</CardTitle>
                      {data.variacaoMensal >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-success animate-pulse" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-destructive animate-pulse" />
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold transition-colors ${data.variacaoMensal >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {data.variacaoMensal >= 0 ? '+' : ''}{data.variacaoMensal.toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        vs. período anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-500/5 to-transparent transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Notas com Alertas</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">
                        {data.notasDivergencias}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data.percentualDivergencias.toFixed(1)}% do total
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/5 to-transparent transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Taxa de Conformidade</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-success">
                        {data.taxaConformidade.toFixed(1)}%
                      </div>
                      <p className={`text-xs ${data.taxaConformidade >= 95 ? 'text-success' : 'text-yellow-600'} font-medium`}>
                        {data.taxaConformidade >= 95 ? '✓ Dentro da meta' : '⚠ Abaixo da meta (95%)'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Top Fornecedor</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold truncate">
                        {data.topFornecedores[0]?.fornecedor.substring(0, 20) || 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(data.topFornecedores[0]?.valor || 0)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Alíquota ICMS Comum</CardTitle>
                      <ReceiptText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data.analiseICMS[0]?.aliquota || 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data.analiseICMS[0]?.quantidade || 0} notas
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tempo Médio Auditoria</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data.tempoMedioAuditoria < 24
                          ? `${data.tempoMedioAuditoria.toFixed(1)}h`
                          : `${(data.tempoMedioAuditoria / 24).toFixed(1)}d`
                        }
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Por nota fiscal
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
                        <Bar dataKey="valor" fill="hsl(var(--primary))" />
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
                        {data.statusDistribuicao.map((item) => {
                          const cor = STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || COLORS[0]
                          return (
                            <div key={item.status} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded transition-all duration-300"
                                  style={{ backgroundColor: cor }}
                                />
                                <span className="text-sm font-medium">{item.status}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold" style={{ color: cor }}>
                                  {item.quantidade}
                                </div>
                                <div className="text-xs text-muted-foreground">{item.percentual.toFixed(1)}%</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
            produtos: (
              <RelatorioProdutos 
                produtos={data.topProdutos} 
                formatCurrency={formatCurrency} 
              />
            ),
            clientes: (
              <RelatorioClientes 
                clientes={data.topClientes} 
                formatCurrency={formatCurrency} 
              />
            ),
            tendencias: (
              <RelatorioTendencias 
                tendenciasSemanal={data.tendenciasSemanal}
                faturamentoMensal={data.faturamentoMensal}
                formatCurrency={formatCurrency} 
              />
            )
          }}
          </RelatorioTabs>
        </div>
      )}
    </div>
  )
}