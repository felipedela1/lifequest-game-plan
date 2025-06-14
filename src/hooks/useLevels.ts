
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Level = Tables<'levels'>;

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const { data, error } = await supabase
          .from('levels')
          .select('*')
          .order('level_number');

        if (error) {
          console.error('Error fetching levels:', error);
          return;
        }

        setLevels(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const getLevelInfo = (currentLevel: number) => {
    return levels.find(level => level.level_number === currentLevel);
  };

  const getNextLevelInfo = (currentLevel: number) => {
    return levels.find(level => level.level_number === currentLevel + 1);
  };

  const calculateXPToNextLevel = (currentLevel: number, currentXP: number) => {
    const nextLevel = getNextLevelInfo(currentLevel);
    if (!nextLevel) return 0;
    
    const currentLevelInfo = getLevelInfo(currentLevel);
    const currentLevelXP = currentLevelInfo?.xp_required || 0;
    const xpForThisLevel = nextLevel.xp_required - currentLevelXP;
    
    return xpForThisLevel - currentXP;
  };

  return { 
    levels, 
    loading, 
    getLevelInfo, 
    getNextLevelInfo, 
    calculateXPToNextLevel 
  };
};
