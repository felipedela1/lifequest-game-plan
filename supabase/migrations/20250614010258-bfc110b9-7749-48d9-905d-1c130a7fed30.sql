
-- Actualizar tabla profiles con más campos
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_push BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMP WITH TIME ZONE;

-- Actualizar tabla tasks con más campos
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'normal' CHECK (difficulty IN ('easy', 'normal', 'hard', 'expert'));
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS estimated_duration INTEGER; -- en minutos
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS actual_duration INTEGER; -- en minutos
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS reminder_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS recurring_type TEXT CHECK (recurring_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly'));
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS recurring_interval INTEGER DEFAULT 1;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES public.tasks(id);
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- Actualizar tabla user_stats con más campos
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS weekly_streak INTEGER DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS monthly_streak INTEGER DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS tasks_completed_today INTEGER DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS tasks_completed_week INTEGER DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS tasks_completed_month INTEGER DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS total_tasks_completed INTEGER DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS average_daily_xp DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS last_activity_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS time_spent_today INTEGER DEFAULT 0; -- en minutos
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS time_spent_total INTEGER DEFAULT 0; -- en minutos

-- Crear tabla de categorías dinámicas
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de configuraciones de la app
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de niveles dinámicos
CREATE TABLE IF NOT EXISTS public.levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level_number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  xp_required INTEGER NOT NULL,
  rewards JSONB, -- {"badges": [], "unlocks": [], "bonuses": {}}
  icon_name TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('achievement', 'level_up', 'reminder', 'system', 'social')),
  is_read BOOLEAN DEFAULT false,
  data JSONB, -- datos adicionales específicos del tipo de notificación
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de badges/insignias
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  condition_type TEXT NOT NULL,
  condition_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de user badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Insertar categorías por defecto
INSERT INTO public.categories (name, description, icon_name, color, is_default) VALUES
('Salud', 'Ejercicio, nutrición y bienestar físico', 'Heart', '#ef4444', true),
('Productividad', 'Trabajo, proyectos y tareas profesionales', 'Briefcase', '#3b82f6', true),
('Aprendizaje', 'Educación, lectura y desarrollo de habilidades', 'BookOpen', '#8b5cf6', true),
('Bienestar', 'Meditación, relajación y salud mental', 'Brain', '#10b981', true),
('Social', 'Familia, amigos y relaciones sociales', 'Users', '#f59e0b', true),
('Hogar', 'Limpieza, organización y tareas domésticas', 'Home', '#6b7280', true),
('Finanzas', 'Presupuesto, ahorros e inversiones', 'DollarSign', '#059669', true),
('Creatividad', 'Arte, música, escritura y proyectos creativos', 'Palette', '#dc2626', true)
ON CONFLICT DO NOTHING;

-- Insertar configuraciones por defecto
INSERT INTO public.app_settings (key, value, description, is_public) VALUES
('xp_per_level_formula', '{"base": 1000, "multiplier": 1.2}', 'Fórmula para calcular XP requerido por nivel', true),
('daily_streak_bonus', '{"multiplier": 1.1, "max_days": 30}', 'Bonificación por racha diaria', true),
('task_xp_ranges', '{"easy": [10, 25], "normal": [25, 50], "hard": [50, 100], "expert": [100, 200]}', 'Rangos de XP por dificultad', true),
('achievement_unlock_sound', '{"enabled": true, "volume": 0.7}', 'Configuración de sonidos', false),
('theme_colors', '{"primary": "#6366f1", "secondary": "#8b5cf6", "accent": "#f59e0b"}', 'Colores del tema', true)
ON CONFLICT DO NOTHING;

-- Insertar niveles dinámicos
INSERT INTO public.levels (level_number, name, description, xp_required, icon_name, color) VALUES
(1, 'Principiante', 'Has comenzado tu viaje', 0, 'Star', '#6b7280'),
(2, 'Explorador', 'Estás encontrando tu ritmo', 1000, 'Compass', '#3b82f6'),
(3, 'Aventurero', 'Tomando impulso', 2200, 'Map', '#8b5cf6'),
(4, 'Guerrero', 'Enfrentando desafíos', 3600, 'Shield', '#ef4444'),
(5, 'Experto', 'Dominando las habilidades', 5200, 'Award', '#f59e0b'),
(6, 'Maestro', 'Sabiduría y experiencia', 7000, 'Crown', '#10b981'),
(7, 'Campeón', 'Superando límites', 9000, 'Trophy', '#dc2626'),
(8, 'Leyenda', 'Inspirando a otros', 11200, 'Zap', '#7c3aed'),
(9, 'Mítico', 'Más allá de lo ordinario', 13600, 'Flame', '#059669'),
(10, 'Ascendido', 'El máximo nivel', 16200, 'Infinity', '#db2777')
ON CONFLICT DO NOTHING;

-- Habilitar RLS en nuevas tablas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorías (lectura pública)
CREATE POLICY "Everyone can view categories" ON public.categories
  FOR SELECT TO authenticated USING (is_active = true);

-- Políticas RLS para configuraciones (lectura pública solo para settings públicos)
CREATE POLICY "Everyone can view public settings" ON public.app_settings
  FOR SELECT TO authenticated USING (is_public = true);

-- Políticas RLS para niveles (lectura pública)
CREATE POLICY "Everyone can view levels" ON public.levels
  FOR SELECT TO authenticated USING (true);

-- Políticas RLS para notificaciones
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para badges (lectura pública)
CREATE POLICY "Everyone can view badges" ON public.badges
  FOR SELECT TO authenticated USING (is_active = true);

-- Políticas RLS para user badges
CREATE POLICY "Users can view their own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Actualizar función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );
  
  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;
