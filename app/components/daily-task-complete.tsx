import { useLocale } from '../hooks/use-locale';
import { CheckCircle, ArrowLeft } from 'lucide-react';

interface DailyTaskCompleteProps {
  onBackToLearn: () => void;
  type?: 'daily' | 'review';
}

export function DailyTaskComplete({ onBackToLearn, type = 'daily' }: DailyTaskCompleteProps) {
  const { t } = useLocale();

  return (
    <div className="mb-6 space-y-4">
      {/* 任务完成提示 - Glassmorphism Effect */}
      <div className="relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-xl p-8 text-center shadow-2xl">
        {/* Glassmorphism overlay for extra depth */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-background/10 to-transparent pointer-events-none"></div>
        
        {/* Content with relative positioning */}
        <div className="relative z-10">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {type === 'daily' ? t('quiz.dailyTaskCompletedTitle') : t('quiz.reviewTaskCompletedTitle')}
          </h2>
          
          {/* Message */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {type === 'daily' ? t('quiz.dailyTaskCompletedMessage') : t('quiz.reviewTaskCompletedMessage')}
          </p>
          
          {/* Back to Learn Button */}
          <button
            onClick={onBackToLearn}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 backdrop-blur shadow-lg hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t('quiz.backToLearn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 