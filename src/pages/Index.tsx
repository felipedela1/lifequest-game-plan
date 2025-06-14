
import { useState } from 'react';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { DailyTasks } from '@/components/DailyTasks';
import { Achievements } from '@/components/Achievements';
import { ProgressChart } from '@/components/ProgressChart';
import { toast } from 'sonner';

const Index = () => {
  const [userStats, setUserStats] = useState({
    level: 12,
    currentXP: 850,
    xpToNextLevel: 1000,
    totalXP: 15420,
    tasksCompleted: 8,
    totalTasks: 12,
    streak: 7
  });

  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Hacer 30 minutos de ejercicio',
      description: 'Cualquier actividad física que te haga sudar',
      xpReward: 50,
      completed: true,
      category: 'Salud'
    },
    {
      id: '2',
      title: 'Leer 20 páginas de un libro',
      description: 'Continúa con tu lectura actual o empieza uno nuevo',
      xpReward: 40,
      completed: false,
      category: 'Aprendizaje'
    },
    {
      id: '3',
      title: 'Meditar 10 minutos',
      description: 'Practica mindfulness o meditación guiada',
      xpReward: 35,
      completed: true,
      category: 'Bienestar'
    },
    {
      id: '4',
      title: 'Completar 3 tareas importantes',
      description: 'Enfócate en las tareas más importantes del día',
      xpReward: 60,
      completed: false,
      category: 'Productividad'
    },
    {
      id: '5',
      title: 'Beber 2 litros de agua',
      description: 'Mantente hidratado durante todo el día',
      xpReward: 25,
      completed: true,
      category: 'Salud'
    },
    {
      id: '6',
      title: 'Escribir en el diario',
      description: 'Reflexiona sobre tu día y tus pensamientos',
      xpReward: 30,
      completed: false,
      category: 'Bienestar'
    }
  ]);

  const [achievements] = useState([
    {
      id: '1',
      title: 'Primer Paso',
      description: 'Completa tu primera tarea',
      unlocked: true,
      unlockedAt: 'Hace 2 semanas',
      rarity: 'common' as const,
      category: 'Inicio'
    },
    {
      id: '2',
      title: 'Racha de Fuego',
      description: 'Mantén una racha de 7 días',
      unlocked: true,
      unlockedAt: 'Hace 3 días',
      rarity: 'rare' as const,
      category: 'Consistencia'
    },
    {
      id: '3',
      title: 'Maestro de la Productividad',
      description: 'Completa 50 tareas de productividad',
      unlocked: true,
      unlockedAt: 'Hace 1 semana',
      rarity: 'epic' as const,
      category: 'Productividad'
    },
    {
      id: '4',
      title: 'Leyenda del Fitness',
      description: 'Ejercítate durante 30 días consecutivos',
      unlocked: false,
      rarity: 'legendary' as const,
      category: 'Salud'
    },
    {
      id: '5',
      title: 'Aprendiz Eterno',
      description: 'Lee 10 libros completos',
      unlocked: false,
      rarity: 'epic' as const,
      category: 'Aprendizaje'
    },
    {
      id: '6',
      title: 'Zen Master',
      description: 'Medita durante 100 días',
      unlocked: false,
      rarity: 'legendary' as const,
      category: 'Bienestar'
    }
  ]);

  const handleTaskComplete = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: true }
          : task
      )
    );

    const completedTask = tasks.find(task => task.id === taskId);
    if (completedTask) {
      setUserStats(prev => ({
        ...prev,
        currentXP: prev.currentXP + completedTask.xpReward,
        totalXP: prev.totalXP + completedTask.xpReward,
        tasksCompleted: prev.tasksCompleted + 1
      }));

      toast.success(`¡Tarea completada! +${completedTask.xpReward} XP`, {
        description: completedTask.title,
        duration: 3000,
      });

      // Check for level up
      if (userStats.currentXP + completedTask.xpReward >= userStats.xpToNextLevel) {
        setTimeout(() => {
          toast.success('¡Subiste de nivel!', {
            description: `¡Felicidades! Ahora eres nivel ${userStats.level + 1}`,
            duration: 5000,
          });
          setUserStats(prev => ({
            ...prev,
            level: prev.level + 1,
            currentXP: (prev.currentXP + completedTask.xpReward) - prev.xpToNextLevel,
            xpToNextLevel: prev.xpToNextLevel + 200
          }));
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          userLevel={userStats.level}
          currentXP={userStats.currentXP}
          xpToNextLevel={userStats.xpToNextLevel}
          userName="Aventurero"
        />
        
        <StatsOverview 
          tasksCompleted={userStats.tasksCompleted}
          totalTasks={userStats.totalTasks}
          streak={userStats.streak}
          totalXP={userStats.totalXP}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyTasks 
            tasks={tasks}
            onTaskComplete={handleTaskComplete}
          />
          <Achievements achievements={achievements} />
        </div>

        <ProgressChart />
      </div>
    </div>
  );
};

export default Index;
