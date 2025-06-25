import type { Question, Mode } from '@/lib/types';
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
  return (
    <div className="mb-6 space-y-4">
      {/* 答题区域 */}
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="text-lg mb-4">
          {mode === 'review' && (
            <span className="text-red-500 text-sm flex items-center justify-center space-x-1">
              <BookOpenCheck className="w-4 h-4" />
              <span>错题复习</span>
            </span>
          )}
        </div>
        
        <div className="text-3xl font-bold mb-4">
          {currentQuestion.multiplicand} × {currentQuestion.multiplier} = ?
        </div>
        
        {!showResult && (
          <>
            <div className="mb-6">
              <div className={`text-xl font-mono flex items-center justify-center space-x-2 ${timeLeft <= 3 ? 'text-red-500' : 'text-primary'}`}>
                <Clock className="w-5 h-5" />
                <span>{timeLeft}秒</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    timeLeft <= 3 ? 'bg-red-500' : 'bg-primary'
                  }`}
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* 答案选项按钮 */}
            <div className="grid grid-cols-3 gap-3">
              {answerOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(option)}
                  className={`h-16 text-2xl font-bold rounded-lg border-2 transition-all ${
                    selectedAnswer === option
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                      : 'bg-background border-border hover:border-primary hover:bg-accent'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
        
        {showResult && (
          <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
            <div className="flex items-center justify-center space-x-2">
              {isCorrect ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
              <span>{isCorrect ? '正确！' : '错误'}</span>
            </div>
            <div className="text-lg mt-2">
              正确答案：{currentQuestion.correctAnswer}
            </div>
            {!isCorrect && selectedAnswer !== null && (
              <div className="text-sm text-muted-foreground mt-1">
                你的答案：{selectedAnswer}
              </div>
            )}
            {selectedAnswer === null && (
              <div className="text-sm text-muted-foreground mt-1">
                未选择答案
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 答题统计 */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>本轮答题：{questionsAnswered}</span>
        <span>本轮得分：{quizScore}</span>
        <button 
          onClick={onStopQuiz}
          className="text-red-500 hover:text-red-700"
        >
          结束答题
        </button>
      </div>
    </div>
  );
} 