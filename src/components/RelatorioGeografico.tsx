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
import { MapPin, Building } from 'lucide-react'

interface Cidade {
  cidade: string
  quantidade: number
  valor: number
}

interface RelatorioGeograficoProps {
  cidades: Cidade[]
  formatCurrency: (value: number) => string
}

export default function RelatorioGeografico({ cidades, formatCurrency }: RelatorioGeograficoProps) {
  if (!cidades || cidades.length === 0) {
    return (
      <div className="space-y-6">
        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cidades Ativas</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Cidades com emissões</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cidade Líder</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">Sem dados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concentração</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">Top 3 cidades</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Top 5 Cidades que Mais Emitem Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma cidade encontrada</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalNotas = cidades.reduce((acc, c) => acc + c.quantidade, 0)
  const top3Concentracao = cidades.slice(0, 3).reduce((acc, c) => acc + c.quantidade, 0)
  const percentualConcentracao = totalNotas > 0 ? (top3Concentracao / totalNotas) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cidades Ativas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cidades.length}</div>
            <p className="text-xs text-muted-foreground">Cidades com emissões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cidade Líder</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cidades[0]?.cidade || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {cidades[0]?.quantidade || 0} notas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concentração</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percentualConcentracao.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Top 3 cidades</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Cidades */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Top 5 Cidades que Mais Emitem Notas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={cidades.slice(0, 5)}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="cidade" 
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'valor' ? formatCurrency(Number(value)) : `${value} notas`,
                  name === 'valor' ? 'Valor Total' : 'Quantidade de Notas'
                ]}
                labelFormatter={(label) => `Cidade: ${label}`}
              />
              <Bar 
                dataKey="quantidade" 
                fill="hsl(var(--accent-2))" 
                name="quantidade"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}