
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { day: 'Lun', xp: 120, tasks: 4 },
  { day: 'Mar', xp: 180, tasks: 6 },
  { day: 'Mié', xp: 90, tasks: 3 },
  { day: 'Jue', xp: 220, tasks: 7 },
  { day: 'Vie', xp: 150, tasks: 5 },
  { day: 'Sáb', xp: 200, tasks: 6 },
  { day: 'Dom', xp: 170, tasks: 5 }
];

export const ProgressChart = () => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <TrendingUp className="w-6 h-6 text-game-secondary" />
          Progreso Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  value,
                  name === 'xp' ? 'XP Ganado' : 'Tareas Completadas'
                ]}
              />
              <Bar 
                dataKey="xp" 
                fill="url(#xpGradient)" 
                radius={[4, 4, 0, 0]}
                name="xp"
              />
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
