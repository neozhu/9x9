import { useLocale } from '../hooks/use-locale';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DailyTaskCompleteProps {
  onBackToLearn: () => void;
  type?: 'daily' | 'review';
}

export function DailyTaskComplete({ onBackToLearn, type = 'daily' }: DailyTaskCompleteProps) {
  const { t } = useLocale();

  return (
    <div className="mb-6 space-y-4">
      <Card 
        className={cn(
          // Glassmorphism effect
          "relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border border-border/50 shadow-2xl",
          // Enhanced visual depth
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br",
          "before:from-background/10 before:to-transparent before:pointer-events-none",
          // Responsive padding
          "p-6 sm:p-8 md:p-10"
        )}
      >
        {/* Glassmorphism overlay for extra depth */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-background/10 to-transparent pointer-events-none" />
        
        <CardContent className="relative z-10 p-0 text-center space-y-6">
          {/* Success Icon with enhanced styling */}
          <div className="flex justify-center">
            <div className={cn(
              "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
              "bg-green-100/80 dark:bg-green-900/30",
              "backdrop-blur border border-green-200/50 dark:border-green-800/50",
              "rounded-full flex items-center justify-center",
              "shadow-lg shadow-green-500/20",
              "animate-in fade-in-0 zoom-in-95 duration-500"
            )}>
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          {/* Title with improved typography */}
          <div className="space-y-2">
            <h2 className={cn(
              "text-xl sm:text-2xl md:text-3xl font-bold text-foreground",
              "tracking-tight leading-tight",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200"
            )}>
              {type === 'daily' ? t('quiz.dailyTaskCompletedTitle') : t('quiz.reviewTaskCompletedTitle')}
            </h2>
            
            {/* Message with better readability */}
            <p className={cn(
              "text-base sm:text-lg text-muted-foreground",
              "leading-relaxed max-w-md mx-auto",
              "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
            )}>
              {type === 'daily' ? t('quiz.dailyTaskCompletedMessage') : t('quiz.reviewTaskCompletedMessage')}
            </p>
          </div>
          
          {/* Enhanced Back to Learn Button */}
          <div className="pt-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
            <Button
              onClick={onBackToLearn}
              size="lg"
              className={cn(
                // Enhanced glassmorphism effect for button
                "bg-primary/90 backdrop-blur supports-[backdrop-filter]:bg-primary/80",
                "border border-primary/20 shadow-lg shadow-primary/25",
                "hover:bg-primary hover:scale-105 hover:shadow-xl hover:shadow-primary/30",
                "transition-all duration-300 ease-out",
                // Responsive sizing
                "h-12 sm:h-14 px-6 sm:px-8",
                "text-sm sm:text-base font-medium",
                "gap-2 sm:gap-3"
              )}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
              <span>{t('quiz.backToLearn')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 