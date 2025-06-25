import { useLocale } from "../hooks/use-locale";

interface MultiplicationGridProps {
  grid: number[][];
  selectedCell: {row: number, col: number} | null;
  selectedResult: number | null;
  sameResultCombinations: Array<{row: number, col: number}>;
  onCellClick: (row: number, col: number) => void;
}

export function MultiplicationGrid({
  grid,
  selectedCell,
  sameResultCombinations,
  onCellClick
}: MultiplicationGridProps) {
  const { t } = useLocale();

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-white/40 via-white/25 to-white/30 dark:from-white/20 dark:via-white/12 dark:to-white/15 backdrop-blur-2xl backdrop-saturate-150 border border-white/40 dark:border-white/25 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 text-center relative overflow-hidden">
      {/* 增强的Glassmorphism叠加效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/15 dark:from-white/10 dark:via-transparent dark:to-white/8 rounded-2xl pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/15 to-transparent dark:from-white/8 dark:to-transparent rounded-t-2xl pointer-events-none"></div>
      
      <div className="grid grid-cols-9 multiplication-grid gap-1 sm:gap-2 relative z-10">
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
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onCellClick(rowIndex, colIndex)}
                aria-label={t('grid.formula', { num1: currentRow, num2: currentCol, result: value })}
                tabIndex={rowIndex * 9 + colIndex + 1}
                className={`
                  multiplication-cell aspect-square flex items-center justify-center text-xs sm:text-sm font-semibold
                  rounded-lg transition-all duration-300 border-2 touch-button touch-manipulation no-zoom backdrop-blur-sm
                  ${isSelected
                    ? 'selected bg-gradient-to-br from-primary/90 to-primary text-primary-foreground border-primary/70 shadow-2xl shadow-primary/30 z-10 relative ring-4 ring-primary/40'
                    : isSameResult
                    ? 'same-result bg-gradient-to-br from-blue-100/80 to-blue-50/80 text-blue-800 border-blue-300/70 dark:from-blue-900/50 dark:to-blue-800/40 dark:text-blue-300 dark:border-blue-600/70 shadow-xl shadow-blue-500/20 ring-2 ring-blue-400/60'
                    : isAreaHighlighted
                    ? 'highlighted bg-gradient-to-br from-accent/80 to-accent/60 text-accent-foreground border-accent/70 shadow-lg shadow-accent/20 ring-2 ring-accent/60'
                    : 'bg-gradient-to-br from-secondary/80 to-secondary/60 hover:from-accent/80 hover:to-accent/60 text-secondary-foreground border-border/50 hover:border-accent/70 hover:shadow-lg hover:shadow-accent/20 hover:scale-102'
                  }
                `}
                style={{
                  minHeight: '2.5rem',
                  minWidth: '2.5rem',
                  transform: isSelected ? 'scale(1.15)' : (isSameResult || isAreaHighlighted) ? 'scale(1.05)' : 'scale(1)',
                  zIndex: isSelected ? 10 : (isSameResult || isAreaHighlighted) ? 5 : 1
                }}
              >
                <span className={`${isSelected ? 'font-black text-lg' : (isSameResult || isAreaHighlighted) ? 'font-bold' : 'font-semibold'}`}>
                  {value}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
} 