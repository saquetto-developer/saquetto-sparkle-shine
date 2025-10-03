import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Users, 
  TrendingUp,
  Package,
  PieChart as PieChartIcon
} from 'lucide-react'

interface RelatorioTabsProps {
  data: any
  formatCurrency: (value: number) => string
  children: {
    visaoGeral: React.ReactNode
    produtos: React.ReactNode
    clientes: React.ReactNode
    tendencias: React.ReactNode
  }
}

export default function RelatorioTabs({ data, formatCurrency, children }: RelatorioTabsProps) {
  if (!data) return null

  return (
    <Tabs defaultValue="visao-geral" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="visao-geral" className="flex items-center gap-2">
          <PieChartIcon className="h-4 w-4" />
          Visão Geral
        </TabsTrigger>
        <TabsTrigger value="produtos" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Produtos
        </TabsTrigger>
        <TabsTrigger value="clientes" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Clientes
        </TabsTrigger>
        <TabsTrigger value="tendencias" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Tendências
        </TabsTrigger>
      </TabsList>

      <TabsContent value="visao-geral" className="space-y-6">
        {children.visaoGeral}
      </TabsContent>

      <TabsContent value="produtos" className="space-y-6">
        {/* Cards de métricas de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.topProdutos?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Produtos diferentes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produto Top</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.topProdutos?.[0]?.produto?.substring(0, 15) + '...' || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(data.topProdutos?.[0]?.valor || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  data.topProdutos?.length > 0 
                    ? data.topProdutos.reduce((acc: number, p: any) => acc + p.valor, 0) / data.topProdutos.length 
                    : 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">Por produto</p>
            </CardContent>
          </Card>
        </div>
        {children.produtos}
      </TabsContent>

      <TabsContent value="clientes" className="space-y-6">
        {children.clientes}
      </TabsContent>

      <TabsContent value="tendencias" className="space-y-6">
        {children.tendencias}
      </TabsContent>
    </Tabs>
  )
}