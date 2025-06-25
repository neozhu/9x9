import type { UserProgress } from '@/lib/types';
import { useLocale } from '../hooks/use-locale';

interface UserProgressStatsProps {
  userProgress: UserProgress;
}

export function UserProgressStats({ userProgress }: UserProgressStatsProps) {
  const { t } = useLocale();
  const accuracy = userProgress.totalQuestions > 0 
    ? Math.round((userProgress.correctAnswers / userProgress.totalQuestions) * 100) 
    : 0;

  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-primary">{userProgress.streak}</div>
        <div className="text-xs text-muted-foreground">{t('stats.streak')}</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
        <div className="text-xs text-muted-foreground">{t('stats.accuracy')}</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-blue-600">{userProgress.consecutiveDays}</div>
        <div className="text-xs text-muted-foreground">{t('stats.consecutiveDays')}</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-purple-600">{userProgress.wrongQuestions.length}</div>
        <div className="text-xs text-muted-foreground">{t('stats.wrongQuestions')}</div>
      </div>
    </div>
  );
} 