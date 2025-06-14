import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { StatsOverview } from "@/components/StatsOverview";
import { DailyTasks } from "@/components/DailyTasks";
import { Achievements } from "@/components/Achievements";
import { ProgressChart } from "@/components/ProgressChart";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { useUserStats } from "@/hooks/useUserStats";
import { useTasks } from "@/hooks/useTasks";
import { useAchievements } from "@/hooks/useAchievements";
import { useLevels } from "@/hooks/useLevels";
import { useAppSettings } from "@/hooks/useAppSettings";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { stats, loading: statsLoading, updateStats } = useUserStats();
  const { tasks, loading: tasksLoading, completeTask, createTask } = useTasks();
  const { achievements, loading: achievementsLoading } = useAchievements();
  const { calculateXPToNextLevel } = useLevels();
  const { settings } = useAppSettings();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Manejar confirmación de email
  useEffect(() => {
    if (searchParams.get("confirmed") === "true") {
      toast.success(
        "¡Email confirmado exitosamente! Bienvenido a LifeQuest 🎉"
      );
    }
  }, [searchParams]);

  const handleTaskComplete = async (taskId: string) => {
    const completedTask = await completeTask(taskId);
    if (!completedTask || !stats) return;

    const newXP = stats.current_xp + completedTask.xp_reward;
    const xpToNextLevel = calculateXPToNextLevel(stats.level, stats.current_xp);

    let newLevel = stats.level;
    let finalXP = newXP;

    // Check for level up
    if (newXP >= xpToNextLevel) {
      newLevel = stats.level + 1;
      finalXP = newXP - xpToNextLevel;

      toast.success("¡Subiste de nivel!", {
        description: `¡Felicidades! Ahora eres nivel ${newLevel}`,
        duration: 5000,
      });
    }

    await updateStats({
      current_xp: finalXP,
      total_xp: stats.total_xp + completedTask.xp_reward,
      level: newLevel,
      total_tasks_completed: (stats.total_tasks_completed || 0) + 1,
      tasks_completed_today: (stats.tasks_completed_today || 0) + 1,
      last_activity_date: new Date().toISOString().split("T")[0],
    });

    toast.success(`¡Tarea completada! +${completedTask.xp_reward} XP`, {
      description: completedTask.title,
      duration: 3000,
    });
  };

  const handleCreateDemoTasks = async () => {
    const { data, error } = await supabase
      .rpc('get_random_demo_task')
      .single();

    if (error) {
      console.error('Error fetching demo tasks:', error);
      toast.error('No se pudieron cargar las tareas de ejemplo');
      return;
    }

    if (!data) {
    const task = data;
      toast.error('No hay tareas de ejemplo disponibles');
      return;


    for (const task of demoTasks) {
      await createTask({
        title: task.title,
        description: task.description || undefined,
        category: task.category,
        priority: task.priority || undefined,
        difficulty: task.difficulty || undefined,
        estimated_duration: task.estimated_duration || undefined,
        tags: task.tags || undefined,
        notes: task.notes || undefined,
        xp_reward: task.xp_reward,
      });

    }

    const task = demoTasks[Math.floor(Math.random() * demoTasks.length)];

    await createTask({
      title: task.title,
      description: task.description || undefined,
      category: task.category,
      priority: task.priority || undefined,
      difficulty: task.difficulty || undefined,
      estimated_duration: task.estimated_duration || undefined,
      tags: task.tags || undefined,
      notes: task.notes || undefined,
      xp_reward: task.xp_reward,
    });

    toast.success("¡Tarea de ejemplo creada!");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
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

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const allTasksCompleted = tasks.length > 0 && completedTasks === tasks.length;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
            {(tasks.length === 0 || allTasksCompleted) && (
              <Button onClick={handleCreateDemoTasks} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                {tasks.length === 0
                  ? "Crear tareas de ejemplo"
                  : "Crear nuevas tareas diarias"}
              </Button>
            )}
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>

        <Header
          userLevel={stats.level}
          currentXP={stats.current_xp}
          xpToNextLevel={calculateXPToNextLevel(stats.level, stats.current_xp)}
          userName={
            user.user_metadata?.username ||
            user.email?.split("@")[0] ||
            "Aventurero"
          }
        />

        <StatsOverview
          tasksCompleted={completedTasks}
          totalTasks={totalTasks}
          streak={stats.streak}
          totalXP={stats.total_xp}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyTasks tasks={tasks} onTaskComplete={handleTaskComplete} />
          <Achievements achievements={achievements} />
        </div>

        <ProgressChart />

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <CreateTaskForm onClose={() => setShowCreateForm(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
