import type { UserProgress } from '@/lib/types';

interface UserProgressStatsProps {
  userProgress: UserProgress;
}

export function UserProgressStats({ userProgress }: UserProgressStatsProps) {
  const accuracy = userProgress.totalQuestions > 0 
    ? Math.round((userProgress.correctAnswers / userProgress.totalQuestions) * 100) 
    : 0;

  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-primary">{userProgress.streak}</div>
        <div className="text-xs text-muted-foreground">连击</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
        <div className="text-xs text-muted-foreground">准确率</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-blue-600">{userProgress.consecutiveDays}</div>
        <div className="text-xs text-muted-foreground">连续天数</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-purple-600">{userProgress.wrongQuestions.length}</div>
        <div className="text-xs text-muted-foreground">错题数</div>
      </div>
    </div>
  );
} 