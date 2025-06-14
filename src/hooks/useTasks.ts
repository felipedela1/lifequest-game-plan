
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useAppSettings } from './useAppSettings';

type Task = Tables<'tasks'>;

interface CreateTaskData {
  title: string;
  description?: string;
  category: string;
  priority?: string;
  difficulty?: string;
  due_date?: string;
  estimated_duration?: number;
  tags?: string[];
  notes?: string;
  xp_reward?: number;
}

export const useTasks = () => {
  const { user } = useAuth();
  const { settings } = useAppSettings();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_archived', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks:', error);
          return;
        }

        setTasks(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const calculateXPReward = (difficulty: string = 'normal') => {
    const xpRanges = settings.task_xp_ranges || {
      easy: [10, 25],
      normal: [25, 50],
      hard: [50, 100],
      expert: [100, 200]
    };

    const range = xpRanges[difficulty] || xpRanges.normal;
    const min = range[0];
    const max = range[1];
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const completeTask = async (taskId: string) => {
    if (!user) return;

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error completing task:', error);
        return;
      }

      setTasks(prev => prev.map(task => 
        task.id === taskId ? data : task
      ));

      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createTask = async (taskData: CreateTaskData) => {
    if (!user) return;

    const xpReward =
      typeof taskData.xp_reward === 'number'
        ? taskData.xp_reward
        : calculateXPReward(taskData.difficulty);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id,
          xp_reward: xpReward
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return;
      }

      setTasks(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return { tasks, loading, completeTask, createTask };
};
