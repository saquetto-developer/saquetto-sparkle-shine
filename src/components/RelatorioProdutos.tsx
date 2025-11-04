import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'
import { Package } from 'lucide-react'

interface Produto {
  produto: string
  quantidade: number
  valor: number
}

interface RelatorioProdutosProps {
  produtos: Produto[]
  formatCurrency: (value: number) => string
}

export default function RelatorioProdutos({ produtos, formatCurrency }: RelatorioProdutosProps) {
  if (!produtos || produtos.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Top 10 Produtos por Valor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum produto encontrado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5" />
          Top 10 Produtos por Valor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={produtos}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="produto" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value).replace('R$', 'R$').substring(0, 8)}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'valor' ? formatCurrency(Number(value)) : value,
                name === 'valor' ? 'Valor Total' : 'Quantidade'
              ]}
              labelFormatter={(label) => `Produto: ${label}`}
            />
            <Bar 
              dataKey="valor" 
              fill="hsl(var(--primary))" 
              name="valor"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}