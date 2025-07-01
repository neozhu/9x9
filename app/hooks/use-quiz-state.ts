import { useState, useCallback, useEffect } from 'react';
import type { Question, Difficulty } from '@/lib/types';

interface QuizState {
  isPaused: boolean;
  timeLeft: number;
  questionsAnswered: number;
  quizScore: number;
  mode: 'quiz' | 'review' | null;
  difficulty: Difficulty;
  currentQuestion: Question | null;
  answerOptions: number[];
  selectedAnswer: number | null;
}

const QUIZ_STATE_KEY = 'multiplicationQuizState';

export function useQuizState() {
  const [quizState, setQuizState] = useState<QuizState>({
    isPaused: false,
    timeLeft: 10,
    questionsAnswered: 0,
    quizScore: 0,
    mode: null,
    difficulty: 'beginner',
    currentQuestion: null,
    answerOptions: [],
    selectedAnswer: null
  });

  // 保存状态到 localStorage
  const saveQuizState = useCallback((state: QuizState) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
    }
  }, []);

  // 从 localStorage 加载状态
  const loadQuizState = useCallback((): QuizState => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(QUIZ_STATE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Failed to parse quiz state:', error);
        }
      }
    }
    return {
      isPaused: false,
      timeLeft: 10,
      questionsAnswered: 0,
      quizScore: 0,
      mode: null,
      difficulty: 'beginner',
      currentQuestion: null,
      answerOptions: [],
      selectedAnswer: null
    };
  }, []);

  // 清除状态
  const clearQuizState = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(QUIZ_STATE_KEY);
    }
    const defaultState: QuizState = {
      isPaused: false,
      timeLeft: 10,
      questionsAnswered: 0,
      quizScore: 0,
      mode: null,
      difficulty: 'beginner',
      currentQuestion: null,
      answerOptions: [],
      selectedAnswer: null
    };
    setQuizState(defaultState);
  }, []);

  // 更新暂停状态
  const updatePauseState = useCallback((isPaused: boolean) => {
    setQuizState(prev => {
      const newState = { ...prev, isPaused };
      saveQuizState(newState);
      return newState;
    });
  }, [saveQuizState]);

  // 更新完整的答题状态
  const updateQuizState = useCallback((updates: Partial<QuizState>) => {
    setQuizState(prev => {
      const newState = { ...prev, ...updates };
      saveQuizState(newState);
      return newState;
    });
  }, [saveQuizState]);

  // 组件挂载时加载状态
  useEffect(() => {
    const savedState = loadQuizState();
    setQuizState(savedState);
  }, [loadQuizState]);

  return {
    quizState,
    updatePauseState,
    updateQuizState,
    clearQuizState,
    loadQuizState
  };
} 