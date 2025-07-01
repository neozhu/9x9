import type { Difficulty } from '@/lib/types';
import { difficultyConfigs } from '@/lib/constants';
import { useLocale } from '../hooks/use-locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Zap, Flame, Gem } from 'lucide-react';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onDifficultySelect: (difficulty: Difficulty) => void;
  onStartQuiz: () => void;
  isReview?: boolean;
}

const difficultyIcons = {
  beginner: Zap,
  advanced: Flame,
  expert: Gem
};

const difficultyColors = {
  beginner: 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20',
  advanced: 'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20',
  expert: 'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20'
};

export function DifficultySelector({
  selectedDifficulty,
  onDifficultySelect,
  onStartQuiz,
  isReview = false
}: DifficultySelectorProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          {isReview ? t('quiz.selectReviewDifficulty') : t('quiz.selectDifficulty')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('quiz.difficultyDescription')}
        </p>
      </div>

      {/* 难度选择卡片 */}
      <div className="grid gap-3">
        {difficultyConfigs.map((config) => {
          const Icon = difficultyIcons[config.id];
          const isSelected = selectedDifficulty === config.id;
          
          return (
            <Card
              key={config.id}
              className={cn(
                "cursor-pointer transition-all duration-200 backdrop-blur",
                "bg-background/95 supports-[backdrop-filter]:bg-background/60",
                "border border-border/50 shadow-lg hover:shadow-xl",
                isSelected && [
                  "ring-2 ring-primary/50 shadow-lg shadow-primary/20",
                  "scale-[1.02] bg-primary/5 dark:bg-primary/10"
                ],
                !isSelected && "hover:scale-[1.01] hover:border-primary/30"
              )}
              onClick={() => onDifficultySelect(config.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full border",
                      difficultyColors[config.id]
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">
                        {t(`quiz.difficulty.${config.id}.name`)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`quiz.difficulty.${config.id}.description`)}
                      </p>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <Badge variant="default" className="ml-2">
                      {t('common.selected')}
                    </Badge>
                  )}
                </div>
                
                {/* 难度范围显示 */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-center text-xs text-muted-foreground">
                    <span>{t('quiz.multiplicationRange')}: {config.multiplicandRange[0]}-{config.multiplicandRange[1]} × {config.multiplierRange[0]}-{config.multiplierRange[1]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 开始按钮 */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={onStartQuiz}
          className={cn(
            "h-12 px-8 text-lg font-bold gap-2",
            "transition-all duration-150 backdrop-blur",
            "bg-primary hover:bg-primary/90 shadow-lg",
            "hover:scale-105"
          )}
        >
          <Zap className="w-4 h-4" />
          {isReview ? t('quiz.startReview') : t('quiz.startQuiz')}
        </Button>
      </div>
    </div>
  );
} 