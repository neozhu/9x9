'use client';

import { useState, useEffect, useCallback } from "react";
import { Header } from "./header";
import { AchievementNotification } from "./components/achievement-notification";
import { UserProgressStats } from "./components/user-progress-stats";
import { QuizInterface } from "./components/quiz-interface";
import { LearnMode } from "./components/learn-mode";
import { AchievementDisplay } from "./components/achievement-display";
import { ReviewCompleteModal } from "./components/review-complete-modal";
import { DailyTaskComplete } from "./components/daily-task-complete";
import { useUserProgress } from "./hooks/use-user-progress";
import { useLocale } from "./hooks/use-locale";
import { useQuizState } from "./hooks/use-quiz-state";
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerOptions, setAnswerOptions] = useState<number[]>([]);
  const [showReviewComplete, setShowReviewComplete] = useState(false);
  const [showDailyComplete, setShowDailyComplete] = useState(false);
  const [completionStats, setCompletionStats] = useState({ questionsCompleted: 0, score: 0 });
  const [reviewTaskCompleted, setReviewTaskCompleted] = useState(false);
  const [initialWrongQuestionsCount, setInitialWrongQuestionsCount] = useState(0);
  
  // 使用持久化的答题状态
  const { quizState, updatePauseState, updateQuizState, clearQuizState } = useQuizState();
  
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
      
      // iOS语音初始化 - 需要在用户交互后激活
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        console.log('[iOS Speech] Detected iOS device, speech will be activated on first user interaction');
        
        // 监听第一次用户交互来激活语音合成
        const activateSpeech = () => {
          try {
            // 说一个无声的短语来激活语音合成
            const testUtterance = new SpeechSynthesisUtterance(' ');
            testUtterance.volume = 0.01;
            testUtterance.rate = 10; // 快速完成
            speechSynthesis.speak(testUtterance);
            console.log('[iOS Speech] Speech synthesis activated');
          } catch (e) {
            console.log('[iOS Speech] Activation failed:', e);
          }
          
          // 移除事件监听器
          document.removeEventListener('touchstart', activateSpeech);
          document.removeEventListener('click', activateSpeech);
        };
        
        // 添加事件监听器
        document.addEventListener('touchstart', activateSpeech, { once: true, passive: true });
        document.addEventListener('click', activateSpeech, { once: true });
      }
    }
    
    const progress = loadProgress();
    setUserProgress(progress);
    
    return () => speechSynthesis.cancel();
  }, [loadProgress, setUserProgress]);

  // 页面初始化时检查是否有暂停的答题状态需要恢复
  useEffect(() => {
    if (quizState.isPaused && quizState.mode) {
      // 如果有暂停状态，设置正确的模式
      setMode(quizState.mode);
    }
  }, [quizState.isPaused, quizState.mode]);

  // 监听用户进度变化，更新复习任务完成状态
  useEffect(() => {
    if (mode === 'review' && userProgress.wrongQuestions.length === 0 && !reviewTaskCompleted) {
      setReviewTaskCompleted(true);
    }
  }, [userProgress.wrongQuestions.length, mode, reviewTaskCompleted]);

  // 停止答题
  const stopQuiz = useCallback(() => {
    setIsQuizActive(false);
    setShowResult(false);
    setCurrentQuestion(null);
    clearQuizState();
  }, [clearQuizState]);

  // 暂停答题
  const pauseQuiz = useCallback(() => {
    // 保存完整的答题状态
    updateQuizState({
      isPaused: true,
      timeLeft: timeLeft,
      currentQuestion: currentQuestion,
      answerOptions: answerOptions,
      selectedAnswer: selectedAnswer
    });
    setIsQuizActive(false);
  }, [updateQuizState, timeLeft, currentQuestion, answerOptions, selectedAnswer]);

  // 恢复答题
  const resumeQuiz = useCallback(() => {
    updatePauseState(false);
    setIsQuizActive(true);
    
    // 确保本地状态与暂停状态同步
    if (quizState.currentQuestion && quizState.answerOptions.length > 0) {
      setCurrentQuestion(quizState.currentQuestion);
      setAnswerOptions(quizState.answerOptions);
      setSelectedAnswer(quizState.selectedAnswer);
      setTimeLeft(quizState.timeLeft);
      setShowResult(false);
    }
  }, [updatePauseState, quizState.currentQuestion, quizState.answerOptions, quizState.selectedAnswer, quizState.timeLeft]);

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
    
    // 更新答题状态，记录当前模式
    updateQuizState({ 
      mode: isReview ? 'review' : 'quiz',
      timeLeft: 10
    });
    
    // 朗读题目
    speakFormula(question.multiplicand, question.multiplier, speechEnabled, speechSupported, locale);
  }, [userProgress.wrongQuestions, speechEnabled, speechSupported, locale, updateQuizState]);

  // 恢复暂停的答题状态
  const resumePausedQuiz = useCallback(() => {
    if (quizState.currentQuestion && quizState.answerOptions.length > 0) {
      setCurrentQuestion(quizState.currentQuestion);
      setAnswerOptions(quizState.answerOptions);
      setSelectedAnswer(quizState.selectedAnswer);
      setTimeLeft(quizState.timeLeft);
      setShowResult(false);
      // 注意：不设置 isQuizActive 为 true，保持暂停状态
    }
  }, [quizState.currentQuestion, quizState.answerOptions, quizState.selectedAnswer, quizState.timeLeft]);

  // 页面初始加载时恢复答题状态
  useEffect(() => {
    // 只在页面初始加载时执行，不在模式切换时执行
    if (quizState.isPaused && quizState.mode && mode === quizState.mode && currentQuestion === null) {
      // 如果有暂停的答题且当前模式匹配，且还没有恢复状态
      if (quizState.mode === 'quiz' && !userProgress.dailyTaskCompleted) {
        // 恢复答题模式界面
        setTimeout(() => resumePausedQuiz(), 100);
      } else if (quizState.mode === 'review' && userProgress.wrongQuestions.length > 0) {
        // 恢复复习模式界面
        setTimeout(() => resumePausedQuiz(), 100);
      }
    }
  }, [quizState.isPaused, quizState.mode, mode, userProgress.dailyTaskCompleted, userProgress.wrongQuestions.length, resumePausedQuiz, currentQuestion]);

  // 提交答案
  const handleAnswerSubmit = useCallback((directAnswer?: number) => {
    if (!currentQuestion) return;
    
    const answer = directAnswer || selectedAnswer || 0;
    const correct = answer === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setIsQuizActive(false);
    
    let newProgress;
    
    if (mode === 'review') {
      if (correct) {
        // 复习模式答对了，只移除错题，不调用updateProgress避免覆盖
        newProgress = removeFromWrongQuestions(currentQuestion.multiplicand, currentQuestion.multiplier);
        updateQuizState({ quizScore: quizState.quizScore + 1 });
      } else {
        // 复习模式答错了，正常更新进度
        const wrongQuestion = {
          multiplicand: currentQuestion.multiplicand,
          multiplier: currentQuestion.multiplier,
          userAnswer: answer,
          correctAnswer: currentQuestion.correctAnswer,
          timestamp: Date.now()
        };
        newProgress = updateProgress(false, wrongQuestion);
      }
    } else {
      // 普通答题模式，正常更新进度
      const wrongQuestion = !correct ? {
        multiplicand: currentQuestion.multiplicand,
        multiplier: currentQuestion.multiplier,
        userAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer,
        timestamp: Date.now()
      } : undefined;
      
      newProgress = updateProgress(correct, wrongQuestion);
      if (correct) {
        updateQuizState({ quizScore: quizState.quizScore + 1 });
      }
    }
    
    updateQuizState({ questionsAnswered: quizState.questionsAnswered + 1 });

    // 3秒后自动下一题或结束任务
    setTimeout(() => {
      setShowResult(false);
      
      // 检查是否完成每日任务
      if (mode === 'quiz' && newProgress.dailyTaskCompleted) {
        // 保存当前数据，因为stopQuiz会重置这些值
        const currentScore = correct ? quizState.quizScore + 1 : quizState.quizScore;
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
        if (newProgress.wrongQuestions.length === 0) {
          // 错题本已清空，标记复习任务完成
          setReviewTaskCompleted(true);
          stopQuiz();
        } else {
          startQuiz(true);
        }
      } else {
        startQuiz(false);
      }
    }, 3000);
  }, [currentQuestion, selectedAnswer, quizState.quizScore, mode, removeFromWrongQuestions, updateProgress, quizState.questionsAnswered, stopQuiz, startQuiz, updateQuizState]);

  // 答题模式倒计时
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQuizActive && timeLeft > 0 && !showResult && !quizState.isPaused) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult && !quizState.isPaused) {
      handleAnswerSubmit();
    }
    return () => clearTimeout(timer);
  }, [isQuizActive, timeLeft, showResult, quizState.isPaused, handleAnswerSubmit]);

  // 选择答案
  const handleAnswerSelect = (answer: number) => {
    if (showResult || quizState.isPaused) return;
    setSelectedAnswer(answer);
    setTimeout(() => {
      handleAnswerSubmit(answer);
    }, 100);
  };

  // 处理模式切换
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    
    // 如果当前是暂停状态，在切换到学习模式时保留暂停状态
    if (newMode === 'learn' && quizState.isPaused) {
      // 只停止当前答题界面，但保留暂停状态
      setIsQuizActive(false);
      setShowResult(false);
      setCurrentQuestion(null);
      // 不调用 clearQuizState()，保留暂停状态
    } else {
      // 其他情况正常停止答题
      stopQuiz();
    }
    
    // 如果切换到答题模式，检查当天任务是否已完成
    if (newMode === 'quiz') {
      // 检查是否有暂停的quiz状态需要恢复
      if (quizState.isPaused && quizState.mode === 'quiz') {
        // 立即恢复暂停的答题状态
        if (quizState.currentQuestion && quizState.answerOptions.length > 0) {
          setCurrentQuestion(quizState.currentQuestion);
          setAnswerOptions(quizState.answerOptions);
          setSelectedAnswer(quizState.selectedAnswer);
          setTimeLeft(quizState.timeLeft);
          setShowResult(false);
        }
        return;
      }
      // 检查当天任务是否已完成
      if (userProgress.dailyTaskCompleted) {
        // 任务已完成，不启动答题
        return;
      }
      setTimeout(() => startQuiz(false), 100);
    } else if (newMode === 'review') {
      // 检查是否有暂停的review状态需要恢复
      if (quizState.isPaused && quizState.mode === 'review') {
        // 立即恢复暂停的复习状态
        if (quizState.currentQuestion && quizState.answerOptions.length > 0) {
          setCurrentQuestion(quizState.currentQuestion);
          setAnswerOptions(quizState.answerOptions);
          setSelectedAnswer(quizState.selectedAnswer);
          setTimeLeft(quizState.timeLeft);
          setShowResult(false);
        }
        return;
      }
      // 检查是否有错题需要复习
      if (userProgress.wrongQuestions.length === 0) {
        // 没有错题，标记复习任务完成
        setReviewTaskCompleted(true);
        setInitialWrongQuestionsCount(0);
        return;
      }
      // 重置复习任务完成状态并记录初始错题数量
      setReviewTaskCompleted(false);
      setInitialWrongQuestionsCount(userProgress.wrongQuestions.length);
      setTimeout(() => startQuiz(true), 100);
    } else {
      // 切换到学习模式时，重置复习任务完成状态和初始错题数量
      setReviewTaskCompleted(false);
      setInitialWrongQuestionsCount(0);
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

  // 返回学习模式
  const handleBackToLearn = () => {
    setMode('learn');
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
          <UserProgressStats 
            userProgress={userProgress} 
            mode={mode} 
            initialWrongQuestionsCount={initialWrongQuestionsCount}
          />
        )}

        {/* 答题模式界面 */}
        {mode === 'quiz' && userProgress.dailyTaskCompleted && (
          <DailyTaskComplete onBackToLearn={handleBackToLearn} type="daily" />
        )}
        
        {/* 复习模式界面 */}
        {mode === 'review' && reviewTaskCompleted && (
          <DailyTaskComplete onBackToLearn={handleBackToLearn} type="review" />
        )}
        
        {/* 暂停状态恢复时的答题界面 */}
        {quizState.isPaused && quizState.mode && mode === quizState.mode && quizState.currentQuestion && (
          <QuizInterface
            mode={mode}
            currentQuestion={quizState.currentQuestion}
            timeLeft={quizState.timeLeft}
            showResult={false}
            isCorrect={false}
            selectedAnswer={quizState.selectedAnswer}
            answerOptions={quizState.answerOptions}
            questionsAnswered={quizState.questionsAnswered}
            quizScore={quizState.quizScore}
            isPaused={true}
            onAnswerSelect={handleAnswerSelect}
            onStopQuiz={stopQuiz}
            onPauseQuiz={pauseQuiz}
            onResumeQuiz={resumeQuiz}
          />
        )}
        
        {/* 正常答题界面 */}
        {!quizState.isPaused && ((mode === 'quiz' && !userProgress.dailyTaskCompleted) || (mode === 'review' && !reviewTaskCompleted)) && currentQuestion && (
          <QuizInterface
            mode={mode}
            currentQuestion={currentQuestion}
            timeLeft={timeLeft}
            showResult={showResult}
            isCorrect={isCorrect}
            selectedAnswer={selectedAnswer}
            answerOptions={answerOptions}
            questionsAnswered={quizState.questionsAnswered}
            quizScore={quizState.quizScore}
            isPaused={quizState.isPaused}
            onAnswerSelect={handleAnswerSelect}
            onStopQuiz={stopQuiz}
            onPauseQuiz={pauseQuiz}
            onResumeQuiz={resumeQuiz}
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
