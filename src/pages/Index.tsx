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
    const handleCreateDemoTasks = async () => {
      const { data: demoTasks, error } = await supabase
        .from("demo_tasks")
        .select("*");

      if (error) {
        console.error("Error fetching demo tasks:", error);
        toast.error("No se pudieron cargar las tareas de ejemplo");
        return;
      }

      if (!demoTasks || demoTasks.length === 0) {
        toast.error("No hay tareas de ejemplo disponibles");
        return;
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
  };
};
export default Index;
