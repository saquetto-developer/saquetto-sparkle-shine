import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, TrendingUp } from 'lucide-react'

interface Cliente {
  cliente: string
  total: number
  valor: number
}

interface RelatorioClientesProps {
  clientes: Cliente[]
  formatCurrency: (value: number) => string
}

export default function RelatorioClientes({ clientes, formatCurrency }: RelatorioClientesProps) {
  const maxTotal = clientes.length > 0 ? Math.max(...clientes.map(c => c.total)) : 0

  if (!clientes || clientes.length === 0) {
    return (
      <div className="space-y-6">
        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Clientes ativos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cliente Top</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">Sem dados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 0</div>
              <p className="text-xs text-muted-foreground">Por cliente</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Top 10 Clientes por Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum cliente encontrado</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const valorTotalClientes = clientes.reduce((acc, c) => acc + c.valor, 0)
  const ticketMedio = valorTotalClientes / clientes.length

  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
            <p className="text-xs text-muted-foreground">Clientes ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliente Top</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientes[0]?.cliente?.substring(0, 15) + '...' || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(clientes[0]?.valor || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(ticketMedio)}</div>
            <p className="text-xs text-muted-foreground">Por cliente</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Top Clientes */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Top 10 Clientes por Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientes.map((cliente, index) => (
              <div key={cliente.cliente} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-sm truncate max-w-[200px]" title={cliente.cliente}>
                      {cliente.cliente}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{cliente.total} notas</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(cliente.valor)}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${maxTotal > 0 ? (cliente.total / maxTotal) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}