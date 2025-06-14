import { Trophy, Medal, Star, Crown, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: string;
  category: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements = ({ achievements }: AchievementsProps) => {
  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-600 bg-gray-100',
      rare: 'text-blue-600 bg-blue-100',
      epic: 'text-purple-600 bg-purple-100',
      legendary: 'text-yellow-600 bg-yellow-100'
    };
    return colors[rarity as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getRarityIcon = (rarity: string) => {
    const icons = {
      common: Medal,
      rare: Star,
      epic: Crown,
      legendary: Trophy
    };
    return icons[rarity as keyof typeof icons] || Medal;
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Trophy className="w-6 h-6 text-game-accent" />
            Logros ({unlockedAchievements.length}/{achievements.length})
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-game-primary to-purple-600 text-white">
            {achievements.length > 0 ? Math.round((unlockedAchievements.length / achievements.length) * 100) : 0}% Completado
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Desbloqueados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedAchievements.map((achievement) => {
                  const Icon = getRarityIcon(achievement.rarity);
                  return (
                    <div 
                      key={achievement.id}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(achievement.unlockedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Por Desbloquear
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lockedAchievements.slice(0, 4).map((achievement) => {
                  const Icon = getRarityIcon(achievement.rarity);
                  return (
                    <div 
                      key={achievement.id}
                      className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg opacity-75 hover:opacity-90 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-200 rounded-full">
                          <Icon className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-600">{achievement.title}</h4>
                          <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                          <Badge className={getRarityColor(achievement.rarity) + ' opacity-75'}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {achievements.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay logros disponibles
              </h3>
              <p className="text-gray-500">
                Los logros aparecerán cuando completes tareas
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
