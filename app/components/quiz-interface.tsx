import type { Question, Mode } from '@/lib/types';
import { useLocale } from '../hooks/use-locale';
import { BookOpenCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

interface QuizInterfaceProps {
  mode: Mode;
  currentQuestion: Question;
  timeLeft: number;
  showResult: boolean;
  isCorrect: boolean;
  selectedAnswer: number | null;
  answerOptions: number[];
  questionsAnswered: number;
  quizScore: number;
  onAnswerSelect: (answer: number) => void;
  onStopQuiz: () => void;
}

export function QuizInterface({
  mode,
  currentQuestion,
  timeLeft,
  showResult,
  isCorrect,
  selectedAnswer,
  answerOptions,
  questionsAnswered,
  quizScore,
  onAnswerSelect,
  onStopQuiz
}: QuizInterfaceProps) {
  const { t } = useLocale();

  return (
    <div className="mb-6 space-y-4">
      {/* 答题区域 - Glassmorphism Effect */}
      <div className="relative supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-gray-900/70 bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-700/30 rounded-xl p-6 text-center shadow-2xl shadow-black/10 dark:shadow-black/30">
        {/* Glassmorphism overlay for extra depth */}
        <div className="absolute inset-0 rounded-xl supports-[backdrop-filter]:bg-gradient-to-br supports-[backdrop-filter]:from-white/10 supports-[backdrop-filter]:to-transparent supports-[backdrop-filter]:dark:from-white/5 supports-[backdrop-filter]:dark:to-transparent bg-gradient-to-br from-white/5 to-transparent dark:from-white/2 dark:to-transparent pointer-events-none"></div>
        
        {/* Content with relative positioning */}
        <div className="relative z-10">
          <div className="text-lg mb-4">
            {mode === 'review' && (
              <span className="text-red-500 dark:text-red-400 text-sm flex items-center justify-center space-x-1">
                <BookOpenCheck className="w-4 h-4" />
                <span>{t('quiz.reviewMode')}</span>
              </span>
            )}
          </div>
          
          <div className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {currentQuestion.multiplicand} × {currentQuestion.multiplier} = ?
          </div>
          
          {!showResult && (
            <>
              <div className="mb-6">
                <div className={`text-xl font-mono flex items-center justify-center space-x-2 ${timeLeft <= 3 ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  <Clock className="w-5 h-5" />
                  <span>{t('quiz.timeLeft', { time: timeLeft })}</span>
                </div>
                <div className="w-full supports-[backdrop-filter]:bg-gray-200/50 supports-[backdrop-filter]:dark:bg-gray-700/50 supports-[backdrop-filter]:backdrop-blur-sm bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      timeLeft <= 3 ? 'bg-red-500 dark:bg-red-400' : 'bg-blue-500 dark:bg-blue-400'
                    }`}
                    style={{ width: `${(timeLeft / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* 答案选项按钮 - Glassmorphism Effect */}
              <div className="grid grid-cols-3 gap-3">
                {answerOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onAnswerSelect(option)}
                    className={`h-16 text-2xl font-bold rounded-lg border-2 transition-all duration-200 supports-[backdrop-filter]:backdrop-blur-md ${
                      selectedAnswer === option
                        ? 'supports-[backdrop-filter]:bg-blue-500/80 supports-[backdrop-filter]:dark:bg-blue-600/80 bg-blue-500 dark:bg-blue-600 text-white border-blue-400/50 dark:border-blue-500/50 shadow-lg shadow-blue-500/25 scale-105'
                        : 'supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-800/60 bg-white/90 dark:bg-gray-800/90 border-white/30 dark:border-gray-600/30 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:supports-[backdrop-filter]:bg-white/80 hover:supports-[backdrop-filter]:dark:bg-gray-700/80 hover:bg-white hover:dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-black/5 dark:shadow-black/20'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
          
          {showResult && (
            <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              <div className="flex items-center justify-center space-x-2">
                {isCorrect ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
                <span>{isCorrect ? t('common.correct') : t('common.incorrect')}</span>
              </div>
              <div className="text-lg mt-2 text-gray-700 dark:text-gray-300">
                {t('quiz.correctAnswer', { answer: currentQuestion.correctAnswer })}
              </div>
              {!isCorrect && selectedAnswer !== null && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('quiz.yourAnswer', { answer: selectedAnswer })}
                </div>
              )}
              {selectedAnswer === null && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('quiz.noAnswer')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 答题统计 - Glassmorphism Effect */}
      <div className="flex justify-between text-sm supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:bg-white/50 supports-[backdrop-filter]:dark:bg-gray-900/50 bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/30 rounded-lg px-4 py-3 shadow-lg shadow-black/5 dark:shadow-black/20">
        <span className="text-gray-700 dark:text-gray-300">{t('quiz.questionsAnswered')}: {questionsAnswered}</span>
        <span className="text-gray-700 dark:text-gray-300">{t('quiz.currentScore')}: {quizScore}</span>
        <button 
          onClick={onStopQuiz}
          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
        >
          {t('quiz.stopQuiz')}
        </button>
      </div>
    </div>
  );
} 