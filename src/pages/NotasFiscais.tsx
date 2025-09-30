import { useState, useEffect } from 'react'
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Search, FileText, Calendar, Filter, Download, Receipt } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { fetchBase64ForNota } from '@/lib/notaFiscalBase64'
import { filterByTaxRegime, getTaxRegimeShortLabel, type TaxRegime } from '@/lib/taxRegimeUtils'

interface NotaFiscal {
  id: number
  numero_nfe: string
  data_emissao: string
  valor_total_nfe: string
  situacao: string
  destinatario_razao_social: string
  natureza_operacao: string
  chave_acesso: string
  emitente_razao_social: string
  transportadora: string
  local_entrega: string
  explicacao: string
  status_autorizacao: string
  pedido: string
  linha: string
  simples_optante?: boolean | null
}

export default function NotasFiscais() {
  const [notas, setNotas] = useState<NotaFiscal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNota, setSelectedNota] = useState<NotaFiscal | null>(null)
  const [filters, setFilters] = useState({
    cliente: 'all',
    situacao: 'all',
    natureza: 'all',
    regimeTributario: 'all' as TaxRegime,
    periodo: ''
  })

  const [clientes, setClientes] = useState<string[]>([])
  const [naturezas, setNaturezas] = useState<string[]>([])

  useEffect(() => {
    fetchNotas()
    fetchFilterOptions()
  }, [])

  const fetchNotas = async () => {
    try {
      const { data, error } = await supabase
        .from('saquetto')
        .select('*')
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

  const downloadXML = async (nota: NotaFiscal) => {
    try {
      // Buscar base64 da nova tabela
      const base64 = await fetchBase64ForNota(nota.id)
      
      if (!base64) {
        toast({
          title: "Erro",
          description: "XML não disponível para esta nota fiscal",
          variant: "destructive"
        })
        return
      }

      // Decodificar base64 para XML
      const xmlContent = atob(base64)
      
      // Criar arquivo para download
      const blob = new Blob([xmlContent], { type: 'application/xml' })
      const url = window.URL.createObjectURL(blob)
      
      // Criar link de download
      const link = document.createElement('a')
      link.href = url
      link.download = `NFe-${nota.numero_nfe}.xml`
      document.body.appendChild(link)
      link.click()
      
      // Limpar recursos
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Sucesso",
        description: "XML baixado com sucesso",
      })
    } catch (error) {
      console.error('Erro ao fazer download do XML:', error)
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo XML",
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
  }

  if (loading) {
    return (
      <div className="p-6">
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Notas Fiscais</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as notas fiscais processadas
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por número da nota ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          <ScrollArea className="w-full">
            <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Operação</TableHead>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedNota(nota)}
                          >
                            Detalhes
                          </Button>
                        </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Detalhes da Nota Fiscal - {selectedNota?.numero_nfe}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedNota && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold mb-2">Informações Básicas</h3>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Número:</span> {selectedNota.numero_nfe}</div>
                                  <div><span className="font-medium">Data de Emissão:</span> {selectedNota.data_emissao ? new Date(selectedNota.data_emissao).toLocaleDateString('pt-BR') : 'N/A'}</div>
                                  <div><span className="font-medium">Valor Total:</span> {formatCurrency(selectedNota.valor_total_nfe)}</div>
                                  <div><span className="font-medium">Status:</span> 
                                    <Badge 
                                      className={
                                        selectedNota.situacao === 'Alerta' 
                                          ? 'ml-2 bg-warning/10 text-warning border-warning/20' 
                                          : 'ml-2'
                                      }
                                      variant={
                                        selectedNota.situacao === 'Aprovado' ? 'default' : 
                                        selectedNota.situacao === 'Alerta' ? 'secondary' : 
                                        'destructive'
                                      }>
                                      {selectedNota.situacao}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">Dados do Cliente</h3>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Razão Social:</span> {selectedNota.destinatario_razao_social}</div>
                                  <div><span className="font-medium">Natureza da Operação:</span> {selectedNota.natureza_operacao}</div>
                                  <div><span className="font-medium">Local de Entrega:</span> {selectedNota.local_entrega}</div>
                                  <div><span className="font-medium">Transportadora:</span> {selectedNota.transportadora}</div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Informações Técnicas</h3>
                              <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Chave de Acesso:</span> <span className="font-mono">{selectedNota.chave_acesso}</span></div>
                                <div><span className="font-medium">Status de Autorização:</span> {selectedNota.status_autorizacao}</div>
                                <div><span className="font-medium">Pedido:</span> {selectedNota.pedido}</div>
                                <div><span className="font-medium">Linha:</span> {selectedNota.linha}</div>
                              </div>
                            </div>

                            {selectedNota.explicacao && (
                              <div>
                                <h3 className="font-semibold mb-2">Observações</h3>
                                <p className="text-sm bg-muted p-3 rounded-lg">
                                  {selectedNota.explicacao}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
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
          <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {filteredNotas.length > 100 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando 100 de {filteredNotas.length} notas. Use os filtros para refinar a busca.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}