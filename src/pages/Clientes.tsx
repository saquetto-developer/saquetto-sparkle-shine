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
import { Search, Users, FileText, DollarSign, AlertCircle, MapPin, Phone, Mail, TrendingUp, Building } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Cliente {
  razao_social: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
  total_notas: number
  valor_total: number
  notas_aprovadas: number
  notas_alertas: number
  notas_reprovadas: number
  ultima_compra: string
  produtos_principais: string[]
  ticket_medio: number
  status: 'ok' | 'com_alertas' | 'erro'
}

interface NotaCliente {
  numero_nfe: string
  data_emissao: string
  valor_total_nfe: string
  situacao: string
  natureza_operacao: string
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [notasCliente, setNotasCliente] = useState<NotaCliente[]>([])
  const [loadingNotas, setLoadingNotas] = useState(false)
  const [sortBy, setSortBy] = useState<'nome' | 'valor' | 'notas'>('valor')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ok' | 'com_alertas' | 'erro'>('todos')

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('saquetto')
        .select('*')
        .not('destinatario_razao_social', 'is', null)
        .eq('emitente_saquetto', true) // Apenas vendas da Saquetto

      if (error) throw error

      // Agrupar por cliente
      const clientesMap = new Map<string, {
        razao_social: string
        cnpj: string
        endereco: string
        telefone: string
        email: string
        notas: any[]
        valor_total: number
        notas_aprovadas: number
        notas_alertas: number
        notas_reprovadas: number
        ultima_compra: string
        produtos: Set<string>
        status: 'ok' | 'com_alertas' | 'erro'
      }>()

      data?.forEach(nota => {
        const key = nota.destinatario_cnpj || nota.destinatario_razao_social
        if (!key) return

        if (clientesMap.has(key)) {
          const existing = clientesMap.get(key)!
          existing.notas.push(nota)
          existing.valor_total += parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0')
          
          if (nota.descricao_produto) {
            existing.produtos.add(nota.descricao_produto)
          }
          
          // Atualizar última compra se for mais recente
          if (new Date(nota.data_emissao) > new Date(existing.ultima_compra)) {
            existing.ultima_compra = nota.data_emissao
          }

          // Contar por status
          if (nota.situacao === 'Aprovado') {
            existing.notas_aprovadas++
          } else if (nota.situacao === 'Alerta') {
            existing.notas_alertas++
            existing.status = 'com_alertas'
          } else if (nota.situacao === 'Reprovado') {
            existing.notas_reprovadas++
            existing.status = 'erro'
          }
        } else {
          const produtos = new Set<string>()
          if (nota.descricao_produto) produtos.add(nota.descricao_produto)
          
          let status: 'ok' | 'com_alertas' | 'erro' = 'ok'
          let notas_aprovadas = 0, notas_alertas = 0, notas_reprovadas = 0
          
          if (nota.situacao === 'Aprovado') {
            notas_aprovadas = 1
          } else if (nota.situacao === 'Alerta') {
            notas_alertas = 1
            status = 'com_alertas'
          } else if (nota.situacao === 'Reprovado') {
            notas_reprovadas = 1
            status = 'erro'
          }
          
          clientesMap.set(key, {
            razao_social: nota.destinatario_razao_social || 'Cliente não identificado',
            cnpj: nota.destinatario_cnpj || 'Não informado',
            endereco: nota.destinatario_endereco || 'Não informado',
            telefone: nota.destinatario_telefone || 'Não informado',
            email: nota.destinatario_email || 'Não informado',
            notas: [nota],
            valor_total: parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'),
            notas_aprovadas,
            notas_alertas,
            notas_reprovadas,
            ultima_compra: nota.data_emissao || nota.created_at,
            produtos,
            status
          })
        }
      })

      // Converter para array
      const clientesList: Cliente[] = Array.from(clientesMap.values()).map(c => ({
        razao_social: c.razao_social,
        cnpj: c.cnpj,
        endereco: c.endereco,
        telefone: c.telefone,
        email: c.email,
        total_notas: c.notas.length,
        valor_total: c.valor_total,
        notas_aprovadas: c.notas_aprovadas,
        notas_alertas: c.notas_alertas,
        notas_reprovadas: c.notas_reprovadas,
        ultima_compra: c.ultima_compra,
        produtos_principais: Array.from(c.produtos).slice(0, 5),
        ticket_medio: c.valor_total / c.notas.length,
        status: c.status
      }))

      setClientes(clientesList)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchNotasCliente = async (cliente: Cliente) => {
    setLoadingNotas(true)
    try {
      const { data, error } = await supabase
        .from('saquetto')
        .select(`
          numero_nfe,
          data_emissao,
          valor_total_nfe,
          situacao,
          natureza_operacao
        `)
        .or(`destinatario_cnpj.eq.${cliente.cnpj},destinatario_razao_social.eq.${cliente.razao_social}`)
        .order('data_emissao', { ascending: false })

      if (error) throw error

      setNotasCliente(data || [])
    } catch (error) {
      console.error('Erro ao buscar notas do cliente:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notas do cliente",
        variant: "destructive"
      })
    } finally {
      setLoadingNotas(false)
    }
  }

  const filteredClientes = clientes
    .filter(cliente => {
      const matchesSearch = cliente.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cnpj?.includes(searchTerm)
      const matchesStatus = statusFilter === 'todos' || cliente.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.razao_social.localeCompare(b.razao_social)
        case 'valor':
          return b.valor_total - a.valor_total
        case 'notas':
          return b.total_notas - a.total_notas
        default:
          return 0
      }
    })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie seus clientes e analise o histórico de vendas
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={(value: 'nome' | 'valor' | 'notas') => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="valor">Maior faturamento</SelectItem>
              <SelectItem value="notas">Mais compras</SelectItem>
              <SelectItem value="nome">Nome A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value: 'todos' | 'ok' | 'com_alertas' | 'erro') => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ok">Apenas OK</SelectItem>
              <SelectItem value="com_alertas">Com alertas</SelectItem>
              <SelectItem value="erro">Com erros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredClientes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes OK</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {filteredClientes.filter(c => c.status === 'ok').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Alertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {filteredClientes.filter(c => c.status === 'com_alertas').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Erros</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {filteredClientes.filter(c => c.status === 'erro').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(filteredClientes.reduce((acc, c) => acc + c.valor_total, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Total Notas</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Ticket Médio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.slice(0, 50).map((cliente, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {cliente.razao_social || 'N/A'}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {cliente.cnpj || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>{cliente.total_notas}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(cliente.valor_total)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(cliente.ticket_medio)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        cliente.status === 'ok' ? 'default' : 
                        cliente.status === 'com_alertas' ? 'secondary' : 
                        'destructive'
                      }
                      className={
                        cliente.status === 'com_alertas' ? 'bg-warning/10 text-warning border-warning/20' : ''
                      }>
                      {cliente.status === 'ok' ? 'OK' : 
                       cliente.status === 'com_alertas' ? 'Alertas' : 
                       'Erros'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedCliente(cliente)
                            fetchNotasCliente(cliente)
                          }}
                        >
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Perfil do Cliente - {selectedCliente?.razao_social}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedCliente && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold mb-2">Informações Básicas</h3>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Razão Social:</span> {selectedCliente.razao_social}</div>
                                  <div><span className="font-medium">CNPJ:</span> {selectedCliente.cnpj}</div>
                                  <div><span className="font-medium">Total de Compras:</span> {selectedCliente.total_notas}</div>
                                  <div><span className="font-medium">Faturamento Total:</span> {formatCurrency(selectedCliente.valor_total)}</div>
                                  <div><span className="font-medium">Ticket Médio:</span> {formatCurrency(selectedCliente.ticket_medio)}</div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">Contato</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-xs break-all">{selectedCliente.endereco}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{selectedCliente.telefone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-xs break-all">{selectedCliente.email}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Principais Produtos Comprados</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedCliente.produtos_principais.map((produto, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {produto.substring(0, 30)}{produto.length > 30 ? '...' : ''}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                              <div className="text-center">
                                <div className="text-xl font-bold text-success">
                                  {selectedCliente.notas_aprovadas}
                                </div>
                                <div className="text-sm text-muted-foreground">Aprovadas</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold text-warning">
                                  {selectedCliente.notas_alertas}
                                </div>
                                <div className="text-sm text-muted-foreground">Alertas</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold text-destructive">
                                  {selectedCliente.notas_reprovadas}
                                </div>
                                <div className="text-sm text-muted-foreground">Reprovadas</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold text-primary">
                                  {formatCurrency(selectedCliente.ticket_medio)}
                                </div>
                                <div className="text-sm text-muted-foreground">Ticket médio</div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Histórico de Notas Fiscais</h3>
                              {loadingNotas ? (
                                <div className="space-y-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-12 w-full" />
                                  ))}
                                </div>
                              ) : (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Número</TableHead>
                                      <TableHead>Data</TableHead>
                                      <TableHead>Valor</TableHead>
                                      <TableHead>Operação</TableHead>
                                      <TableHead>Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {notasCliente.slice(0, 10).map((nota, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className="font-mono text-sm">
                                          {nota.numero_nfe}
                                        </TableCell>
                                        <TableCell>
                                          {nota.data_emissao ? new Date(nota.data_emissao).toLocaleDateString('pt-BR') : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                          {formatCurrency(parseFloat(nota.valor_total_nfe || '0'))}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                          {nota.natureza_operacao}
                                        </TableCell>
                                        <TableCell>
                                          <Badge 
                                            variant={
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
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
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
          {filteredClientes.length > 50 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando 50 de {filteredClientes.length} clientes. Use os filtros para refinar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}