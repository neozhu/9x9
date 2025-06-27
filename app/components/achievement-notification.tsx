import { achievements } from '@/lib/constants';
import { useLocale } from '../hooks/use-locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementNotificationProps {
  newAchievements: string[];
}

export function AchievementNotification({ newAchievements }: AchievementNotificationProps) {
  const { t } = useLocale();
  
  if (newAchievements.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {newAchievements.map((achievementId, index) => {
        const achievement = achievements.find(a => a.id === achievementId);
        return achievement ? (
          <Card 
            key={achievementId}
            className={cn(
              "bg-gradient-to-r from-yellow-500/90 to-amber-500/90 backdrop-blur",
              "border-yellow-300/50 shadow-xl shadow-yellow-500/25",
              "animate-in slide-in-from-right-full duration-500",
              "hover:scale-105 transition-transform"
            )}
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Achievement Icon */}
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur",
                  "rounded-full flex items-center justify-center",
                  "border border-white/30"
                )}>
                  <Trophy className="w-5 h-5 text-yellow-100" />
                </div>
                
                {/* Achievement Content */}
                <div className="flex-1 min-w-0">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "mb-2 bg-white/20 text-white border-white/30",
                      "text-xs font-medium backdrop-blur"
                    )}
                  >
                    {t('achievements.newAchievement')}
                  </Badge>
                  
                  <h4 className="text-white font-semibold text-sm leading-tight">
                    {t(`achievements.${achievement.id}`)}
                  </h4>
                  
                  {/* Optional description */}
                  <p className="text-yellow-100 text-xs mt-1 opacity-90">
                    {t(`achievements.${achievement.id}Desc`)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null;
      })}
    </div>
  );
} 