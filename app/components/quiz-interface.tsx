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
      <div className="relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-xl p-6 text-center shadow-2xl">
        {/* Glassmorphism overlay for extra depth */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-background/10 to-transparent pointer-events-none"></div>
        
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
                <div className="w-full bg-muted/50 rounded-full h-2 mt-2 backdrop-blur-sm">
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
                    className={`h-16 text-2xl font-bold rounded-lg border-2 transition-all duration-200 backdrop-blur ${
                      selectedAnswer === option
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105'
                        : 'bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border hover:border-primary hover:bg-accent text-foreground shadow-lg'
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
              <div className="text-lg mt-2 text-foreground">
                {t('quiz.correctAnswer', { answer: currentQuestion.correctAnswer })}
              </div>
              {!isCorrect && selectedAnswer !== null && (
                <div className="text-sm text-muted-foreground mt-1">
                  {t('quiz.yourAnswer', { answer: selectedAnswer })}
                </div>
              )}
              {selectedAnswer === null && (
                <div className="text-sm text-muted-foreground mt-1">
                  {t('quiz.noAnswer')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 答题统计 - Glassmorphism Effect */}
      <div className="flex justify-between text-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-lg px-4 py-3 shadow-lg">
        <span className="text-foreground">{t('quiz.questionsAnswered')}: {questionsAnswered}</span>
        <span className="text-foreground">{t('quiz.currentScore')}: {quizScore}</span>
        <button 
          onClick={onStopQuiz}
          className="text-destructive hover:text-destructive/80 transition-colors duration-200"
        >
          {t('quiz.stopQuiz')}
        </button>
      </div>
    </div>
  );
} 