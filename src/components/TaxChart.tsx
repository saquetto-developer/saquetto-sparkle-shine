import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TaxChartProps {
  icms: number;
  pis: number;
  cofins: number;
  ipi: number;
}

export function TaxChart({ icms, pis, cofins, ipi }: TaxChartProps) {
  const data = [
    { name: 'ICMS', value: icms, color: 'hsl(var(--primary))' },
    { name: 'PIS', value: pis, color: 'hsl(var(--accent-2))' },
    { name: 'COFINS', value: cofins, color: 'hsl(var(--accent-3))' },
    { name: 'IPI', value: ipi, color: 'hsl(var(--accent-4))' }
  ];

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tributos por Tipo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              stroke="hsl(var(--border))"
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              stroke="hsl(var(--border))"
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}