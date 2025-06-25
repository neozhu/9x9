export interface WrongQuestion {
  multiplicand: number;
  multiplier: number;
  userAnswer: number;
  correctAnswer: number;
  timestamp: number;
}

export interface UserProgress {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  lastPlayDate: string;
  consecutiveDays: number;
  wrongQuestions: WrongQuestion[];
  achievements: string[];
  dailyQuestionsAnswered: number;
  dailyTarget: number;
  dailyTaskCompleted: boolean;
}

export interface Question {
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type Mode = 'learn' | 'quiz' | 'review'; 