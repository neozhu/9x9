'use client';

import { useState, useEffect, useCallback } from "react";
import { Header } from "./header";
import { AchievementNotification } from "./components/achievement-notification";
import { UserProgressStats } from "./components/user-progress-stats";
import { QuizInterface } from "./components/quiz-interface";
import { LearnMode } from "./components/learn-mode";
import { AchievementDisplay } from "./components/achievement-display";
import { useUserProgress } from "./hooks/use-user-progress";
import { 
  generateRandomQuestion, 
  generateReviewQuestion, 
  generateAnswerOptions,
  speakFormula 
} from "@/lib/multiplication-utils";
import type { Question, Mode } from "@/lib/types";

export default function Home() {
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
    speakFormula(question.multiplicand, question.multiplier, speechEnabled, speechSupported);
  }, [userProgress.wrongQuestions, speechEnabled, speechSupported]);

  // 提交答案
  const handleAnswerSubmit = useCallback((directAnswer?: number) => {
    if (!currentQuestion) return;
    
    const answer = directAnswer || selectedAnswer || 0;
    const correct = answer === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setIsQuizActive(false);
    
    if (correct) {
      setQuizScore(quizScore + 1);
      // 如果是复习模式且答对了，从错题本中移除该题目
      if (mode === 'review') {
        removeFromWrongQuestions(currentQuestion.multiplicand, currentQuestion.multiplier);
      }
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

    // 3秒后自动下一题
    setTimeout(() => {
      setShowResult(false);
      // 如果是复习模式且错题本已清空，切换到学习模式
      if (mode === 'review' && newProgress.wrongQuestions.length === 0) {
        setMode('learn');
        stopQuiz();
      } else {
        startQuiz(mode === 'review');
      }
    }, 3000);
  }, [currentQuestion, selectedAnswer, quizScore, mode, removeFromWrongQuestions, updateProgress, questionsAnswered, stopQuiz, startQuiz]);

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
    
    speakFormula(newRow, newCol, speechEnabled, speechSupported);
  };

  const repeatSpeech = () => {
    if (selectedCell) {
      speakFormula(selectedCell.row, selectedCell.col, speechEnabled, speechSupported);
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
    </div>
  );
}
