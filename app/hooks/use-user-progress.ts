import { useState, useCallback } from 'react';
import type { UserProgress, WrongQuestion } from '@/lib/types';
import { achievements } from '@/lib/constants';

export function useUserProgress() {
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

  // 更新进度
  const updateProgress = useCallback((correct: boolean, wrongQuestion?: WrongQuestion) => {
    const today = new Date().toDateString();
    let newProgress = { ...userProgress };
    
    newProgress.totalQuestions += 1;
    
    if (correct) {
      newProgress.correctAnswers += 1;
      newProgress.streak += 1;
      if (newProgress.streak > newProgress.bestStreak) {
        newProgress.bestStreak = newProgress.streak;
      }
    } else {
      newProgress.streak = 0;
      if (wrongQuestion) {
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
  }, [userProgress, checkAchievements, saveProgress]);

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