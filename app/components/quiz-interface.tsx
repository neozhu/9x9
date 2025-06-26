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
    <div className="mb-6 space-y-4">
      {/* 答题区域 - Enhanced with shadcn/ui */}
      <Card className={cn(
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border border-border/50 shadow-2xl",
        "transition-all duration-300",
        showResult && "scale-[1.02]"
      )}>
        <CardContent className="p-6 sm:p-8 text-center space-y-6">
          {/* Review Mode Badge */}
          {mode === 'review' && (
            <div className="flex justify-center animate-in fade-in-0 slide-in-from-top-4">
              <Badge variant="destructive" className="gap-1.5 text-xs px-3 py-1">
                <BookOpenCheck className="w-3 h-3" />
                <span>{t('quiz.reviewMode')}</span>
              </Badge>
            </div>
          )}
          
          {/* Question Display */}
          <div className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-bold text-foreground",
            "animate-in fade-in-0 zoom-in-95 duration-500",
            mode === 'review' ? "delay-100" : ""
          )}>
            {currentQuestion.multiplicand} × {currentQuestion.multiplier} = ?
          </div>
          
          {!showResult && (
            <>
              {/* Timer Section with Progress */}
              <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-4 delay-200">
                <div className={cn(
                  "text-lg sm:text-xl font-mono flex items-center justify-center gap-2",
                  "transition-colors duration-300",
                  isTimeRunningOut 
                    ? "text-red-500 dark:text-red-400" 
                    : "text-blue-600 dark:text-blue-400"
                )}>
                  <Clock className="w-5 h-5" />
                  <span>{t('quiz.timeLeft', { time: timeLeft })}</span>
                </div>
                
                <div className="max-w-md mx-auto">
                  <Progress 
                    value={timePercentage}
                    className={cn(
                      "h-3 transition-all duration-1000",
                      "[&>div]:transition-all [&>div]:duration-1000",
                      isTimeRunningOut && "[&>div]:bg-red-500"
                    )}
                  />
                </div>
              </div>
              
              {/* Answer Options Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 animate-in fade-in-0 slide-in-from-bottom-4 delay-300">
                {answerOptions.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => onAnswerSelect(option)}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className={cn(
                      "h-16 sm:h-20 text-xl sm:text-2xl font-bold",
                      "transition-all duration-200 backdrop-blur",
                      "bg-background/95 supports-[backdrop-filter]:bg-background/60",
                      selectedAnswer === option
                        ? "scale-105 shadow-lg shadow-primary/25 bg-primary"
                        : "hover:scale-105 hover:border-primary hover:bg-accent shadow-lg hover:shadow-xl"
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
            <div className={cn(
              "space-y-4 animate-in fade-in-0 zoom-in-95 duration-500",
              "text-center"
            )}>
              {/* Result Icon and Status */}
              <div className={cn(
                "flex items-center justify-center gap-3 text-2xl sm:text-3xl font-bold",
                isCorrect ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
              )}>
                <div className={cn(
                  "p-3 rounded-full",
                  isCorrect ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                )}>
                  {isCorrect ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <XCircle className="w-8 h-8" />
                  )}
                </div>
                <span>{isCorrect ? t('common.correct') : t('common.incorrect')}</span>
              </div>
              
              {/* Correct Answer */}
              <div className="space-y-2">
                <div className="text-lg sm:text-xl text-foreground font-medium">
                  {t('quiz.correctAnswer', { answer: currentQuestion.correctAnswer })}
                </div>
                
                {/* User's Answer (if incorrect) */}
                {!isCorrect && selectedAnswer !== null && (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {t('quiz.yourAnswer', { answer: selectedAnswer })}
                  </Badge>
                )}
                
                {/* No Answer Given */}
                {selectedAnswer === null && (
                  <Badge variant="outline" className="text-sm px-3 py-1 text-muted-foreground">
                    {t('quiz.noAnswer')}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 答题统计 - Enhanced with shadcn/ui */}
      <Card className={cn(
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border border-border/50 shadow-lg"
      )}>
        <CardFooter className="p-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-background/50 backdrop-blur">
              {t('quiz.questionsAnswered')}: {questionsAnswered}
            </Badge>
            <Badge variant="outline" className="bg-background/50 backdrop-blur">
              {t('quiz.currentScore')}: {quizScore}
            </Badge>
          </div>
          
          <Button 
            onClick={onStopQuiz}
            variant="destructive"
            size="sm"
            className="h-8 px-3 text-xs backdrop-blur hover:scale-105 transition-all duration-200"
          >
            {t('quiz.stopQuiz')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 