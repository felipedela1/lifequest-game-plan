
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Achievement = Tables<'achievements'>;
type UserAchievement = Tables<'user_achievements'>;

interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAchievements = async () => {
      try {
        // Fetch all achievements
        const { data: allAchievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*');

        if (achievementsError) {
          console.error('Error fetching achievements:', achievementsError);
          return;
        }

        // Fetch user's unlocked achievements
        const { data: userAchievements, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('*, achievements(*)')
          .eq('user_id', user.id);

        if (userAchievementsError) {
          console.error('Error fetching user achievements:', userAchievementsError);
          return;
        }

        // Combine data
        const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);
        const unlockedMap = new Map(userAchievements?.map(ua => [ua.achievement_id, ua]) || []);

        const combinedAchievements = (allAchievements || []).map(achievement => ({
          ...achievement,
          unlocked: unlockedIds.has(achievement.id),
          unlockedAt: unlockedMap.get(achievement.id)?.unlocked_at
        }));

        setAchievements(combinedAchievements);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  return { achievements, loading };
};
