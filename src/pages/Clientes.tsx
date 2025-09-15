import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { Search, Users, FileText, DollarSign, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Cliente {
  destinatario_razao_social: string
  destinatario_cnpj: string
  total_notas: number
  valor_total: number
  notas_aprovadas: number
  notas_alertas?: number
  notas_reprovadas: number
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

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('saquetto')
        .select(`
          destinatario_razao_social,
          destinatario_cnpj,
          numero_nfe,
          valor_total_nfe,
          situacao
        `)
        .not('destinatario_razao_social', 'is', null)

      if (error) throw error

      // Agrupar por cliente
      const clientesMap = new Map<string, Cliente>()
      
      data?.forEach((nota) => {
        const key = nota.destinatario_cnpj || nota.destinatario_razao_social
        if (!clientesMap.has(key)) {
          clientesMap.set(key, {
            destinatario_razao_social: nota.destinatario_razao_social,
            destinatario_cnpj: nota.destinatario_cnpj,
            total_notas: 0,
            valor_total: 0,
            notas_aprovadas: 0,
            notas_alertas: 0,
            notas_reprovadas: 0,
            status: 'ok'
          })
        }

        const cliente = clientesMap.get(key)!
        cliente.total_notas++
        cliente.valor_total += parseFloat(nota.valor_total_nfe || '0')
        
        if (nota.situacao === 'Aprovado') {
          cliente.notas_aprovadas++
        } else if (nota.situacao === 'Alerta') {
          cliente.notas_alertas = (cliente.notas_alertas || 0) + 1
          cliente.status = 'com_alertas'
        } else if (nota.situacao === 'Reprovado') {
          cliente.notas_reprovadas++
          cliente.status = 'erro'
        }
      })

      setClientes(Array.from(clientesMap.values()))
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
        .or(`destinatario_cnpj.eq.${cliente.destinatario_cnpj},destinatario_razao_social.eq.${cliente.destinatario_razao_social}`)
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

  const filteredClientes = clientes.filter(cliente =>
    cliente.destinatario_razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.destinatario_cnpj?.includes(searchTerm)
  )

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
          Gerencie e visualize informações dos seus clientes
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
            <div className="text-2xl font-bold">{clientes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes OK</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {clientes.filter(c => c.status === 'ok').length}
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
              {clientes.filter(c => c.status === 'com_alertas').length}
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
              {clientes.filter(c => c.status === 'erro').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(clientes.reduce((acc, c) => acc + c.valor_total, 0))}
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
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {cliente.destinatario_razao_social || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {cliente.destinatario_cnpj || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>{cliente.total_notas}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(cliente.valor_total)}
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
                          Ver Notas
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Notas Fiscais - {selectedCliente?.destinatario_razao_social}
                          </DialogTitle>
                        </DialogHeader>
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
                              {notasCliente.map((nota, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-mono">
                                    {nota.numero_nfe}
                                  </TableCell>
                                  <TableCell>
                                    {nota.data_emissao ? new Date(nota.data_emissao).toLocaleDateString('pt-BR') : 'N/A'}
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(parseFloat(nota.valor_total_nfe || '0'))}
                                  </TableCell>
                                  <TableCell>
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
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}