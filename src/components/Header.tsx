
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLevels } from "@/hooks/useLevels";
import { Star, Trophy, Zap } from "lucide-react";

interface HeaderProps {
  userLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  userName: string;
}

export const Header = ({ userLevel, currentXP, xpToNextLevel, userName }: HeaderProps) => {
  const { getLevelInfo, getNextLevelInfo, calculateXPToNextLevel } = useLevels();
  
  const currentLevelInfo = getLevelInfo(userLevel);
  const nextLevelInfo = getNextLevelInfo(userLevel);
  const actualXPToNext = calculateXPToNextLevel(userLevel, currentXP);
  
  const totalXPForCurrentLevel = nextLevelInfo ? 
    nextLevelInfo.xp_required - (currentLevelInfo?.xp_required || 0) : 
    1000;
  
  const progressPercentage = Math.max(0, Math.min(100, 
    ((totalXPForCurrentLevel - actualXPToNext) / totalXPForCurrentLevel) * 100
  ));

  const getLevelIcon = (iconName?: string) => {
    const icons = {
      Star: Star,
      Trophy: Trophy,
      Zap: Zap
    };
    const IconComponent = iconName ? icons[iconName as keyof typeof icons] : Star;
    return IconComponent || Star;
  };

  const LevelIcon = getLevelIcon(currentLevelInfo?.icon_name);

  return (
    <Card className="glass-card mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: currentLevelInfo?.color || '#6366f1' }}
            >
              <LevelIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                ¡Hola, {userName}! 👋
              </h1>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="text-white"
                  style={{ backgroundColor: currentLevelInfo?.color || '#6366f1' }}
                >
                  Nivel {userLevel} - {currentLevelInfo?.name || 'Aventurero'}
                </Badge>
                <span className="text-sm text-gray-600">
                  {currentXP} XP
                </span>
              </div>
              {currentLevelInfo?.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {currentLevelInfo.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Progreso al siguiente nivel
              </span>
              <span className="text-sm text-gray-500">
                {actualXPToNext} XP restantes
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3"
            />
            {nextLevelInfo && (
              <div className="text-xs text-gray-500 mt-1 text-center">
                Próximo: {nextLevelInfo.name}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
