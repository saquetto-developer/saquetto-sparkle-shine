import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface MonthlyData {
  month: string;
  count: number;
}

interface MonthlyTrendChartProps {
  data: MonthlyData[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                       'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${monthNames[parseInt(month) - 1]}/${year.slice(-2)}`;
  };

  const formattedData = data.map(item => ({
    ...item,
    monthFormatted: formatMonth(item.month)
  }));

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Tendência Mensal de Notas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="monthFormatted" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              stroke="hsl(var(--border))"
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              stroke="hsl(var(--border))"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number) => [`${value} notas`, 'Quantidade']}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {data.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum dado encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}