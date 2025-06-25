"use client"

import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  currentMode: 'learn' | 'quiz' | 'review';
  onModeChange: (mode: 'learn' | 'quiz' | 'review') => void;
  wrongQuestionsCount: number;
}

export function Header({ currentMode, onModeChange, wrongQuestionsCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-3xl">✨</div> {/* Changed icon */}
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">乘法口诀</h1>
            <p className="text-xs text-[var(--muted-foreground)] hidden sm:block">让数学学习更有趣</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2"> {/* Added sm:space-x-2 for better spacing on larger screens */}
          {([
            { mode: 'learn', label: '学习', icon: '📚' },
            { mode: 'quiz', label: '答题', icon: '🎯' },
            { mode: 'review', label: '复习', icon: '📖' }
          ] as const).map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              disabled={mode === 'review' && wrongQuestionsCount === 0}
              className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ease-in-out relative group
                focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]
                ${
                  currentMode === mode
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
                    : mode === 'review' && wrongQuestionsCount === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--accent)]/20 hover:text-[var(--accent-foreground)]'
                }`}
            >
              <span className="sm:hidden">{icon}</span>
              <span className="hidden sm:inline">{icon} {label}</span>
              {mode === 'review' && wrongQuestionsCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 bg-[var(--secondary)] text-[var(--secondary-foreground)]
                                 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center
                                 ring-2 ring-[var(--background)] group-hover:ring-[var(--accent)]/20 transition-all`}>
                  {wrongQuestionsCount > 99 ? '99+' : wrongQuestionsCount}
                </span>
              )}
            </button>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 