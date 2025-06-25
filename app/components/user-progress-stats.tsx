import type { UserProgress } from '@/lib/types';
import { useLocale } from '../hooks/use-locale';
import { Target, CheckCircle } from 'lucide-react';

interface UserProgressStatsProps {
  userProgress: UserProgress;
}

export function UserProgressStats({ userProgress }: UserProgressStatsProps) {
  const { t } = useLocale();
  const accuracy = userProgress.totalQuestions > 0 
    ? Math.round((userProgress.correctAnswers / userProgress.totalQuestions) * 100) 
    : 0;

  const dailyProgress = Math.min(userProgress.dailyQuestionsAnswered, userProgress.dailyTarget);
  const dailyProgressPercentage = (dailyProgress / userProgress.dailyTarget) * 100;

  return (
    <div className="mb-6 space-y-4">
      {/* 每日任务进度 */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{t('stats.dailyTask')}</span>
          </div>
          {userProgress.dailyTaskCompleted && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{t('common.completed')}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span>{dailyProgress}/{userProgress.dailyTarget} {t('stats.questions')}</span>
          <span className="font-medium">{Math.round(dailyProgressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              userProgress.dailyTaskCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(dailyProgressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* 其他统计 */}
      <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
} 