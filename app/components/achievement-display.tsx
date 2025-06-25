import { achievements } from '@/lib/constants';
import type { UserProgress } from '@/lib/types';
import { Trophy, Sprout, Flame, Zap, Gem, Calendar, Star, Target } from 'lucide-react';

interface AchievementDisplayProps {
  userProgress: UserProgress;
}

// 图标映射
const iconMap = {
  'Sprout': Sprout,
  'Flame': Flame,
  'Zap': Zap,
  'Gem': Gem,
  'Calendar': Calendar,
  'Star': Star,
  'Target': Target,
  'Trophy': Trophy,
};

export function AchievementDisplay({ userProgress }: AchievementDisplayProps) {
  if (userProgress.achievements.length === 0) return null;

  return (
    <div className="mt-6 bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-bold">已获得成就</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {userProgress.achievements.map(achievementId => {
          const achievement = achievements.find(a => a.id === achievementId);
          if (!achievement) return null;
          
          const IconComponent = iconMap[achievement.icon as keyof typeof iconMap];
          
          return (
            <div 
              key={achievementId} 
              className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded"
            >
              <IconComponent className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-sm font-medium">{achievement.name}</div>
                <div className="text-xs text-muted-foreground">{achievement.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 