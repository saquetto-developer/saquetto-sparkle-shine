import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, FileText, Calendar, Filter, Download, Receipt, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { getPublicInvoiceUrl } from '@/lib/invoiceStorage'
import { filterByTaxRegime, getTaxRegimeShortLabel, type TaxRegime } from '@/lib/taxRegimeUtils'
import { StatusChangeForm } from '@/components/StatusChangeForm'
import { NotaFiscalTabs } from '@/components/NotaFiscalTabs'
import { getStatusHistory, type StatusHistoryEntry } from '@/lib/statusUpdate'
import { formatCFOP } from '@/lib/notaFiscalFormatters'

interface NotaFiscal {
  // All 89 fields from database
  id: number
  numero_nfe: string | null
  serie: string | null
  modelo: string | null
  chave_acesso: string | null
  ambiente: string | null
  data_emissao: string | null
  data_autorizacao: string | null
  finalidade_nfe: string | null
  status_autorizacao: string | null
  protocolo_sefaz: string | null
  situacao: string | null
  explicacao: string | null
  created_at: string | null

  // Emitente
  emitente_razao_social: string | null
  emitente_cnpj: string | null
  emitente_ie: string | null
  emitente_endereco: string | null
  emitente_telefone: string | null
  emitente_regime_tributario: string | null
  emitente_saquetto: boolean | null
  simples_optante: boolean | null

  // Destinatário
  destinatario_razao_social: string | null
  destinatario_cnpj: string | null
  destinatario_ie: string | null
  destinatario_endereco: string | null
  destinatario_email: string | null
  destinatario_telefone: string | null

  // Produto
  descricao_produto: string | null
  codigo_produto: string | null
  ncm: string | null
  cest: string | null
  quantidade: string | null
  valor_unitario: string | null
  item: string | null

  // Valores
  valor_total_nfe: string | null
  valor_total_produto: string | null
  valor_original: string | null
  base_calculo_icms: string | null

  // ICMS
  icms_cst: string | null
  icms_aliquota: string | null
  icms_base_calculo: string | null
  icms_valor: string | null
  valor_icms: string | null

  // PIS
  pis_cst: string | null
  pis_aliquota: string | null
  pis_base_calculo: string | null
  pis_valor: string | null
  valor_pis: string | null

  // COFINS
  cofins_cst: string | null
  cofins_aliquota: string | null
  cofins_base_calculo: string | null
  cofins_valor: string | null
  valor_cofins: string | null

  // IPI
  ipi_cst: string | null
  ipi_valor: string | null

  // Operação
  natureza_operacao: string | null
  cfop: string | null
  cfop_indicado: string | null
  pedido: string | null
  pedido_cliente: string | null
  oc: string | null

  // Logística
  transportadora: string | null
  local_entrega: string | null
  linha: string | null

  // Financeiro
  forma_pagamento: string | null
  numero_fatura: string | null
  valor_duplicata: string | null
  vencimento: string | null
  valor_pago: string | null

  // Outros
  codigo_municipio_emissor: string | null
  certificado_digital: string | null
}

export default function NotasFiscais() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [notas, setNotas] = useState<NotaFiscal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNota, setSelectedNota] = useState<NotaFiscal | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    cliente: 'all',
    situacao: 'all',
    natureza: 'all',
    regimeTributario: 'all' as TaxRegime,
    periodo: ''
  })

  const [clientes, setClientes] = useState<string[]>([])
  const [naturezas, setNaturezas] = useState<string[]>([])

  // Read URL params and apply filters
  useEffect(() => {
    const situacaoParam = searchParams.get('situacao')
    if (situacaoParam && ['Aprovado', 'Alerta', 'Reprovado'].includes(situacaoParam)) {
      setFilters(prev => ({
        ...prev,
        situacao: situacaoParam
      }))
    }
  }, [searchParams])

  // Handle notaId parameter to open specific nota dialog
  useEffect(() => {
    const notaIdParam = searchParams.get('notaId')
    if (notaIdParam && notas.length > 0) {
      const notaId = parseInt(notaIdParam, 10)
      const nota = notas.find(n => n.id === notaId)
      if (nota) {
        handleNotaSelect(nota)
        // Remove the notaId param after opening
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.delete('notaId')
        setSearchParams(newSearchParams, { replace: true })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, notas])

  useEffect(() => {
    fetchNotas()
    fetchFilterOptions()
  }, [])

  const fetchNotas = async () => {
    try {
      const { data, error } = await supabase
        .from('saquetto')
        .select(`
          id, numero_nfe, serie, modelo, chave_acesso, ambiente,
          data_emissao, data_autorizacao, finalidade_nfe, status_autorizacao,
          protocolo_sefaz, situacao, explicacao, created_at,

          emitente_razao_social, emitente_cnpj, emitente_ie, emitente_endereco,
          emitente_telefone, emitente_regime_tributario, emitente_saquetto,
          simples_optante,

          destinatario_razao_social, destinatario_cnpj, destinatario_ie,
          destinatario_endereco, destinatario_email, destinatario_telefone,

          descricao_produto, codigo_produto, ncm, cest, quantidade,
          valor_unitario, item,

          valor_total_nfe, valor_total_produto, valor_original, base_calculo_icms,

          icms_cst, icms_aliquota, icms_base_calculo, icms_valor, valor_icms,
          pis_cst, pis_aliquota, pis_base_calculo, pis_valor, valor_pis,
          cofins_cst, cofins_aliquota, cofins_base_calculo, cofins_valor, valor_cofins,
          ipi_cst, ipi_valor,

          natureza_operacao, cfop, cfop_indicado, pedido, pedido_cliente, oc,
          transportadora, local_entrega, linha,

          forma_pagamento, numero_fatura, valor_duplicata, vencimento, valor_pago,
          codigo_municipio_emissor, certificado_digital
        `)
        .order('data_emissao', { ascending: false })
        .limit(1000)

      if (error) throw error

      setNotas(data || [])
    } catch (error) {
      console.error('Erro ao buscar notas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notas fiscais",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchFilterOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('saquetto')
        .select('destinatario_razao_social, natureza_operacao')
        .not('destinatario_razao_social', 'is', null)
        .not('natureza_operacao', 'is', null)

      if (error) throw error

      const uniqueClientes = [...new Set(data?.map(d => d.destinatario_razao_social).filter(Boolean))]
      const uniqueNaturezas = [...new Set(data?.map(d => d.natureza_operacao).filter(Boolean))]

      setClientes(uniqueClientes.sort())
      setNaturezas(uniqueNaturezas.sort())
    } catch (error) {
      console.error('Erro ao buscar opções de filtro:', error)
    }
  }

  // Apply tax regime filter first
  const taxRegimeFilteredNotas = filterByTaxRegime(notas, filters.regimeTributario);

  const filteredNotas = taxRegimeFilteredNotas.filter(nota => {
    const matchesSearch = 
      nota.numero_nfe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.destinatario_razao_social?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCliente = filters.cliente === 'all' || nota.destinatario_razao_social === filters.cliente
    const matchesSituacao = filters.situacao === 'all' || nota.situacao === filters.situacao
    const matchesNatureza = filters.natureza === 'all' || nota.natureza_operacao === filters.natureza

    return matchesSearch && matchesCliente && matchesSituacao && matchesNatureza
  })

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value || '0')
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  }

  const loadStatusHistory = async (notaId: number) => {
    setLoadingHistory(true)
    try {
      const result = await getStatusHistory(notaId, 5)
      if (result.success && result.data) {
        setStatusHistory(result.data)
      } else {
        setStatusHistory([])
      }
    } catch (error) {
      console.error('Error loading status history:', error)
      setStatusHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleNotaSelect = async (nota: NotaFiscal) => {
    setSelectedNota(nota)
    setDialogOpen(true)
    await loadStatusHistory(nota.id)
  }

  const handleStatusChangeSuccess = async () => {
    // Reload notas to reflect status change
    await fetchNotas()

    // Reload history for selected nota
    if (selectedNota) {
      await loadStatusHistory(selectedNota.id)

      // Update selectedNota with new status from the refreshed list
      const updatedNota = notas.find(n => n.id === selectedNota.id)
      if (updatedNota) {
        setSelectedNota(updatedNota)
      }
    }
  }

  const downloadXML = async (nota: NotaFiscal) => {
    try {
      const publicUrl = await getPublicInvoiceUrl(nota.id)
      
      if (!publicUrl) {
        toast({
          title: "Erro",
          description: "XML não disponível para esta nota fiscal",
          variant: "destructive"
        })
        return
      }

      // Fetch the file from storage
      const response = await fetch(publicUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch file')
      }

      // Convert to blob
      const blob = await response.blob()
      
      // Create object URL and download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `NFe-${nota.numero_nfe || nota.id}.xml`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Sucesso",
        description: "Download do XML concluído"
      })
      
    } catch (error) {
      console.error('Erro ao baixar XML:', error)
      toast({
        title: "Erro",
        description: "Erro ao fazer download do arquivo XML",
        variant: "destructive"
      })
    }
  }

  const clearFilters = () => {
    setFilters({
      cliente: 'all',
      situacao: 'all',
      natureza: 'all',
      regimeTributario: 'all',
      periodo: ''
    })
    // Clear URL params
    setSearchParams({})
  }

  if (loading) {
    return (
      <div className="p-3 md:p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Notas Fiscais</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Visualize e gerencie todas as notas fiscais processadas
        </p>
      </div>

      {/* Active Filter Chip */}
      {filters.situacao !== 'all' && (
        <div className="mb-4">
          <Badge
            variant="secondary"
            className="gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Filtro ativo:</span>
            <span className="font-semibold">{filters.situacao}</span>
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, situacao: 'all' }))
                setSearchParams({})
              }}
              className="ml-1 p-0.5 rounded-full hover:bg-primary/30 transition-colors"
              aria-label="Remover filtro"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-3 md:space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por número da nota ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 md:h-10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <Select value={filters.cliente} onValueChange={(value) => setFilters(prev => ({ ...prev, cliente: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              {clientes.map(cliente => (
                <SelectItem key={cliente} value={cliente}>
                  {cliente}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.situacao} onValueChange={(value) => setFilters(prev => ({ ...prev, situacao: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as situações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as situações</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Alerta">Alerta</SelectItem>
              <SelectItem value="Reprovado">Reprovado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.natureza} onValueChange={(value) => setFilters(prev => ({ ...prev, natureza: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as operações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as operações</SelectItem>
              {naturezas.map(natureza => (
                <SelectItem key={natureza} value={natureza}>
                  {natureza}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.regimeTributario} onValueChange={(value: TaxRegime) => setFilters(prev => ({ ...prev, regimeTributario: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Regime tributário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os regimes</SelectItem>
              <SelectItem value="simples">Simples Nacional</SelectItem>
              <SelectItem value="presumido">Lucro Presumido/Real</SelectItem>
              <SelectItem value="sem_informacao">Sem Informação</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="month"
            value={filters.periodo}
            onChange={(e) => setFilters(prev => ({ ...prev, periodo: e.target.value }))}
            placeholder="Período"
          />

          <Button variant="outline" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredNotas.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <FileText className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {filteredNotas.filter(n => n.situacao === 'Aprovado').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {filteredNotas.filter(n => n.situacao === 'Alerta').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reprovadas</CardTitle>
            <FileText className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {filteredNotas.filter(n => n.situacao === 'Reprovado').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                filteredNotas.reduce((acc, nota) => acc + parseFloat(nota.valor_total_nfe || '0'), 0).toString()
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Notas Fiscais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-md border">
            <div 
              className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30 transition-colors cursor-grab active:cursor-grabbing"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
              onMouseDown={(e) => {
                const elem = e.currentTarget;
                const startX = e.pageX - elem.offsetLeft;
                const scrollLeft = elem.scrollLeft;
                
                const handleMouseMove = (e: MouseEvent) => {
                  e.preventDefault();
                  const x = e.pageX - elem.offsetLeft;
                  const walk = (x - startX) * 2;
                  elem.scrollLeft = scrollLeft - walk;
                  elem.style.cursor = 'grabbing';
                  elem.style.userSelect = 'none';
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                  elem.style.cursor = 'grab';
                  elem.style.userSelect = 'auto';
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
            <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>CFOP Recomendado</TableHead>
                <TableHead>Regime</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotas.slice(0, 100).map((nota, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">
                    {nota.numero_nfe}
                  </TableCell>
                  <TableCell>
                    {nota.data_emissao ? new Date(nota.data_emissao).toLocaleDateString('pt-BR') : 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {nota.destinatario_razao_social || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(nota.valor_total_nfe)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {nota.natureza_operacao}
                  </TableCell>
                  <TableCell className="text-sm">
                    {nota.cfop_indicado ? formatCFOP(nota.cfop_indicado) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      <Receipt className="w-3 h-3 mr-1" />
                      {getTaxRegimeShortLabel(nota.simples_optante)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      nota.situacao === 'Aprovado' ? 'default' : 
                      nota.situacao === 'Alerta' ? 'secondary' : 
                      'destructive'
                    }
                    className={
                      nota.situacao === 'Alerta' ? 'bg-warning/10 text-warning border-warning/20' : ''
                    }>
                      {nota.situacao}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNotaSelect(nota)}
                      >
                        Detalhes
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadXML(nota)}
                        title="Baixar XML"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>
          </div>
          {filteredNotas.length > 100 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando 100 de {filteredNotas.length} notas. Use os filtros para refinar a busca.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Single Dialog for Details - Outside the map for performance */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes da Nota Fiscal - {selectedNota?.numero_nfe || 'N/A'}
            </DialogTitle>
          </DialogHeader>
          {loadingHistory ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : selectedNota ? (
            <div className="space-y-6">
              {/* Tabs with ALL data */}
              <NotaFiscalTabs nota={selectedNota} />

              {/* Status Change Form */}
              <StatusChangeForm
                notaId={selectedNota.id}
                currentStatus={selectedNota.situacao || 'N/A'}
                onSuccess={handleStatusChangeSuccess}
                onCancel={() => setDialogOpen(false)}
                statusHistory={statusHistory}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Nenhuma nota selecionada</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}