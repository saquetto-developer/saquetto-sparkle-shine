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
import { Search, Building2, MapPin, Phone, Mail, TrendingUp } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Fornecedor {
  razao_social: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
  total_notas: number
  valor_total: number
  ultima_compra: string
  produtos_principais: string[]
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null)
  const [sortBy, setSortBy] = useState<'nome' | 'valor' | 'notas'>('valor')

  useEffect(() => {
    fetchFornecedores()
  }, [])

  const fetchFornecedores = async () => {
    try {
      const { data, error } = await supabase
        .from('saquetto')
        .select('*')
        .not('emitente_razao_social', 'is', null)
        .neq('emitente_saquetto', true)

      if (error) throw error

      // Agrupar por fornecedor
      const fornecedoresMap = new Map<string, {
        razao_social: string
        cnpj: string
        endereco: string
        telefone: string
        email: string
        notas: any[]
        valor_total: number
        ultima_compra: string
        produtos: Set<string>
      }>()

      data?.forEach(nota => {
        const key = nota.emitente_cnpj || nota.emitente_razao_social
        if (!key) return

        if (fornecedoresMap.has(key)) {
          const existing = fornecedoresMap.get(key)!
          existing.notas.push(nota)
          existing.valor_total += parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0')
          
          if (nota.descricao_produto) {
            existing.produtos.add(nota.descricao_produto)
          }
          
          // Atualizar última compra se for mais recente
          if (new Date(nota.data_emissao) > new Date(existing.ultima_compra)) {
            existing.ultima_compra = nota.data_emissao
          }
        } else {
          const produtos = new Set<string>()
          if (nota.descricao_produto) produtos.add(nota.descricao_produto)
          
          fornecedoresMap.set(key, {
            razao_social: nota.emitente_razao_social || 'Não informado',
            cnpj: nota.emitente_cnpj || 'Não informado',
            endereco: nota.emitente_endereco || 'Não informado',
            telefone: nota.emitente_telefone || 'Não informado',
            email: 'Não informado',
            notas: [nota],
            valor_total: parseFloat(nota.valor_total_nfe?.replace(/[^\d,.-]/g, '')?.replace(',', '.') || '0'),
            ultima_compra: nota.data_emissao || nota.created_at,
            produtos
          })
        }
      })

      // Converter para array
      const fornecedoresList: Fornecedor[] = Array.from(fornecedoresMap.values()).map(f => ({
        razao_social: f.razao_social,
        cnpj: f.cnpj,
        endereco: f.endereco,
        telefone: f.telefone,
        email: f.email,
        total_notas: f.notas.length,
        valor_total: f.valor_total,
        ultima_compra: f.ultima_compra,
        produtos_principais: Array.from(f.produtos).slice(0, 5)
      }))

      setFornecedores(fornecedoresList)
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fornecedores",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredFornecedores = fornecedores
    .filter(fornecedor => 
      fornecedor.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj.includes(searchTerm)
    )
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
        <h1 className="text-3xl font-bold mb-2">Fornecedores</h1>
        <p className="text-muted-foreground">
          Gerencie seus fornecedores e analise o histórico de compras
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
              <SelectItem value="valor">Maior valor</SelectItem>
              <SelectItem value="notas">Mais notas</SelectItem>
              <SelectItem value="nome">Nome A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fornecedores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredFornecedores.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Compras</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(filteredFornecedores.reduce((acc, f) => acc + f.valor_total, 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredFornecedores.reduce((acc, f) => acc + f.total_notas, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                filteredFornecedores.length > 0 
                  ? filteredFornecedores.reduce((acc, f) => acc + f.valor_total, 0) / filteredFornecedores.reduce((acc, f) => acc + f.total_notas, 0)
                  : 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fornecedores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão Social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Total Notas</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFornecedores.slice(0, 50).map((fornecedor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {fornecedor.razao_social}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {fornecedor.cnpj}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {fornecedor.total_notas}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(fornecedor.valor_total)}
                  </TableCell>
                  <TableCell>
                    {fornecedor.ultima_compra ? new Date(fornecedor.ultima_compra).toLocaleDateString('pt-BR') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedFornecedor(fornecedor)}
                        >
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Detalhes do Fornecedor
                          </DialogTitle>
                        </DialogHeader>
                        {selectedFornecedor && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold mb-2">Informações Básicas</h3>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Razão Social:</span> {selectedFornecedor.razao_social}</div>
                                  <div><span className="font-medium">CNPJ:</span> {selectedFornecedor.cnpj}</div>
                                  <div><span className="font-medium">Total de Notas:</span> {selectedFornecedor.total_notas}</div>
                                  <div><span className="font-medium">Valor Total:</span> {formatCurrency(selectedFornecedor.valor_total)}</div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">Contato</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-xs break-all">{selectedFornecedor.endereco}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{selectedFornecedor.telefone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{selectedFornecedor.email}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Principais Produtos</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedFornecedor.produtos_principais.map((produto, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {produto.substring(0, 30)}{produto.length > 30 ? '...' : ''}
                                  </Badge>
                                ))}
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
          {filteredFornecedores.length > 50 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando 50 de {filteredFornecedores.length} fornecedores. Use a busca para refinar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}