-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla base para plantillas de tareas
CREATE TABLE IF NOT EXISTS public.demo_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'normal' CHECK (difficulty IN ('easy', 'normal', 'hard', 'expert')),
  estimated_duration INTEGER,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  tags TEXT[],
  notes TEXT,
  recurring_type TEXT CHECK (recurring_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')),
  recurring_interval INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS y política de solo lectura en demo_tasks
ALTER TABLE public.demo_tasks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Todos pueden ver demo_tasks' AND tablename = 'demo_tasks'
  ) THEN
    CREATE POLICY "Todos pueden ver demo_tasks" ON public.demo_tasks
      FOR SELECT TO authenticated
      USING (true);
  END IF;
END $$;

-- Create tasks table (con enlace a demo_tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  demo_task_id UUID REFERENCES public.demo_tasks(id),
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  difficulty TEXT DEFAULT 'normal' CHECK (difficulty IN ('easy', 'normal', 'hard', 'expert')),
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_duration INTEGER,
  actual_duration INTEGER,
  tags TEXT[],
  notes TEXT,
  reminder_at TIMESTAMP WITH TIME ZONE,
  recurring_type TEXT CHECK (recurring_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')),
  recurring_interval INTEGER DEFAULT 1,
  parent_task_id UUID REFERENCES public.tasks(id),
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table (junction table)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create user stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some default achievements
INSERT INTO public.achievements (title, description, rarity, category, requirement_type, requirement_value)
SELECT * FROM (VALUES
  ('Primer Paso', 'Completa tu primera tarea', 'common', 'Inicio', 'tasks_completed', 1),
  ('Racha de Fuego', 'Mantén una racha de 7 días', 'rare', 'Consistencia', 'streak_days', 7),
  ('Maestro de la Productividad', 'Completa 50 tareas de productividad', 'epic', 'Productividad', 'category_tasks', 50),
  ('Leyenda del Fitness', 'Ejercítate durante 30 días consecutivos', 'legendary', 'Salud', 'category_streak', 30),
  ('Aprendiz Eterno', 'Lee 10 libros completos', 'epic', 'Aprendizaje', 'category_tasks', 10),
  ('Zen Master', 'Medita durante 100 días', 'legendary', 'Bienestar', 'category_tasks', 100)
) AS t(title, description, rarity, category, requirement_type, requirement_value)
WHERE NOT EXISTS (
  SELECT 1 FROM public.achievements a WHERE a.title = t.title
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Users can view their own profile" ON public.profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Users can update their own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Users can insert their own profile" ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- RLS policies for tasks
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own tasks' AND tablename = 'tasks'
  ) THEN
    CREATE POLICY "Users can view their own tasks" ON public.tasks
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own tasks' AND tablename = 'tasks'
  ) THEN
    CREATE POLICY "Users can create their own tasks" ON public.tasks
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own tasks' AND tablename = 'tasks'
  ) THEN
    CREATE POLICY "Users can update their own tasks" ON public.tasks
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own tasks' AND tablename = 'tasks'
  ) THEN
    CREATE POLICY "Users can delete their own tasks" ON public.tasks
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS policies for user_achievements
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own achievements' AND tablename = 'user_achievements'
  ) THEN
    CREATE POLICY "Users can view their own achievements" ON public.user_achievements
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own achievements' AND tablename = 'user_achievements'
  ) THEN
    CREATE POLICY "Users can create their own achievements" ON public.user_achievements
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- RLS policies for user_stats
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own stats' AND tablename = 'user_stats'
  ) THEN
    CREATE POLICY "Users can view their own stats" ON public.user_stats
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own stats' AND tablename = 'user_stats'
  ) THEN
    CREATE POLICY "Users can update their own stats" ON public.user_stats
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own stats' AND tablename = 'user_stats'
  ) THEN
    CREATE POLICY "Users can insert their own stats" ON public.user_stats
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Achievements table is readable by all authenticated users
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Everyone can view achievements' AND tablename = 'achievements'
  ) THEN
    CREATE POLICY "Everyone can view achievements" ON public.achievements
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data ->> 'username');

  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
