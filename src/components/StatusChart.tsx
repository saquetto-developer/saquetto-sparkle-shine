import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusChartProps {
  aprovadas: number;
  reprovadas: number;
  alertas: number;
}

export function StatusChart({ aprovadas, reprovadas, alertas }: StatusChartProps) {
  const data = [
    { name: 'Aprovadas', value: aprovadas, color: 'hsl(var(--success))' },
    { name: 'Alertas', value: alertas, color: 'hsl(var(--warning))' },
    { name: 'Reprovadas', value: reprovadas, color: 'hsl(var(--destructive))' }
  ];

  const total = aprovadas + reprovadas + alertas;

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Status das Notas Fiscais</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number) => [
                `${value} notas (${((value / total) * 100).toFixed(1)}%)`, 
                'Quantidade'
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
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
  );
}