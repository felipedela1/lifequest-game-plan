
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Task = Tables<'tasks'>;

export const useTasks = () => {
  const { user } = useAuth();
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

  const completeTask = async (taskId: string) => {
    if (!user) return;

    try {
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

  const createTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed' | 'completed_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id
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
