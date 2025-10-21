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
        return <XCircle className="h-4 w-4 text-destructive" />
      case 'PIS Incorreto':
      case 'COFINS Divergente':
      case 'ICMS Divergente':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getErrorColor = (tipo: string) => {
    switch (tipo) {
      case 'NCM Inválido':
      case 'CFOP Inválido':
        return 'destructive'
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
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Erros e Alertas</h1>
        <p className="text-muted-foreground">
          Análise de inconsistências fiscais e problemas detectados
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por número da nota, cliente ou erro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Select value={filters.tipoErro} onValueChange={(value) => setFilters(prev => ({ ...prev, tipoErro: value }))}>
            <SelectTrigger className="w-48">
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
            <SelectTrigger className="w-64">
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

          <Button variant="outline" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Limpar
          </Button>

          <Button variant="outline" onClick={exportErros}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Erros</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{filteredErros.length}</div>
          </CardContent>
        </Card>
        
        {tiposErro.slice(0, 3).map(tipo => {
          const count = filteredErros.filter(e => e.tipo_erro === tipo).length
          return (
            <Card key={tipo}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{tipo}</CardTitle>
                {getErrorIcon(tipo)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Errors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Erros e Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo de Erro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredErros.slice(0, 50).map((erro, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">
                    {erro.numero_nfe}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {erro.destinatario_razao_social || 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {erro.natureza_operacao}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(parseFloat(erro.valor_total_nfe || '0'))}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {erro.descricao_produto}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getErrorColor(erro.tipo_erro) as "destructive" | "secondary" | "outline"}>
                      {erro.tipo_erro}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedErro(erro)}
                        >
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Análise Fiscal - {selectedErro?.numero_nfe}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedErro && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold mb-2">Informações do Documento</h3>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Número NFe:</span> {selectedErro.numero_nfe}</div>
                                  <div><span className="font-medium">Data:</span> {selectedErro.data_emissao ? new Date(selectedErro.data_emissao).toLocaleDateString('pt-BR') : 'N/A'}</div>
                                  <div><span className="font-medium">Valor:</span> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(selectedErro.valor_total_nfe || '0'))}</div>
                                  <div><span className="font-medium">Cliente:</span> {selectedErro.destinatario_razao_social}</div>
                                  <div><span className="font-medium">Operação:</span> {selectedErro.natureza_operacao}</div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">Dados Fiscais</h3>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">NCM:</span> {selectedErro.ncm}</div>
                                  <div><span className="font-medium">CFOP:</span> {selectedErro.cfop}</div>
                                  <div><span className="font-medium">CST ICMS:</span> {selectedErro.icms_cst}</div>
                                  <div><span className="font-medium">CST PIS:</span> {selectedErro.pis_cst}</div>
                                  <div><span className="font-medium">CST COFINS:</span> {selectedErro.cofins_cst}</div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Produto</h3>
                              <p className="text-sm bg-muted p-3 rounded-lg">
                                {selectedErro.descricao_produto}
                              </p>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2 flex items-center gap-2">
                                {getErrorIcon(selectedErro.tipo_erro)}
                                Erro Detectado: {selectedErro.tipo_erro}
                              </h3>
                              <div className="bg-destructive/5 border border-destructive/30 p-4 rounded-lg">
                                <p className="text-sm text-destructive">
                                  {selectedErro.explicacao}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Informações Técnicas</h3>
                              <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Chave de Acesso:</span> <span className="font-mono text-xs">{selectedErro.chave_acesso}</span></div>
                                <div><span className="font-medium">Status SEFAZ:</span> {selectedErro.status_autorizacao}</div>
                                <div><span className="font-medium">Emitente:</span> {selectedErro.emitente_razao_social}</div>
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
          {filteredErros.length > 50 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando 50 de {filteredErros.length} erros. Use os filtros para refinar a busca.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}