import { useLocale } from '../hooks/use-locale';
import { CheckCircle, ArrowLeft } from 'lucide-react';

interface DailyTaskCompleteProps {
  onBackToLearn: () => void;
}

export function DailyTaskComplete({ onBackToLearn }: DailyTaskCompleteProps) {
  const { t } = useLocale();

  return (
    <div className="mb-6 space-y-4">
      {/* 任务完成提示 - Glassmorphism Effect */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/30 rounded-xl p-8 text-center shadow-2xl shadow-black/10 dark:shadow-black/30">
        {/* Glassmorphism overlay for extra depth */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>
        
        {/* Content with relative positioning */}
        <div className="relative z-10">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('quiz.dailyTaskCompletedTitle')}
          </h2>
          
          {/* Message */}
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            {t('quiz.dailyTaskCompletedMessage')}
          </p>
          
          {/* Back to Learn Button */}
          <button
            onClick={onBackToLearn}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500/80 dark:bg-blue-600/80 text-white rounded-lg hover:bg-blue-600/90 dark:hover:bg-blue-700/90 transition-all duration-200 backdrop-blur-md shadow-lg shadow-blue-500/25 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t('quiz.backToLearn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 