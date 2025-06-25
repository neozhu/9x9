"use client"

import { ThemeToggle } from "./theme-toggle";
import { Hash, BookOpen, Target, BookOpenCheck } from 'lucide-react';

interface HeaderProps {
  currentMode: 'learn' | 'quiz' | 'review';
  onModeChange: (mode: 'learn' | 'quiz' | 'review') => void;
  wrongQuestionsCount: number;
}

export function Header({ currentMode, onModeChange, wrongQuestionsCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Hash className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">乘法口诀</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">让数学学习更有趣</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onModeChange('learn')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              currentMode === 'learn' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>学习</span>
          </button>
          <button
            onClick={() => onModeChange('quiz')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              currentMode === 'quiz' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>答题</span>
          </button>
          <button
            onClick={() => onModeChange('review')}
            disabled={wrongQuestionsCount === 0}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative flex items-center space-x-1 ${
              currentMode === 'review' 
                ? 'bg-primary text-primary-foreground' 
                : wrongQuestionsCount === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>复习</span>
            {wrongQuestionsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wrongQuestionsCount > 99 ? '99+' : wrongQuestionsCount}
              </span>
            )}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 