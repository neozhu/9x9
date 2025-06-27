import { useState, useCallback } from 'react';
import type { UserProgress, WrongQuestion } from '@/lib/types';

export function useUserProgress() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    lastPlayDate: '',
    consecutiveDays: 0,
    wrongQuestions: [],
    achievements: [],
    dailyQuestionsAnswered: 0,
    dailyTarget: 10,
    dailyTaskCompleted: false
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
        const progress = JSON.parse(saved);
        // 确保旧数据兼容性
        const loadedProgress = {
          ...progress,
          dailyQuestionsAnswered: progress.dailyQuestionsAnswered || 0,
          dailyTarget: progress.dailyTarget || 10,
          dailyTaskCompleted: progress.dailyTaskCompleted || false
        };
        
        // 检查是否是新的一天，如果是则重置每日任务状态
        const today = new Date().toDateString();
        if (loadedProgress.lastPlayDate !== today) {
          loadedProgress.dailyQuestionsAnswered = 0;
          loadedProgress.dailyTaskCompleted = false;
        }
        
        return loadedProgress;
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
      achievements: [],
      dailyQuestionsAnswered: 0,
      dailyTarget: 10,
      dailyTaskCompleted: false
    };
  }, []);

  // 检查是否是重复的错题
  const isDuplicateWrongQuestion = useCallback((wrongQuestions: WrongQuestion[], newWrong: WrongQuestion) => {
    return wrongQuestions.some(
      wrongQ => wrongQ.multiplicand === newWrong.multiplicand && wrongQ.multiplier === newWrong.multiplier
    );
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
    // 每日任务完成成就
    if (progress.dailyTaskCompleted && !progress.achievements.includes('daily_task_complete')) {
      newAchievementsFound.push('daily_task_complete');
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

  // 更新进度
  const updateProgress = useCallback((correct: boolean, wrongQuestion?: WrongQuestion) => {
    const today = new Date().toDateString();
    let newProgress = { ...userProgress };
    
    newProgress.totalQuestions += 1;
    
    // 更新每日答题数量
    if (newProgress.lastPlayDate === today) {
      newProgress.dailyQuestionsAnswered += 1;
    } else {
      // 新的一天，重置每日计数
      newProgress.dailyQuestionsAnswered = 1;
      newProgress.dailyTaskCompleted = false;
    }
    
    // 检查是否完成每日任务
    if (newProgress.dailyQuestionsAnswered >= newProgress.dailyTarget) {
      newProgress.dailyTaskCompleted = true;
    }
    
    if (correct) {
      newProgress.correctAnswers += 1;
      newProgress.streak += 1;
      if (newProgress.streak > newProgress.bestStreak) {
        newProgress.bestStreak = newProgress.streak;
      }
    } else {
      newProgress.streak = 0;
      if (wrongQuestion && !isDuplicateWrongQuestion(newProgress.wrongQuestions, wrongQuestion)) {
        // 只添加不重复的错题
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
    
    // 检查成就
    newProgress = checkAchievements(newProgress);
    setUserProgress(newProgress);
    saveProgress(newProgress);
    
    return newProgress;
  }, [userProgress, checkAchievements, saveProgress, isDuplicateWrongQuestion]);

  // 从错题本移除题目
  const removeFromWrongQuestions = useCallback((multiplicand: number, multiplier: number) => {
    const newProgress = {
      ...userProgress,
      wrongQuestions: userProgress.wrongQuestions.filter(
        wrongQ => !(wrongQ.multiplicand === multiplicand && wrongQ.multiplier === multiplier)
      )
    };
    setUserProgress(newProgress);
    saveProgress(newProgress);
    return newProgress;
  }, [userProgress, saveProgress]);

  return {
    userProgress,
    newAchievements,
    setUserProgress,
    loadProgress,
    updateProgress,
    removeFromWrongQuestions
  };
} 