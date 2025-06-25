'use client';

import { useState, useEffect, useCallback } from "react";
import { Header } from "./header";

// 中文数字转换
const chineseNumbers = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

// 数据类型定义
interface WrongQuestion {
  multiplicand: number;
  multiplier: number;
  userAnswer: number;
  correctAnswer: number;
  timestamp: number;
}

interface UserProgress {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  lastPlayDate: string;
  consecutiveDays: number;
  wrongQuestions: WrongQuestion[];
  achievements: string[];
}

interface Question {
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
}

// 成就系统
const achievements = [
  { id: 'first_correct', name: '初出茅庐', description: '第一次答对题目', icon: '🌱' },
  { id: 'streak_5', name: '小试牛刀', description: '连续答对5题', icon: '🔥' },
  { id: 'streak_10', name: '势如破竹', description: '连续答对10题', icon: '⚡' },
  { id: 'streak_20', name: '一鼓作气', description: '连续答对20题', icon: '💎' },
  { id: 'daily_3', name: '坚持不懈', description: '连续3天练习', icon: '📅' },
  { id: 'daily_7', name: '一周之星', description: '连续7天练习', icon: '⭐' },
  { id: 'accuracy_90', name: '神射手', description: '正确率达到90%', icon: '🎯' },
  { id: 'questions_100', name: '百题达人', description: '累计答题100道', icon: '💯' },
];

// 中文口诀转换函数
function getChineseFormula(multiplicand: number, multiplier: number, result: number): string {
  if (multiplicand === 1) {
    return `一${chineseNumbers[multiplier]}得${chineseNumbers[multiplier]}`;
  }
  
  let resultChinese = '';
  if (result < 10) {
    resultChinese = chineseNumbers[result];
  } else if (result === 10) {
    resultChinese = '十';
  } else if (result < 20) {
    resultChinese = `十${chineseNumbers[result - 10]}`;
  } else {
    const tens = Math.floor(result / 10);
    const units = result % 10;
    resultChinese = `${chineseNumbers[tens]}十${units === 0 ? '' : chineseNumbers[units]}`;
  }
  
  return `${chineseNumbers[multiplicand]}${chineseNumbers[multiplier]}${resultChinese}`;
}

export default function Home() {
  // 状态管理
  const [mode, setMode] = useState<'learn' | 'quiz' | 'review'>('learn');
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
  
  // 用户进度状态
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    lastPlayDate: '',
    consecutiveDays: 0,
    wrongQuestions: [],
    achievements: []
  });
  
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // 本地存储操作
  const saveProgress = useCallback((progress: UserProgress) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('multiplicationProgress', JSON.stringify(progress));
    }
  }, []);

  const loadProgress = useCallback((): UserProgress => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('multiplicationProgress');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
      lastPlayDate: '',
      consecutiveDays: 0,
      wrongQuestions: [],
      achievements: []
    };
  }, []);

  // 检查成就
  const checkAchievements = useCallback((progress: UserProgress) => {
    const newAchievementsFound: string[] = [];
    
    if (progress.correctAnswers >= 1 && !progress.achievements.includes('first_correct')) {
      newAchievementsFound.push('first_correct');
    }
    if (progress.streak >= 5 && !progress.achievements.includes('streak_5')) {
      newAchievementsFound.push('streak_5');
    }
    if (progress.streak >= 10 && !progress.achievements.includes('streak_10')) {
      newAchievementsFound.push('streak_10');
    }
    if (progress.streak >= 20 && !progress.achievements.includes('streak_20')) {
      newAchievementsFound.push('streak_20');
    }
    if (progress.consecutiveDays >= 3 && !progress.achievements.includes('daily_3')) {
      newAchievementsFound.push('daily_3');
    }
    if (progress.consecutiveDays >= 7 && !progress.achievements.includes('daily_7')) {
      newAchievementsFound.push('daily_7');
    }
    if (progress.totalQuestions >= 10 && (progress.correctAnswers / progress.totalQuestions) >= 0.9 && !progress.achievements.includes('accuracy_90')) {
      newAchievementsFound.push('accuracy_90');
    }
    if (progress.totalQuestions >= 100 && !progress.achievements.includes('questions_100')) {
      newAchievementsFound.push('questions_100');
    }

    if (newAchievementsFound.length > 0) {
      setNewAchievements(newAchievementsFound);
      setTimeout(() => setNewAchievements([]), 3000);
      return {
        ...progress,
        achievements: [...progress.achievements, ...newAchievementsFound]
      };
    }
    
    return progress;
  }, []);

  // 初始化
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
    
    const progress = loadProgress();
    setUserProgress(progress);
    
    return () => speechSynthesis.cancel();
  }, [loadProgress]);

  // 答题模式倒计时
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQuizActive && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswerSubmit();
    }
    return () => clearTimeout(timer);
  }, [isQuizActive, timeLeft, showResult]);

  // 语音朗读函数
  const speakFormula = (multiplicand: number, multiplier: number) => {
    if (!speechEnabled || !speechSupported) return;
    
    speechSynthesis.cancel();
    
    const result = multiplicand * multiplier;
    const formula = getChineseFormula(multiplicand, multiplier, result);
    
    const utterance = new SpeechSynthesisUtterance(formula);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    speechSynthesis.speak(utterance);
  };

  // 生成答案选项
  const generateAnswerOptions = (correctAnswer: number): number[] => {
    const options = [correctAnswer];
    const usedNumbers = new Set([correctAnswer]);
    
    // 生成2个干扰项
    while (options.length < 3) {
      let wrongAnswer;
      // 生成合理的错误答案
      const random = Math.random();
      if (random < 0.3) {
        // 相邻的数字
        wrongAnswer = correctAnswer + (Math.random() < 0.5 ? 1 : -1);
      } else if (random < 0.6) {
        // 其他乘法表中的数字
        wrongAnswer = Math.floor(Math.random() * 81) + 1;
      } else {
        // 完全随机但合理的数字
        wrongAnswer = Math.floor(Math.random() * 20) + 1;
      }
      
      if (wrongAnswer > 0 && wrongAnswer <= 81 && !usedNumbers.has(wrongAnswer)) {
        options.push(wrongAnswer);
        usedNumbers.add(wrongAnswer);
      }
    }
    
    // 随机排序
    return options.sort(() => Math.random() - 0.5);
  };

  // 生成随机题目
  const generateRandomQuestion = (): Question => {
    const multiplicand = Math.floor(Math.random() * 9) + 1;
    const multiplier = Math.floor(Math.random() * 9) + 1;
    return {
      multiplicand,
      multiplier,
      correctAnswer: multiplicand * multiplier
    };
  };

  // 从错题本生成题目
  const generateReviewQuestion = (): Question | null => {
    const wrongQuestions = userProgress.wrongQuestions;
    if (wrongQuestions.length === 0) return null;
    
    const randomWrong = wrongQuestions[Math.floor(Math.random() * wrongQuestions.length)];
    return {
      multiplicand: randomWrong.multiplicand,
      multiplier: randomWrong.multiplier,
      correctAnswer: randomWrong.correctAnswer
    };
  };

  // 开始答题
  const startQuiz = (isReview = false) => {
    const question = isReview ? generateReviewQuestion() : generateRandomQuestion();
    if (!question) return;
    
    setCurrentQuestion(question);
    setAnswerOptions(generateAnswerOptions(question.correctAnswer));
    setSelectedAnswer(null);
    setTimeLeft(10);
    setIsQuizActive(true);
    setShowResult(false);
    
    // 朗读题目
    speakFormula(question.multiplicand, question.multiplier);
  };

  // 选择答案
  const handleAnswerSelect = (answer: number) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    // 自动提交答案
    setTimeout(() => {
      handleAnswerSubmit(answer);
    }, 100);
  };

  // 提交答案
  const handleAnswerSubmit = (directAnswer?: number) => {
    if (!currentQuestion) return;
    
    const answer = directAnswer || selectedAnswer || 0;
    const correct = answer === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setIsQuizActive(false);
    
    // 更新进度
    const today = new Date().toDateString();
    let newProgress = { ...userProgress };
    
    newProgress.totalQuestions += 1;
    
    if (correct) {
      newProgress.correctAnswers += 1;
      newProgress.streak += 1;
      if (newProgress.streak > newProgress.bestStreak) {
        newProgress.bestStreak = newProgress.streak;
      }
      setQuizScore(quizScore + 1);
      
      // 如果是复习模式且答对了，从错题本中移除该题目
      if (mode === 'review') {
        newProgress.wrongQuestions = newProgress.wrongQuestions.filter(
          wrongQ => !(wrongQ.multiplicand === currentQuestion.multiplicand && 
                      wrongQ.multiplier === currentQuestion.multiplier)
        );
      }
    } else {
      newProgress.streak = 0;
      // 添加到错题本（只在非复习模式下添加，避免重复）
      if (mode !== 'review') {
        const wrongQuestion: WrongQuestion = {
          multiplicand: currentQuestion.multiplicand,
          multiplier: currentQuestion.multiplier,
          userAnswer: answer,
          correctAnswer: currentQuestion.correctAnswer,
          timestamp: Date.now()
        };
        newProgress.wrongQuestions.push(wrongQuestion);
        // 保持错题本最多100题
        if (newProgress.wrongQuestions.length > 100) {
          newProgress.wrongQuestions = newProgress.wrongQuestions.slice(-100);
        }
      }
    }
    
    // 更新连续天数
    if (newProgress.lastPlayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (newProgress.lastPlayDate === yesterday.toDateString()) {
        newProgress.consecutiveDays += 1;
      } else {
        newProgress.consecutiveDays = 1;
      }
      newProgress.lastPlayDate = today;
    }
    
    setQuestionsAnswered(questionsAnswered + 1);
    
    // 检查成就
    newProgress = checkAchievements(newProgress);
    setUserProgress(newProgress);
    saveProgress(newProgress);

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
  };

  // 停止答题
  const stopQuiz = () => {
    setIsQuizActive(false);
    setShowResult(false);
    setCurrentQuestion(null);
    setQuizScore(0);
    setQuestionsAnswered(0);
  };

  // 处理模式切换
  const handleModeChange = (newMode: 'learn' | 'quiz' | 'review') => {
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
  const generateGrid = () => {
    const grid = [];
    for (let row = 1; row <= 9; row++) {
      const rowData = [];
      for (let col = 1; col <= 9; col++) {
        rowData.push(row * col);
      }
      grid.push(rowData);
    }
    return grid;
  };

  const findSameResultCombinations = (targetResult: number) => {
    const combinations = [];
    for (let row = 1; row <= 9; row++) {
      for (let col = 1; col <= 9; col++) {
        if (row * col === targetResult) {
          combinations.push({ row, col });
        }
      }
    }
    return combinations;
  };

  const handleCellClick = (row: number, col: number) => {
    const newRow = row + 1;
    const newCol = col + 1;
    const result = newRow * newCol;
    
    setSelectedCell({ row: newRow, col: newCol });
    setSelectedResult(result);
    
    speakFormula(newRow, newCol);
  };

  const getDisplayFormula = () => {
    if (!selectedCell) {
      return {
        chinese: "请选择一个数字",
        equation: "点击下方数字开始学习",
        areaInfo: ""
      };
    }
    
    const result = selectedCell.row * selectedCell.col;
    const areaSize = selectedCell.row * selectedCell.col;
    
    const sameResultCombinations = findSameResultCombinations(result);
    const otherCombinations = sameResultCombinations.filter(
      combo => !(combo.row === selectedCell.row && combo.col === selectedCell.col)
    );
    
    let combinationInfo = "";
    if (otherCombinations.length > 0) {
      const otherFormulas = otherCombinations.map(combo => `${combo.row}×${combo.col}`).join('、');
      combinationInfo = `其他组合：${otherFormulas}`;
    }
    
    return {
      chinese: getChineseFormula(selectedCell.row, selectedCell.col, result),
      equation: `${selectedCell.row} × ${selectedCell.col} = ${result}`,
      areaInfo: `${selectedCell.row}行×${selectedCell.col}列矩形区域 (共${areaSize}个方块)`,
      combinationInfo
    };
  };

  const repeatSpeech = () => {
    if (selectedCell) {
      speakFormula(selectedCell.row, selectedCell.col);
    }
  };

  // 计算准确率
  const accuracy = userProgress.totalQuestions > 0 
    ? Math.round((userProgress.correctAnswers / userProgress.totalQuestions) * 100) 
    : 0;

  const grid = generateGrid();
  const { chinese, equation, areaInfo, combinationInfo } = getDisplayFormula();
  const sameResultCombinations = selectedResult ? findSameResultCombinations(selectedResult) : [];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header 
        currentMode={mode} 
        onModeChange={handleModeChange}
        wrongQuestionsCount={userProgress.wrongQuestions.length}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-md sm:max-w-lg">
        {/* 成就通知 */}
        {newAchievements.length > 0 && (
          <div className="fixed top-20 right-4 z-[100] space-y-2"> {/* Increased z-index */}
            {newAchievements.map(achievementId => {
              const achievement = achievements.find(a => a.id === achievementId);
              return achievement ? (
                <div key={achievementId} className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--secondary)]/50 px-4 py-3 rounded-lg shadow-xl animate-bounce flex items-center space-x-3"> {/* Themed colors, increased padding & shadow */}
                  <span className="text-2xl">{achievement.icon}</span> {/* Larger icon */}
                  <div>
                    <div className="font-bold text-base">解锁成就！</div> {/* Increased font size */}
                    <div className="text-sm">{achievement.name}</div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* 用户进度统计 - 仅在答题和复习模式下显示 */}
        {(mode === 'quiz' || mode === 'review') && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"> {/* Responsive grid */}
            {[
              { label: '连击', value: userProgress.streak, color: 'text-[var(--primary)]' },
              { label: '准确率', value: `${accuracy}%`, color: 'text-[var(--correct-green)]' },
              { label: '连续天数', value: userProgress.consecutiveDays, color: 'text-[var(--explorer-blue)]' },
              { label: '错题数', value: userProgress.wrongQuestions.length, color: 'text-[var(--try-again-orange)]' }
            ].map(stat => (
              <div key={stat.label} className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 text-center shadow">
                <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* 答题模式界面 */}
        {(mode === 'quiz' || mode === 'review') && currentQuestion && (
          <div className="mb-6 space-y-6"> {/* Increased space */}
            {/* 答题区域 */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg p-6 text-center"> {/* Increased rounded and shadow */}
              <div className="text-lg mb-1">
                {mode === 'review' && <span className="text-[var(--try-again-orange)] text-sm font-semibold">📖 错题复习</span>}
              </div>
              
              <div className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6"> {/* Increased mb */}
                {currentQuestion.multiplicand} × {currentQuestion.multiplier} = ?
              </div>
              
              {!showResult && (
                <>
                  <div className="mb-6">
                    <div className={`text-xl font-mono ${timeLeft <= 3 ? 'text-red-500 dark:text-red-400' : 'text-[var(--primary)]'}`}>
                      ⏰ {timeLeft}秒
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2 shadow-inner"> {/* Added shadow-inner */}
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${
                          timeLeft <= 3 ? 'bg-red-500' : 'bg-[var(--primary)]'
                        }`}
                        style={{ width: `${(timeLeft / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* 答案选项按钮 */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {answerOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`h-16 sm:h-20 text-2xl sm:text-3xl font-bold rounded-lg border-2 transition-all duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ring)]
                          ${ selectedAnswer === option
                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] scale-105'
                            : 'bg-[var(--background)] text-[var(--foreground)] border-[var(--input-border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/10'
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {showResult && (
                <div className={`text-2xl sm:text-3xl font-bold ${isCorrect ? 'text-[var(--correct-green)]' : 'text-red-500 dark:text-red-400'}`}>
                  {isCorrect ? '✅ 太棒了！正确！' : '❌ 再想想哦～'} {/* More friendly feedback text */}
                  <div className="text-lg sm:text-xl mt-2 text-[var(--muted-foreground)]">
                    正确答案：{currentQuestion.correctAnswer}
                  </div>
                  {!isCorrect && selectedAnswer !== null && (
                    <div className="text-sm sm:text-base text-[var(--muted-foreground)]/80 mt-1">
                      你的答案：{selectedAnswer}
                    </div>
                  )}
                  {selectedAnswer === null && timeLeft === 0 && ( // Show only if time ran out
                    <div className="text-sm sm:text-base text-[var(--muted-foreground)]/80 mt-1">
                      时间到了！
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 答题统计 */}
            <div className="flex justify-between items-center text-sm text-[var(--muted-foreground)] px-1">
              <div>
                <span>本轮已答：{questionsAnswered}</span>
                <span className="ml-3">得分：{quizScore}</span>
              </div>
              <button 
                onClick={stopQuiz}
                className="px-3 py-1.5 text-sm font-medium bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-[var(--card)]"
              >
                结束答题
              </button>
            </div>
          </div>
        )}

        {/* 学习模式界面 */}
        {mode === 'learn' && (
          <>
            {/* 功能控制区域 */}
            <div className="mb-6 space-y-3"> {/* Increased mb */}
              {speechSupported && (
                <div className="flex items-center justify-between p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-medium text-[var(--foreground)]">🔊 语音朗读</span> {/* Larger text */}
                    {selectedCell && (
                      <button
                        onClick={repeatSpeech}
                        className="ml-2 px-3 py-1.5 text-sm bg-[var(--accent)] text-[var(--accent-foreground)] rounded-md hover:bg-[var(--accent)]/80 transition-colors shadow-sm"
                      >
                        🔁 重复
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--card)]
                      ${speechEnabled
                        ? 'bg-[var(--discovery-green)]/20 text-[var(--discovery-green)]'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span>{speechEnabled ? '🔊' : '🔇'}</span>
                    <span>{speechEnabled ? '开启' : '关闭'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 顶部口诀显示区域 */}
            <div className="mb-8 p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg text-center min-h-[160px] flex flex-col justify-center"> {/* Increased rounded, min-h, shadow */}
              <div 
                className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-2 transition-all duration-300 ease-in-out" // Primary color for emphasis
                style={{ 
                  fontSize: selectedCell ? '2.25rem' : '1.875rem', // Adjusted sizes
                  opacity: selectedCell ? 1 : 0.6
                }}
              >
                {chinese}
              </div>
              <div 
                className="text-xl sm:text-2xl text-[var(--foreground)] transition-all duration-300 ease-in-out" // Foreground color
                style={{ 
                  fontSize: selectedCell ? '1.5rem' : '1.25rem', // Adjusted sizes
                  opacity: selectedCell ? 1 : 0.6
                }}
              >
                {equation}
              </div>
              {selectedCell && (
                <div className="mt-4 space-y-1"> {/* Increased mt */}
                  <div className="text-sm text-[var(--muted-foreground)] opacity-80"> {/* Adjusted opacity */}
                    <span>{areaInfo}</span> {/* Removed text-xs */}
                  </div>
                  {combinationInfo && (
                    <div className="text-sm text-[var(--explorer-blue)] dark:text-[var(--explorer-blue)]"> {/* Explorer blue for info */}
                      <span>💡 {combinationInfo}</span> {/* Removed text-xs */}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 9x9网格区域 */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg p-3 sm:p-4"> {/* Increased rounded, shadow */}
              <div className="grid grid-cols-9 multiplication-grid gap-1.5 sm:gap-2"> {/* Increased gap slightly */}
                {grid.map((row, rowIndex) =>
                  row.map((value, colIndex) => {
                    const currentRow = rowIndex + 1;
                    const currentCol = colIndex + 1;
                    const isSelected = selectedCell?.row === currentRow && selectedCell?.col === currentCol;
                    
                    const isInHighlightedArea = selectedCell && 
                      currentRow <= selectedCell.row && 
                      currentCol <= selectedCell.col;
                    const isAreaHighlighted = isInHighlightedArea && !isSelected;
                    
                    const isSameResult = sameResultCombinations.some(combo => 
                        combo.row === currentRow && combo.col === currentCol
                      ) && !isSelected;
                    
                    // Updated button classes for new theme
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        aria-label={`${currentRow} 乘以 ${currentCol} 等于 ${value}`}
                        tabIndex={rowIndex * 9 + colIndex + 1}
                        className={`
                          multiplication-cell aspect-square flex items-center justify-center text-sm sm:text-base
                          rounded-lg transition-all duration-200 border-2 touch-button touch-manipulation no-zoom
                          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--ring)]
                          ${isSelected
                            ? 'selected bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-xl z-10 relative ring-4 ring-[var(--primary)]/30'
                            : isSameResult
                            ? 'same-result bg-[var(--explorer-blue)]/20 text-[var(--explorer-blue)] border-[var(--explorer-blue)]/40 dark:border-[var(--explorer-blue)]/60 shadow-md ring-1 ring-[var(--explorer-blue)]/30'
                            : isAreaHighlighted
                            ? 'highlighted bg-[var(--accent)]/20 text-[var(--accent-foreground)] border-[var(--accent)]/30 dark:border-[var(--accent)]/50 shadow-sm'
                            : 'bg-[var(--background)] text-[var(--foreground)] border-[var(--input-border)] hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/50 hover:shadow-md'
                          }
                        `}
                        style={{
                          minHeight: '2.75rem', // Increased min height/width
                          minWidth: '2.75rem',
                          transform: isSelected ? 'scale(1.15)' : (isSameResult || isAreaHighlighted) ? 'scale(1.05)' : 'scale(1)',
                          zIndex: isSelected ? 10 : (isSameResult || isAreaHighlighted) ? 5 : 1,
                          // Using CSS variables for font weight based on state
                          fontWeight: isSelected ? '900' : (isSameResult || isAreaHighlighted) ? '700' : '500'
                        }}
                      >
                        <span className={`${isSelected ? 'text-lg' : ''}`}> {/* Simplified span, font weight handled by style */}
                          {value}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* 底部说明 */}
            <div className="mt-8 text-center text-base text-[var(--muted-foreground)]"> {/* Increased mt, text-base */}
              <p>点击任意数字学习乘法口诀</p>
              <p className="mt-1.5">每天练习几分钟，轻松记住九九表</p> {/* Increased mt */}
              {speechSupported && (
                <p className="mt-2 text-sm opacity-80">💡 点击数字即可听到语音朗读</p> {/* Adjusted opacity */}
              )}
              <p className="mt-1.5 text-sm opacity-80 text-[var(--explorer-blue)] dark:text-[var(--explorer-blue)]"> {/* Increased mt, explorer-blue color */}
                ✨ 蓝色方块表示相同的结果
              </p>
            </div>
          </>
        )}

        {/* 成就展示 - 仅在答题和复习模式下显示 */}
        {(mode === 'quiz' || mode === 'review') && userProgress.achievements.length > 0 && (
          <div className="mt-8 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg p-4 sm:p-6"> {/* Increased mt, rounded, shadow, padding */}
            <h3 className="text-xl font-bold mb-4 text-[var(--foreground)] flex items-center"> {/* Increased font size, mb, color */}
              <span className="text-2xl mr-2">🏆</span> 已获得成就
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> {/* Responsive grid, increased gap */}
              {userProgress.achievements.map(achievementId => {
                const achievement = achievements.find(a => a.id === achievementId);
                return achievement ? (
                  <div key={achievementId} className="flex items-center space-x-3 p-3 bg-[var(--background)] dark:bg-[var(--background)]/50 border border-[var(--border)] rounded-lg shadow-sm"> {/* Themed bg, border, increased padding, space */}
                    <span className="text-2xl">{achievement.icon}</span> {/* Larger icon */}
                    <div>
                      <div className="text-base font-semibold text-[var(--foreground)]">{achievement.name}</div> {/* Increased font size */}
                      <div className="text-xs text-[var(--muted-foreground)]">{achievement.description}</div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
