import type { UserProgress, Mode } from '@/lib/types';
import { useLocale } from '../hooks/use-locale';
import { Target, CheckCircle, BookOpen } from 'lucide-react';

interface UserProgressStatsProps {
  userProgress: UserProgress;
  mode: Mode;
  initialWrongQuestionsCount?: number;
}

export function UserProgressStats({ userProgress, mode, initialWrongQuestionsCount = 0 }: UserProgressStatsProps) {
  const { t } = useLocale();
  const accuracy = userProgress.totalQuestions > 0 
    ? Math.round((userProgress.correctAnswers / userProgress.totalQuestions) * 100) 
    : 0;

  // 根据模式计算不同的进度数据
  const getTaskProgress = () => {
    if (mode === 'review') {
      // 复习模式：显示错题复习进度
      const currentWrongQuestions = userProgress.wrongQuestions.length;
      const isCompleted = currentWrongQuestions === 0;
      const initialCount = Math.max(initialWrongQuestionsCount, currentWrongQuestions);
      
      if (isCompleted) {
        // 复习完成，显示100%
        return {
          current: 0,
          total: initialCount || 1,
          percentage: 100,
          isCompleted: true,
          taskName: t('stats.reviewTask'),
          icon: BookOpen
        };
      } else {
        // 复习进行中，计算已完成的百分比
        const completedCount = initialCount - currentWrongQuestions;
        const percentage = initialCount > 0 ? (completedCount / initialCount) * 100 : 0;
        return {
          current: currentWrongQuestions,
          total: initialCount,
          percentage,
          isCompleted: false,
          taskName: t('stats.reviewTask'),
          icon: BookOpen
        };
      }
    } else {
      // 答题模式：显示每日任务进度
      const current = Math.min(userProgress.dailyQuestionsAnswered, userProgress.dailyTarget);
      const percentage = (current / userProgress.dailyTarget) * 100;
      return {
        current,
        total: userProgress.dailyTarget,
        percentage,
        isCompleted: userProgress.dailyTaskCompleted,
        taskName: t('stats.dailyTask'),
        icon: Target
      };
    }
  };

  const taskProgress = getTaskProgress();

  return (
    <div className="mb-6 space-y-4">
      {/* 任务进度（根据模式显示不同内容） */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <taskProgress.icon className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{taskProgress.taskName}</span>
          </div>
          {taskProgress.isCompleted && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{t('common.completed')}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-sm mb-1">
          {mode === 'review' ? (
            <span>
              {taskProgress.isCompleted 
                ? t('stats.noWrongQuestions') 
                : `${taskProgress.total - taskProgress.current}/${taskProgress.total} ${t('stats.questions')}`
              }
            </span>
          ) : (
            <span>{taskProgress.current}/{taskProgress.total} {t('stats.questions')}</span>
          )}
          <span className="font-medium">{Math.round(taskProgress.percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              taskProgress.isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(taskProgress.percentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* 其他统计 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{userProgress.correctAnswers}</div>
          <div className="text-xs text-muted-foreground">{t('stats.totalCorrectAnswers')}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
          <div className="text-xs text-muted-foreground">{t('stats.accuracy')}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{userProgress.wrongQuestions.length}</div>
          <div className="text-xs text-muted-foreground">{t('stats.wrongQuestions')}</div>
        </div>
      </div>
    </div>
  );
} 