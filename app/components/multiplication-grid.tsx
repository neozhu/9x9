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
    <div className="mb-8 p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-2xl shadow-2xl text-center relative overflow-hidden">
      {/* Glassmorphism overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-transparent rounded-2xl pointer-events-none"></div>
      
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
                    ? 'same-result bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-600 shadow-lg ring-2 ring-blue-400/50'
                    : isAreaHighlighted
                    ? 'highlighted bg-accent text-accent-foreground border-accent-foreground shadow-md ring-2 ring-accent/50'
                    : 'bg-secondary hover:bg-accent text-secondary-foreground border-border hover:border-accent-foreground hover:shadow-md hover:scale-102'
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