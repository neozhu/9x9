'use client';

import { useState, useEffect, useCallback } from "react";
import { Header } from "./header";
import { AchievementNotification } from "./components/achievement-notification";
import { UserProgressStats } from "./components/user-progress-stats";
import { QuizInterface } from "./components/quiz-interface";
import { LearnMode } from "./components/learn-mode";
import { AchievementDisplay } from "./components/achievement-display";
import { ReviewCompleteModal } from "./components/review-complete-modal";
import { useUserProgress } from "./hooks/use-user-progress";
import { useLocale } from "./hooks/use-locale";
import { 
  generateRandomQuestion, 
  generateReviewQuestion, 
  generateAnswerOptions,
  speakFormula 
} from "@/lib/multiplication-utils";
import type { Question, Mode } from "@/lib/types";

export default function Home() {
  // 国际化
  const { locale } = useLocale();

  // 状态管理
  const [mode, setMode] = useState<Mode>('learn');
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  
  // 答题模式状态
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerOptions, setAnswerOptions] = useState<number[]>([]);
  const [showReviewComplete, setShowReviewComplete] = useState(false);
  const [showDailyComplete, setShowDailyComplete] = useState(false);
  const [completionStats, setCompletionStats] = useState({ questionsCompleted: 0, score: 0 });
  
  // 用户进度管理
  const {
    userProgress,
    newAchievements,
    setUserProgress,
    loadProgress,
    updateProgress,
    removeFromWrongQuestions
  } = useUserProgress();

  // 初始化
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
    
    const progress = loadProgress();
    setUserProgress(progress);
    
    return () => speechSynthesis.cancel();
  }, [loadProgress, setUserProgress]);

  // 停止答题
  const stopQuiz = useCallback(() => {
    setIsQuizActive(false);
    setShowResult(false);
    setCurrentQuestion(null);
    setQuizScore(0);
    setQuestionsAnswered(0);
  }, []);

  // 开始答题
  const startQuiz = useCallback((isReview = false) => {
    const question = isReview 
      ? generateReviewQuestion(userProgress.wrongQuestions) 
      : generateRandomQuestion();
    if (!question) return;
    
    setCurrentQuestion(question);
    setAnswerOptions(generateAnswerOptions(question.correctAnswer));
    setSelectedAnswer(null);
    setTimeLeft(10);
    setIsQuizActive(true);
    setShowResult(false);
    
    // 朗读题目
    speakFormula(question.multiplicand, question.multiplier, speechEnabled, speechSupported, locale);
  }, [userProgress.wrongQuestions, speechEnabled, speechSupported, locale]);

  // 提交答案
  const handleAnswerSubmit = useCallback((directAnswer?: number) => {
    if (!currentQuestion) return;
    
    const answer = directAnswer || selectedAnswer || 0;
    const correct = answer === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setIsQuizActive(false);
    
    let updatedProgress = userProgress;
    
    if (correct && mode === 'review') {
      // 如果是复习模式且答对了，从错题本中移除该题目
      updatedProgress = removeFromWrongQuestions(currentQuestion.multiplicand, currentQuestion.multiplier);
      setQuizScore(quizScore + 1);
    } else if (correct) {
      setQuizScore(quizScore + 1);
    }
    
    // 更新进度
    const wrongQuestion = !correct ? {
      multiplicand: currentQuestion.multiplicand,
      multiplier: currentQuestion.multiplier,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      timestamp: Date.now()
    } : undefined;
    
    const newProgress = updateProgress(correct, wrongQuestion);
    setQuestionsAnswered(questionsAnswered + 1);

    // 3秒后自动下一题或结束任务
    setTimeout(() => {
      setShowResult(false);
      
      // 检查是否完成每日任务
      if (mode === 'quiz' && newProgress.dailyTaskCompleted) {
        // 保存当前数据，因为stopQuiz会重置这些值
        const currentScore = correct ? quizScore + 1 : quizScore;
        // 对于每日任务，使用每日答题总数
        setCompletionStats({ questionsCompleted: newProgress.dailyQuestionsAnswered, score: currentScore });
        setMode('learn');
        stopQuiz();
        // 显示每日任务完成模态框，使用保存的数据
        setTimeout(() => {
          setShowDailyComplete(true);
        }, 100);
        return;
      }
      
      // 如果是复习模式且错题本已清空，结束复习
      if (mode === 'review') {
        const currentWrongQuestions = correct ? updatedProgress.wrongQuestions : newProgress.wrongQuestions;
        if (currentWrongQuestions.length === 0) {
          // 保存当前数据
          const currentQuestionsAnswered = questionsAnswered + 1;
          const currentScore = correct ? quizScore + 1 : quizScore;
          setCompletionStats({ questionsCompleted: currentQuestionsAnswered, score: currentScore });
          setMode('learn');
          stopQuiz();
          // 显示复习完成模态框，使用保存的数据
          setTimeout(() => {
            setShowReviewComplete(true);
          }, 100);
        } else {
          startQuiz(true);
        }
      } else {
        startQuiz(false);
      }
    }, 3000);
  }, [currentQuestion, selectedAnswer, quizScore, mode, removeFromWrongQuestions, updateProgress, questionsAnswered, stopQuiz, startQuiz, userProgress]);

  // 答题模式倒计时
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQuizActive && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswerSubmit();
    }
    return () => clearTimeout(timer);
  }, [isQuizActive, timeLeft, showResult, handleAnswerSubmit]);

  // 选择答案
  const handleAnswerSelect = (answer: number) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setTimeout(() => {
      handleAnswerSubmit(answer);
    }, 100);
  };

  // 处理模式切换
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    stopQuiz();
    
    // 如果切换到答题或复习模式，自动开始
    if (newMode === 'quiz') {
      setTimeout(() => startQuiz(false), 100);
    } else if (newMode === 'review') {
      setTimeout(() => startQuiz(true), 100);
    }
  };

  // 学习模式相关函数
  const handleCellClick = (row: number, col: number) => {
    const newRow = row + 1;
    const newCol = col + 1;
    const result = newRow * newCol;
    
    setSelectedCell({ row: newRow, col: newCol });
    setSelectedResult(result);
    
    speakFormula(newRow, newCol, speechEnabled, speechSupported, locale);
  };

  const repeatSpeech = () => {
    if (selectedCell) {
      speakFormula(selectedCell.row, selectedCell.col, speechEnabled, speechSupported, locale);
    }
  };

  return (
    <div className="text-foreground min-h-screen relative">
      <Header 
        currentMode={mode} 
        onModeChange={handleModeChange}
        wrongQuestionsCount={userProgress.wrongQuestions.length}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-md sm:max-w-lg">
        {/* 成就通知 */}
        <AchievementNotification newAchievements={newAchievements} />

        {/* 用户进度统计 - 仅在答题和复习模式下显示 */}
        {(mode === 'quiz' || mode === 'review') && (
          <UserProgressStats userProgress={userProgress} />
        )}

        {/* 答题模式界面 */}
        {(mode === 'quiz' || mode === 'review') && currentQuestion && (
          <QuizInterface
            mode={mode}
            currentQuestion={currentQuestion}
            timeLeft={timeLeft}
            showResult={showResult}
            isCorrect={isCorrect}
            selectedAnswer={selectedAnswer}
            answerOptions={answerOptions}
            questionsAnswered={questionsAnswered}
            quizScore={quizScore}
            onAnswerSelect={handleAnswerSelect}
            onStopQuiz={stopQuiz}
          />
        )}

        {/* 学习模式界面 */}
        {mode === 'learn' && (
          <LearnMode
            selectedCell={selectedCell}
            selectedResult={selectedResult}
            speechEnabled={speechEnabled}
            speechSupported={speechSupported}
            onCellClick={handleCellClick}
            onSpeechToggle={() => setSpeechEnabled(!speechEnabled)}
            onRepeatSpeech={repeatSpeech}
          />
        )}

        {/* 成就展示 - 仅在答题和复习模式下显示 */}
        {(mode === 'quiz' || mode === 'review') && (
          <AchievementDisplay userProgress={userProgress} />
        )}
      </div>

      {/* 复习完成模态框 */}
      <ReviewCompleteModal
        isOpen={showReviewComplete}
        onClose={() => setShowReviewComplete(false)}
        questionsCompleted={completionStats.questionsCompleted}
        score={completionStats.score}
        type="review"
      />
      
      {/* 每日任务完成模态框 */}
      <ReviewCompleteModal
        isOpen={showDailyComplete}
        onClose={() => setShowDailyComplete(false)}
        questionsCompleted={completionStats.questionsCompleted}
        score={completionStats.score}
        type="daily"
      />
    </div>
  );
}
