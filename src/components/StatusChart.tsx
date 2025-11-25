import { Pie, PieChart, Label } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatusChartProps {
  aprovadas: number;
  reprovadas: number;
  alertas: number;
}

const chartConfig = {
  value: { label: "Quantidade" },
  aprovadas: { label: "Aprovadas", color: "hsl(var(--success))" },
  alertas: { label: "Alertas", color: "hsl(var(--warning))" },
  reprovadas: { label: "Reprovadas", color: "hsl(var(--destructive))" },
} satisfies ChartConfig

export function StatusChart({ aprovadas, reprovadas, alertas }: StatusChartProps) {
  const total = aprovadas + reprovadas + alertas

  const chartData = [
    { status: "aprovadas", value: aprovadas, fill: "var(--color-aprovadas)" },
    { status: "alertas", value: alertas, fill: "var(--color-alertas)" },
    { status: "reprovadas", value: reprovadas, fill: "var(--color-reprovadas)" },
  ]

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Status das Notas Fiscais</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {total.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Notas
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Grid de estatisticas mantido */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{aprovadas}</div>
            <div className="text-sm text-muted-foreground">Aprovadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{alertas}</div>
            <div className="text-sm text-muted-foreground">Alertas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{reprovadas}</div>
            <div className="text-sm text-muted-foreground">Reprovadas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
