import { CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { useLocale } from '../hooks/use-locale';

interface ReviewCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionsCompleted: number;
  score: number;
  type?: 'review' | 'daily'; // 新增类型属性
}

export function ReviewCompleteModal({
  isOpen,
  onClose,
  questionsCompleted,
  score,
  type = 'review'
}: ReviewCompleteModalProps) {
  const { t } = useLocale();

  if (!isOpen) return null;

  const isDaily = type === 'daily';
  const title = isDaily ? t('quiz.dailyComplete') : t('quiz.reviewComplete');
  const description = isDaily ? t('quiz.dailyCompleteDesc') : t('quiz.reviewCompleteDesc');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-auto shadow-2xl border border-white/20">
        <div className="text-center space-y-4">
          {/* 成功图标 */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-16 h-16 ${isDaily ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-full flex items-center justify-center`}>
                <CheckCircle className={`w-8 h-8 ${isDaily ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
              </div>
              <div className="absolute -top-1 -right-1">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* 标题 */}
          <h2 className={`text-2xl font-bold ${isDaily ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'} flex items-center justify-center space-x-2`}>
            <Sparkles className="w-6 h-6" />
            <span>{title}</span>
            <Sparkles className="w-6 h-6" />
          </h2>

          {/* 描述 */}
          <p className="text-gray-600 dark:text-gray-300">
            {description}
          </p>

          {/* 统计信息 */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('quiz.questionsCompleted')}:</span>
              <span className="font-semibold">{questionsCompleted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('quiz.finalScore')}:</span>
              <span className={`font-semibold ${isDaily ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>{score}</span>
            </div>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className={`w-full ${isDaily ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'} text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-lg`}
          >
            {t('common.continue')}
          </button>
        </div>
      </div>
    </div>
  );
} 