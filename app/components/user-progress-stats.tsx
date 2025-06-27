import type { UserProgress, Mode } from '@/lib/types';
import { useLocale } from '../hooks/use-locale';
import { Target, CheckCircle, BookOpen, TrendingUp, Award, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
          icon: BookOpen,
          description: t('stats.noWrongQuestions')
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
          icon: BookOpen,
          description: `${initialCount - currentWrongQuestions}/${initialCount} ${t('stats.questions')}`
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
        icon: Target,
        description: `${current}/${userProgress.dailyTarget} ${t('stats.questions')}`
      };
    }
  };

  const taskProgress = getTaskProgress();

  const statsData = [
    {
      label: t('stats.totalCorrectAnswers'),
      value: userProgress.correctAnswers,
      icon: TrendingUp
    },
    {
      label: t('stats.accuracy'),
      value: `${accuracy}%`,
      icon: Award
    },
    {
      label: t('stats.wrongQuestions'),
      value: userProgress.wrongQuestions.length,
      icon: Brain
    }
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* 任务进度（根据模式显示不同内容） */}
      <Card className={cn(
        "gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border border-border/50 shadow-lg transition-all duration-300",
        
      )}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <taskProgress.icon className="w-5 h-5" />
              <span className="text-base">{taskProgress.taskName}</span>
            </div>
            
            {taskProgress.isCompleted && (
              <Badge 
                variant="outline" 
                className="gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                <span>{t('common.completed')}</span>
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{taskProgress.description}</span>
            <Badge variant="secondary" className="font-semibold">
              {Math.round(taskProgress.percentage)}%
            </Badge>
          </div>
          
          <Progress 
            value={Math.min(taskProgress.percentage, 100)}
            className="h-3 transition-all duration-500"
          />
        </CardContent>
      </Card>

      {/* 其他统计 */}
      <div className="grid grid-cols-3 gap-2">
        {statsData.map((stat, index) => (
          <Card 
            key={stat.label}
            className={cn(
              "py-0 text-center transition-all duration-200 hover:scale-105",
              "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
              "border border-border/50 shadow-sm hover:shadow-md",
              "animate-in fade-in-0 slide-in-from-bottom-4"
            )}
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <CardContent className="p-3 space-y-1">
              <div className="text-xl font-bold">
                {stat.value}
              </div>
              
              <div className="text-xs text-muted-foreground leading-tight">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 