import type { Question, Mode } from '@/lib/types';
import { useLocale } from '../hooks/use-locale';
import { BookOpenCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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

  const timePercentage = (timeLeft / 10) * 100;
  const isTimeRunningOut = timeLeft <= 3;

  return (
    <div className="mb-4 space-y-3">
      {/* 答题区域 - Compact with glassmorphism */}
      <Card className={cn(
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border border-border/50 shadow-xl",
        "transition-transform duration-200",
        showResult && "scale-[1.01]"
      )}>
        <CardContent className="p-4 sm:p-6 text-center space-y-4">
          {/* Review Mode Badge */}
          {mode === 'review' && (
            <div className="flex justify-center">
              <Badge variant="destructive" className="gap-1 text-xs px-2.5 py-0.5">
                <BookOpenCheck className="w-3 h-3" />
                <span>{t('quiz.reviewMode')}</span>
              </Badge>
            </div>
          )}
          
          {/* Question Display */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            {currentQuestion.multiplicand} × {currentQuestion.multiplier} = ?
          </div>
          
          {!showResult && (
            <>
              {/* Timer Section with Progress */}
              <div className="space-y-2">
                <div className={cn(
                  "text-base sm:text-lg font-mono flex items-center justify-center gap-2",
                  "transition-colors duration-300",
                  isTimeRunningOut 
                    ? "text-red-500 dark:text-red-400" 
                    : "text-blue-600 dark:text-blue-400"
                )}>
                  <Clock className="w-4 h-4" />
                  <span>{t('quiz.timeLeft', { time: timeLeft })}</span>
                </div>
                
                <div className="max-w-xs mx-auto">
                  <Progress 
                    value={timePercentage}
                    className={cn(
                      "h-2 transition-all duration-1000",
                      "[&>div]:transition-all [&>div]:duration-1000",
                      isTimeRunningOut && "[&>div]:bg-red-500"
                    )}
                  />
                </div>
              </div>
              
              {/* Answer Options Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {answerOptions.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => onAnswerSelect(option)}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className={cn(
                      "h-12 sm:h-14 text-lg sm:text-xl font-bold",
                      "transition-all duration-150 backdrop-blur",
                      "bg-background/95 supports-[backdrop-filter]:bg-background/60",
                      selectedAnswer === option
                        ? "scale-105 shadow-md shadow-primary/20 bg-primary"
                        : "hover:scale-102 hover:border-primary hover:bg-accent shadow-md"
                    )}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </>
          )}
          
          {/* Result Display */}
          {showResult && (
            <div className="space-y-3 text-center">
              {/* Result Icon and Status */}
              <div className={cn(
                "flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold",
                isCorrect ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
              )}>
                <div className={cn(
                  "p-2 rounded-full",
                  isCorrect ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                )}>
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>
                <span>{isCorrect ? t('common.correct') : t('common.incorrect')}</span>
              </div>
              
              {/* Correct Answer */}
              <div className="space-y-1.5">
                <div className="text-base sm:text-lg text-foreground font-medium">
                  {t('quiz.correctAnswer', { answer: currentQuestion.correctAnswer })}
                </div>
                
                {/* User's Answer (if incorrect) */}
                {!isCorrect && selectedAnswer !== null && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {t('quiz.yourAnswer', { answer: selectedAnswer })}
                  </Badge>
                )}
                
                {/* No Answer Given */}
                {selectedAnswer === null && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                    {t('quiz.noAnswer')}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 答题统计 - Compact stats */}
      <Card className={cn(
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border border-border/50 shadow-md"
      )}>
        <CardFooter className="p-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-background/50 backdrop-blur text-xs px-2 py-0.5">
              {t('quiz.questionsAnswered')}: {questionsAnswered}
            </Badge>
            <Badge variant="outline" className="bg-background/50 backdrop-blur text-xs px-2 py-0.5">
              {t('quiz.currentScore')}: {quizScore}
            </Badge>
          </div>
          
          <Button 
            onClick={onStopQuiz}
            variant="destructive"
            size="sm"
            className="h-7 px-2.5 text-xs backdrop-blur hover:scale-105 transition-transform duration-150"
          >
            {t('quiz.stopQuiz')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 