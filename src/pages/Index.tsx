
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { DailyTasks } from '@/components/DailyTasks';
import { Achievements } from '@/components/Achievements';
import { ProgressChart } from '@/components/ProgressChart';
import { useUserStats } from '@/hooks/useUserStats';
import { useTasks } from '@/hooks/useTasks';
import { useAchievements } from '@/hooks/useAchievements';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { stats, loading: statsLoading, updateStats } = useUserStats();
  const { tasks, loading: tasksLoading, completeTask, createTask } = useTasks();
  const { achievements, loading: achievementsLoading } = useAchievements();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleTaskComplete = async (taskId: string) => {
    const completedTask = await completeTask(taskId);
    if (!completedTask || !stats) return;

    const newXP = stats.current_xp + completedTask.xp_reward;
    const xpToNextLevel = stats.level * 1000; // Simple formula for leveling
    
    let newLevel = stats.level;
    let finalXP = newXP;

    // Check for level up
    if (newXP >= xpToNextLevel) {
      newLevel = stats.level + 1;
      finalXP = newXP - xpToNextLevel;
      
      toast.success('¡Subiste de nivel!', {
        description: `¡Felicidades! Ahora eres nivel ${newLevel}`,
        duration: 5000,
      });
    }

    await updateStats({
      current_xp: finalXP,
      total_xp: stats.total_xp + completedTask.xp_reward,
      level: newLevel
    });

    toast.success(`¡Tarea completada! +${completedTask.xp_reward} XP`, {
      description: completedTask.title,
      duration: 3000,
    });
  };

  const handleCreateDemoTasks = async () => {
    const demoTasks = [
      {
        title: 'Hacer 30 minutos de ejercicio',
        description: 'Cualquier actividad física que te haga sudar',
        xp_reward: 50,
        category: 'Salud'
      },
      {
        title: 'Leer 20 páginas de un libro',
        description: 'Continúa con tu lectura actual o empieza uno nuevo',
        xp_reward: 40,
        category: 'Aprendizaje'
      },
      {
        title: 'Meditar 10 minutos',
        description: 'Practica mindfulness o meditación guiada',
        xp_reward: 35,
        category: 'Bienestar'
      }
    ];

    for (const task of demoTasks) {
      await createTask(task);
    }

    toast.success('¡Tareas de ejemplo creadas!');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || statsLoading || tasksLoading || achievementsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user || !stats) {
    return null;
  }

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {tasks.length === 0 && (
              <Button 
                onClick={handleCreateDemoTasks}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear tareas de ejemplo
              </Button>
            )}
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>

        <Header 
          userLevel={stats.level}
          currentXP={stats.current_xp}
          xpToNextLevel={stats.level * 1000}
          userName={user.user_metadata?.username || user.email?.split('@')[0] || 'Aventurero'}
        />
        
        <StatsOverview 
          tasksCompleted={completedTasks}
          totalTasks={totalTasks}
          streak={stats.streak}
          totalXP={stats.total_xp}
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
