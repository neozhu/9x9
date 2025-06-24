"use client"

import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🔢</div>
          <div>
            <h1 className="text-xl font-bold text-foreground">乘法口诀</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">让数学学习更有趣</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-sm text-muted-foreground">
            轻松掌握九九表
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 