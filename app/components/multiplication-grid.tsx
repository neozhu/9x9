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
    <div className="mb-8 p-6 supports-[backdrop-filter]:bg-gradient-to-br supports-[backdrop-filter]:from-white/20 supports-[backdrop-filter]:via-white/10 supports-[backdrop-filter]:to-white/5 supports-[backdrop-filter]:dark:from-white/15 supports-[backdrop-filter]:dark:via-white/8 supports-[backdrop-filter]:dark:to-white/3 supports-[backdrop-filter]:backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-white/30 dark:border-white/20 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 text-center relative overflow-hidden">
      {/* Glassmorphism overlay effect */}
      <div className="absolute inset-0 supports-[backdrop-filter]:bg-gradient-to-br supports-[backdrop-filter]:from-transparent supports-[backdrop-filter]:via-white/5 supports-[backdrop-filter]:to-transparent supports-[backdrop-filter]:dark:via-white/3 bg-gradient-to-br from-transparent via-white/2 to-transparent dark:via-white/1 rounded-2xl pointer-events-none"></div>
      
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
                  rounded transition-all duration-300 border-2 touch-button touch-manipulation no-zoom
                  ${isSelected
                    ? 'selected bg-primary text-primary-foreground border-primary shadow-xl z-10 relative ring-4 ring-primary/30'
                    : isSameResult
                    ? 'same-result supports-[backdrop-filter]:bg-blue-100/60 supports-[backdrop-filter]:dark:bg-blue-900/40 bg-blue-100/80 dark:bg-blue-900/60 text-blue-800 border-blue-300 dark:text-blue-300 dark:border-blue-600 shadow-lg ring-2 ring-blue-400/50'
                    : isAreaHighlighted
                    ? 'highlighted bg-accent text-accent-foreground border-accent-foreground shadow-md ring-2 ring-accent/50'
                    : 'supports-[backdrop-filter]:bg-secondary/80 supports-[backdrop-filter]:hover:bg-accent/80 bg-secondary hover:bg-accent text-secondary-foreground border-border hover:border-accent-foreground hover:shadow-md hover:scale-102'
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