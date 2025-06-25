import { achievements } from '@/lib/constants';

interface AchievementNotificationProps {
  newAchievements: string[];
}

export function AchievementNotification({ newAchievements }: AchievementNotificationProps) {
  if (newAchievements.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {newAchievements.map(achievementId => {
        const achievement = achievements.find(a => a.id === achievementId);
        return achievement ? (
          <div 
            key={achievementId} 
            className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg animate-bounce"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{achievement.icon}</span>
              <div>
                <div className="font-bold">解锁成就！</div>
                <div className="text-sm">{achievement.name}</div>
              </div>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
} 