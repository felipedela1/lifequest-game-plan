
import { TrendingUp, Target, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsOverviewProps {
  tasksCompleted: number;
  totalTasks: number;
  streak: number;
  totalXP: number;
}

export const StatsOverview = ({ tasksCompleted, totalTasks, streak, totalXP }: StatsOverviewProps) => {
  const completionRate = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Tareas Completadas',
      value: `${tasksCompleted}/${totalTasks}`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Tasa de Éxito',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Racha Actual',
      value: `${streak} días`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'XP Total',
      value: totalXP.toLocaleString(),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
