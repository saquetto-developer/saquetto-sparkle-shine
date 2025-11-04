import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { Calendar, TrendingUp, Activity } from 'lucide-react'

interface TendenciaSemanal {
  semana: string
  quantidade: number
  valor: number
}

interface RelatorioTendenciasProps {
  tendenciasSemanal: TendenciaSemanal[]
  faturamentoMensal: any[]
  formatCurrency: (value: number) => string
}

export default function RelatorioTendencias({ 
  tendenciasSemanal, 
  faturamentoMensal, 
  formatCurrency 
}: RelatorioTendenciasProps) {
  // Calcular crescimento semanal
  const calcularCrescimento = () => {
    if (tendenciasSemanal.length < 2) return 0
    
    const ultimaSemana = tendenciasSemanal[tendenciasSemanal.length - 1]?.quantidade || 0
    const penultimaSemana = tendenciasSemanal[tendenciasSemanal.length - 2]?.quantidade || 0
    
    if (penultimaSemana === 0) return 0
    
    return ((ultimaSemana - penultimaSemana) / penultimaSemana) * 100
  }

  const crescimentoSemanal = calcularCrescimento()
  const totalNotasSemana = tendenciasSemanal.reduce((acc, t) => acc + t.quantidade, 0)
  const mediaSemanal = tendenciasSemanal.length > 0 ? totalNotasSemana / tendenciasSemanal.length : 0

  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento Semanal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${crescimentoSemanal >= 0 ? 'text-success' : 'text-destructive'}`}>
              {crescimentoSemanal >= 0 ? '+' : ''}{crescimentoSemanal.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs. semana anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Semanal</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaSemanal.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">notas por semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...tendenciasSemanal.map(t => t.quantidade)) || 0}
            </div>
            <p className="text-xs text-muted-foreground">notas emitidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Tendência Semanal */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Tendência Semanal de Emissões
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tendenciasSemanal.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={tendenciasSemanal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="semana" 
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'valor' ? formatCurrency(Number(value)) : `${value} notas`,
                    name === 'valor' ? 'Valor Total' : 'Quantidade de Notas'
                  ]}
                  labelFormatter={(label) => `Semana: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantidade" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Dados de tendência insuficientes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Faturamento Mensal (repetido aqui para completar a aba) */}
      {faturamentoMensal.length > 0 && (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Evolução Mensal do Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faturamentoMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace('R$', 'R$').substring(0, 8)} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Faturamento']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar 
                  dataKey="valor" 
                  fill="hsl(var(--accent-3))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}