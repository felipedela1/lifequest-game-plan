
import { User, Settings, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  userName: string;
}

export const Header = ({ userLevel, currentXP, xpToNextLevel, userName }: HeaderProps) => {
  const xpProgress = (currentXP / xpToNextLevel) * 100;

  return (
    <header className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-game-primary to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">¡Hola, {userName}!</h1>
            <p className="text-gray-600">Continúa tu aventura de crecimiento personal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="level-badge mb-2">
              Nivel {userLevel}
            </div>
            <div className="text-sm text-gray-600">
              {currentXP}/{xpToNextLevel} XP
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-3 mt-2">
              <div 
                className="xp-bar"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="hover:bg-purple-100">
              <Trophy className="w-5 h-5 text-game-accent" />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-purple-100">
              <Target className="w-5 h-5 text-game-primary" />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-purple-100">
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
