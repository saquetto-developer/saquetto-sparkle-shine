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
import { 
  Search, 
  AlertTriangle, 
  XCircle, 
  AlertCircle, 
  Download,
  Filter
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ErroNota {
  numero_nfe: string
  data_emissao: string
  valor_total_nfe: string
  destinatario_razao_social: string
  natureza_operacao: string
  explicacao: string
  ncm: string
  descricao_produto: string
  chave_acesso: string
  icms_cst: string
  cfop: string
  pis_cst: string
  cofins_cst: string
  emitente_razao_social: string
  status_autorizacao: string
  tipo_erro: string
}

export default function ErrosAlertas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [erros, setErros] = useState<ErroNota[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedErro, setSelectedErro] = useState<ErroNota | null>(null)
  const [filters, setFilters] = useState({
    tipoErro: 'all',
    cliente: 'all'
  })

  const [tiposErro, setTiposErro] = useState<string[]>([])
  const [clientes, setClientes] = useState<string[]>([])

  // Read URL params and apply filters
  useEffect(() => {
    const tipoParam = searchParams.get('tipo')
    if (tipoParam) {
      setFilters(prev => ({
        ...prev,
        tipoErro: tipoParam
      }))
    }
  }, [searchParams])

  useEffect(() => {
    fetchErros()
  }, [])

  const fetchErros = async () => {
    try {
      const { data, error } = await supabase
        .from('saquetto')
        .select('*')
        .in('situacao', ['Reprovado', 'Alerta'])
        .not('explicacao', 'is', null)
        .order('data_emissao', { ascending: false })

      if (error) throw error

      // Categorizar tipos de erro baseado na explicação
      const errosComTipo = (data || []).map(nota => {
        const explicacao = nota.explicacao?.toLowerCase() || ''
        let tipoErro = 'Outros'

        if (explicacao.includes('ncm') || explicacao.includes('classificação')) {
          tipoErro = 'NCM Inválido'
        } else if (explicacao.includes('pis') || explicacao.includes('pasep')) {
          tipoErro = 'PIS Incorreto'
        } else if (explicacao.includes('cofins')) {
          tipoErro = 'COFINS Divergente'
        } else if (explicacao.includes('icms')) {
          tipoErro = 'ICMS Divergente'
        } else if (explicacao.includes('cfop')) {
          tipoErro = 'CFOP Inválido'
        } else if (explicacao.includes('valor') || explicacao.includes('preço')) {
          tipoErro = 'Valor Divergente'
        } else if (explicacao.includes('autorização') || explicacao.includes('sefaz')) {
          tipoErro = 'Erro de Autorização'
        }

        return {
          ...nota,
          tipo_erro: tipoErro
        }
      })

      setErros(errosComTipo)

      // Extrair tipos únicos para filtros
      const tipos = [...new Set(errosComTipo.map(e => e.tipo_erro))].sort()
      const clientesUnicos = [...new Set(errosComTipo.map(e => e.destinatario_razao_social).filter(Boolean))].sort()
      
      setTiposErro(tipos)
      setClientes(clientesUnicos)

    } catch (error) {
      console.error('Erro ao buscar erros:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os erros e alertas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredErros = erros.filter(erro => {
    const matchesSearch = 
      erro.numero_nfe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      erro.destinatario_razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      erro.explicacao?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTipo = filters.tipoErro === 'all' || erro.tipo_erro === filters.tipoErro
    const matchesCliente = filters.cliente === 'all' || erro.destinatario_razao_social === filters.cliente

    return matchesSearch && matchesTipo && matchesCliente
  })

  const getErrorIcon = (tipo: string) => {
    switch (tipo) {
      case 'NCM Inválido':
      case 'CFOP Inválido':
        return <AlertCircle className="h-4 w-4 text-primary" />
      case 'PIS Incorreto':
      case 'COFINS Divergente':
      case 'ICMS Divergente':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getErrorColor = (tipo: string) => {
    switch (tipo) {
      case 'NCM Inválido':
      case 'CFOP Inválido':
        return 'default'
      case 'PIS Incorreto':
      case 'COFINS Divergente':
      case 'ICMS Divergente':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const exportErros = () => {
    const csv = [
      ['Documento', 'Data', 'Cliente', 'Operação', 'Valor', 'Produto', 'Tipo de Erro', 'Mensagem'].join(';'),
      ...filteredErros.map(erro => [
        erro.numero_nfe,
        erro.data_emissao,
        erro.destinatario_razao_social,
        erro.natureza_operacao,
        erro.valor_total_nfe,
        erro.descricao_produto,
        erro.tipo_erro,
        erro.explicacao?.replace(/;/g, ',')
      ].join(';'))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `erros_alertas_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearFilters = () => {
    setFilters({
      tipoErro: 'all',
      cliente: 'all'
    })
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="mb-6">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Enhanced Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg md:rounded-xl border border-primary/20">
            <AlertTriangle className="h-5 w-5 md:h-7 md:w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1 md:mb-2">
              Erros e Alertas
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Análise de inconsistências fiscais e problemas detectados automaticamente
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
        <div className="relative">
          <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
          <Input
            placeholder="Buscar por número da nota, cliente ou erro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 md:pl-12 h-11 md:h-12 text-sm md:text-base rounded-lg md:rounded-xl border-2 focus-visible:ring-2 transition-all"
          />
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtros:</span>
          </div>

          <Select value={filters.tipoErro} onValueChange={(value) => setFilters(prev => ({ ...prev, tipoErro: value }))}>
            <SelectTrigger className="w-full md:w-52 h-10 rounded-lg">
              <SelectValue placeholder="Tipo de erro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {tiposErro.map(tipo => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.cliente} onValueChange={(value) => setFilters(prev => ({ ...prev, cliente: value }))}>
            <SelectTrigger className="w-full md:w-64 h-10 rounded-lg">
              <SelectValue placeholder="Cliente" />
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

          <div className="flex gap-3 md:gap-2">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-1 md:flex-none h-10 rounded-lg"
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar
            </Button>

            <Button
              variant="default"
              onClick={exportErros}
              className="flex-1 md:flex-none md:ml-auto h-10 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Erros</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-primary">{filteredErros.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredErros.length === erros.length ? 'Total no sistema' : 'Após filtros aplicados'}
            </p>
          </CardContent>
        </Card>

        {tiposErro.slice(0, 3).map((tipo, index) => {
          const count = filteredErros.filter(e => e.tipo_erro === tipo).length
          const iconBgColors = [
            'bg-blue-500/10',
            'bg-cyan-500/10',
            'bg-indigo-500/10'
          ]
          return (
            <Card key={tipo} className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground line-clamp-1">
                  {tipo}
                </CardTitle>
                <div className={`p-2 ${iconBgColors[index]} rounded-lg group-hover:scale-110 transition-transform`}>
                  {getErrorIcon(tipo)}
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((count / filteredErros.length) * 100).toFixed(0)}% do total
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Enhanced Errors Table */}
      {filteredErros.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 bg-muted rounded-full mb-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum erro encontrado</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchTerm || filters.tipoErro !== 'all' || filters.cliente !== 'all'
                ? 'Tente ajustar os filtros ou termos de busca para encontrar resultados.'
                : 'Não há erros ou alertas registrados no momento.'}
            </p>
            {(searchTerm || filters.tipoErro !== 'all' || filters.cliente !== 'all') && (
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                clearFilters()
              }}>
                Limpar todos os filtros
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 rounded-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Lista de Erros e Alertas</CardTitle>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {filteredErros.length} {filteredErros.length === 1 ? 'erro' : 'erros'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Documento</TableHead>
                    <TableHead className="font-semibold">Cliente</TableHead>
                    <TableHead className="font-semibold">Operação</TableHead>
                    <TableHead className="font-semibold">Valor</TableHead>
                    <TableHead className="font-semibold">Produto</TableHead>
                    <TableHead className="font-semibold">Tipo de Erro</TableHead>
                    <TableHead className="text-right font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredErros.slice(0, 50).map((erro, index) => (
                    <TableRow
                      key={index}
                      className={`hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                    >
                      <TableCell className="font-mono text-sm font-medium">
                        {erro.numero_nfe}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {erro.destinatario_razao_social || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate text-sm">
                        {erro.natureza_operacao}
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(parseFloat(erro.valor_total_nfe || '0'))}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {erro.descricao_produto}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getErrorColor(erro.tipo_erro) as "default" | "secondary" | "outline"}
                          className="font-medium"
                        >
                          <span className="mr-1.5">{getErrorIcon(erro.tipo_erro)}</span>
                          {erro.tipo_erro}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedErro(erro)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              Ver detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader className="border-b pb-4">
                              <DialogTitle className="text-2xl flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <AlertTriangle className="h-5 w-5 text-primary" />
                                </div>
                                Análise Fiscal - NFe {selectedErro?.numero_nfe}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedErro && (
                              <div className="space-y-6 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                                      <div className="h-1 w-1 rounded-full bg-primary" />
                                      Informações do Documento
                                    </h3>
                                    <div className="space-y-3 text-sm bg-muted/30 p-4 rounded-lg">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Número NFe:</span>
                                        <span className="font-semibold font-mono">{selectedErro.numero_nfe}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Data:</span>
                                        <span className="font-semibold">
                                          {selectedErro.data_emissao ? new Date(selectedErro.data_emissao).toLocaleDateString('pt-BR') : 'N/A'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Valor:</span>
                                        <span className="font-semibold text-green-600">
                                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(selectedErro.valor_total_nfe || '0'))}
                                        </span>
                                      </div>
                                      <div className="flex flex-col gap-1 pt-2 border-t">
                                        <span className="text-muted-foreground">Cliente:</span>
                                        <span className="font-semibold">{selectedErro.destinatario_razao_social}</span>
                                      </div>
                                      <div className="flex flex-col gap-1 pt-2 border-t">
                                        <span className="text-muted-foreground">Operação:</span>
                                        <span className="font-semibold">{selectedErro.natureza_operacao}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                                      <div className="h-1 w-1 rounded-full bg-primary" />
                                      Dados Fiscais
                                    </h3>
                                    <div className="space-y-3 text-sm bg-muted/30 p-4 rounded-lg">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">NCM:</span>
                                        <span className="font-semibold font-mono">{selectedErro.ncm}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">CFOP:</span>
                                        <span className="font-semibold font-mono">{selectedErro.cfop}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">CST ICMS:</span>
                                        <span className="font-semibold font-mono">{selectedErro.icms_cst}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">CST PIS:</span>
                                        <span className="font-semibold font-mono">{selectedErro.pis_cst}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">CST COFINS:</span>
                                        <span className="font-semibold font-mono">{selectedErro.cofins_cst}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                    Produto
                                  </h3>
                                  <p className="text-sm bg-muted/30 p-4 rounded-lg leading-relaxed">
                                    {selectedErro.descricao_produto}
                                  </p>
                                </div>

                                <div className="space-y-3">
                                  <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                                    {getErrorIcon(selectedErro.tipo_erro)}
                                    Erro Detectado: {selectedErro.tipo_erro}
                                  </h3>
                                  <div className="bg-primary/10 border-2 border-primary/30 p-5 rounded-xl">
                                    <p className="text-sm text-primary leading-relaxed font-medium">
                                      {selectedErro.explicacao}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                    Informações Técnicas
                                  </h3>
                                  <div className="space-y-3 text-sm bg-muted/30 p-4 rounded-lg">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-muted-foreground">Chave de Acesso:</span>
                                      <span className="font-mono text-xs bg-background p-2 rounded border">
                                        {selectedErro.chave_acesso}
                                      </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                      <span className="text-muted-foreground">Status SEFAZ:</span>
                                      <span className="font-semibold">{selectedErro.status_autorizacao}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 pt-2 border-t">
                                      <span className="text-muted-foreground">Emitente:</span>
                                      <span className="font-semibold">{selectedErro.emitente_razao_social}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredErros.length > 50 && (
              <div className="border-t-2 bg-muted/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando <span className="font-semibold text-foreground">50</span> de{' '}
                    <span className="font-semibold text-foreground">{filteredErros.length}</span> erros encontrados
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    Carregar mais
                    <AlertCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}