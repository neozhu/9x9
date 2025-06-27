import { achievements } from '@/lib/constants';
import type { UserProgress } from '@/lib/types';
import { useLocale } from '../hooks/use-locale';
import { Trophy, Sprout, Flame, Zap, Gem, Calendar, Star, Target, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  'CheckCircle': CheckCircle,
};

export function AchievementDisplay({ userProgress }: AchievementDisplayProps) {
  const { t } = useLocale();
  
  if (userProgress.achievements.length === 0) return null;

  return (
    <Card className={cn(
      "mt-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "border border-border/50 shadow-lg"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
          <span>{t('achievements.earnedTitle')}</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {userProgress.achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {userProgress.achievements.map((achievementId, index) => {
            const achievement = achievements.find(a => a.id === achievementId);
            if (!achievement) return null;
            
            const IconComponent = iconMap[achievement.icon as keyof typeof iconMap];
            
            return (
              <div 
                key={achievementId} 
                className={cn(
                  "group relative flex items-center gap-3 p-3",
                  "bg-gradient-to-r from-yellow-50/80 to-amber-50/80",
                  "dark:from-yellow-950/30 dark:to-amber-950/30",
                  "border border-yellow-200/50 dark:border-yellow-800/50",
                  "rounded-lg backdrop-blur transition-all duration-200",
                  "hover:shadow-md hover:scale-[1.02]",
                  "animate-in fade-in-0 slide-in-from-bottom-4",
                )}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'backwards'
                }}
              >
                {/* Achievement Icon */}
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 bg-yellow-100/80 dark:bg-yellow-900/50",
                  "border border-yellow-300/50 dark:border-yellow-700/50",
                  "rounded-full flex items-center justify-center",
                  "group-hover:scale-110 transition-transform duration-200"
                )}>
                  <IconComponent className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                
                {/* Achievement Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 leading-tight">
                    {t(`achievements.${achievement.id}`)}
                  </h4>
                  <p className="text-xs text-yellow-700/80 dark:text-yellow-300/80 mt-1 leading-relaxed">
                    {t(`achievements.${achievement.id}Desc`)}
                  </p>
                </div>
                
                {/* Completion Badge */}
                <Badge 
                  variant="outline" 
                  className={cn(
                    "absolute -top-1 -right-1 w-6 h-6 rounded-full p-0",
                    "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
                    "border-green-300/50 dark:border-green-700/50",
                    "flex items-center justify-center"
                  )}
                >
                  <CheckCircle className="w-3 h-3" />
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 