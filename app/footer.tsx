"use client"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 text-center">
            <div className="text-lg">🧮</div>
            <div>
              <p className="text-sm font-medium text-foreground">9×9乘法口诀学习应用</p>
              <p className="text-xs text-muted-foreground">陪伴孩子快乐学数学</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-muted-foreground">
            <div className="flex space-x-4">
              <span>🎯 专注学习</span>
              <span>✨ 互动体验</span>
              <span>🌙 护眼模式</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 乘法口诀学习应用 · 让数学学习更有趣
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 