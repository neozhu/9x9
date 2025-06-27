import { CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { useLocale } from '../hooks/use-locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ReviewCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionsCompleted: number;
  score: number;
  type?: 'review' | 'daily';
}

export function ReviewCompleteModal({
  isOpen,
  onClose,
  questionsCompleted,
  score,
  type = 'review'
}: ReviewCompleteModalProps) {
  const { t } = useLocale();

  const isDaily = type === 'daily';
  const title = isDaily ? t('quiz.dailyComplete') : t('quiz.reviewComplete');
  const description = isDaily ? t('quiz.dailyCompleteDesc') : t('quiz.reviewCompleteDesc');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        "border border-border/50 shadow-2xl",
        "animate-in fade-in-0 zoom-in-95 duration-300"
      )}>
        <DialogHeader className="text-center space-y-4">
          {/* Success Icon with Trophy */}
          <div className="flex justify-center">
            <div className={cn(
              "relative w-20 h-20 rounded-full flex items-center justify-center",
              "bg-gradient-to-br shadow-xl transition-all duration-500",
              isDaily 
                ? "from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50" 
                : "from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50",
              "animate-in zoom-in-50 duration-700 delay-200"
            )}>
              <CheckCircle className={cn(
                "w-10 h-10",
                isDaily ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"
              )} />
              
              {/* Floating Trophy */}
              <div className={cn(
                "absolute -top-2 -right-2 w-8 h-8 rounded-full",
                "bg-yellow-100 dark:bg-yellow-900/50 border-2 border-yellow-300 dark:border-yellow-700",
                "flex items-center justify-center shadow-lg",
                "animate-in slide-in-from-top-2 duration-500 delay-500"
              )}>
                <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Title with Sparkles */}
          <DialogTitle className={cn(
            "text-2xl font-bold flex items-center justify-center gap-2",
            "animate-in slide-in-from-bottom-4 duration-500 delay-300",
            isDaily ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"
          )}>
            <Sparkles className="w-6 h-6" />
            <span>{title}</span>
            <Sparkles className="w-6 h-6" />
          </DialogTitle>

          {/* Description */}
          <p className={cn(
            "text-muted-foreground text-center leading-relaxed",
            "animate-in slide-in-from-bottom-4 duration-500 delay-400"
          )}>
            {description}
          </p>
        </DialogHeader>

        {/* Statistics Card */}
        <Card className={cn(
          "bg-background/50 backdrop-blur border border-border/30",
          "animate-in slide-in-from-bottom-4 duration-500 delay-500"
        )}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('quiz.questionsCompleted')}:</span>
              <Badge variant="outline" className="font-semibold">
                {questionsCompleted}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('quiz.finalScore')}:</span>
              <Badge 
                variant="outline"
                className={cn(
                  "font-bold text-base px-3 py-1",
                  isDaily 
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700" 
                    : "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
                )}
              >
                {score}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="pt-2 animate-in slide-in-from-bottom-4 duration-500 delay-600">
          <Button
            onClick={onClose}
            className={cn(
              "w-full h-12 text-base font-medium",
              "bg-gradient-to-r shadow-lg backdrop-blur",
              "transition-all duration-200 hover:scale-[1.02]",
              isDaily 
                ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-blue-500/25" 
                : "from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-green-500/25"
            )}
          >
            {t('common.continue')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 