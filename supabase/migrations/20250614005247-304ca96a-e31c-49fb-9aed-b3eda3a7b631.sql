-- ===========================================
--  Tabla: perfiles de usuario
-- ===========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Users can view their own profile" ON public.profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can update their own profile' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Users can update their own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can insert their own profile' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Users can insert their own profile" ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- ===========================================
--  Tabla: demo_tasks (plantillas base)
-- ===========================================
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

ALTER TABLE public.demo_tasks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Todos pueden ver demo_tasks'
      AND tablename = 'demo_tasks'
  ) THEN
    CREATE POLICY "Todos pueden ver demo_tasks" ON public.demo_tasks
      FOR SELECT TO authenticated
      USING (true);
  END IF;
END $$;

-- ===========================================
--  Tabla: tasks
-- ===========================================
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

-- Asegurar que demo_task_id existe (por si tabla ya existía sin él)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS demo_task_id UUID REFERENCES public.demo_tasks(id);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own tasks'
      AND tablename = 'tasks'
  ) THEN
    CREATE POLICY "Users can view their own tasks" ON public.tasks
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own tasks'
      AND tablename = 'tasks'
  ) THEN
    CREATE POLICY "Users can create their own tasks" ON public.tasks
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own tasks'
      AND tablename = 'tasks'
  ) THEN
    CREATE POLICY "Users can update their own tasks" ON public.tasks
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own tasks'
      AND tablename = 'tasks'
  ) THEN
    CREATE POLICY "Users can delete their own tasks" ON public.tasks
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
