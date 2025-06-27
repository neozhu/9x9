import { useLocale } from "../hooks/use-locale";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <Card className={cn(
      "mb-8 py-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "border border-border/50 shadow-xl",
      "transition-all duration-300 ease-in-out",
      "animate-in fade-in-0 slide-in-from-bottom-6"
    )}>
      {/* Glassmorphism overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-transparent rounded-xl pointer-events-none" />
      
      <CardContent className="p-4 sm:p-6 relative z-10">
        <div className="grid grid-cols-9 gap-1 sm:gap-2 max-w-lg mx-auto">
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
                <Button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                  variant="outline"
                  size="sm"
                  aria-label={t('grid.formula', { num1: currentRow, num2: currentCol, result: value })}
                  className={cn(
                    // Base styles
                    "aspect-square p-0 text-xs sm:text-sm font-semibold",
                    "min-h-[2.5rem] min-w-[2.5rem] rounded-lg",
                    "transition-all duration-300 ease-out",
                    "border-2 backdrop-blur touch-manipulation",
                    "relative overflow-hidden",
                    
                    // Selected state
                    isSelected && [
                      "bg-primary text-primary-foreground border-primary",
                      "shadow-xl shadow-primary/40 z-20 scale-110",
                      "ring-4 ring-primary/30",
                      "font-black text-base sm:text-lg"
                    ],
                    
                    // Same result state - Enhanced for dark mode
                    isSameResult && !isSelected && [
                      "bg-blue-100 dark:bg-blue-800/80 text-blue-900 dark:text-blue-100",
                      "border-blue-400 dark:border-blue-400/90",
                      "shadow-lg shadow-blue-500/30 dark:shadow-blue-400/40 z-10 scale-105",
                      "ring-2 ring-blue-400/40 dark:ring-blue-400/60",
                      "font-bold",
                      // Additional glow effect for dark mode
                      "dark:shadow-[0_0_12px_rgba(96,165,250,0.4)]"
                    ],
                    
                    // Highlighted area state - Enhanced for dark mode
                    isAreaHighlighted && !isSameResult && [
                      "bg-green-50 dark:bg-green-800/70 text-green-800 dark:text-green-100",
                      "border-green-400 dark:border-green-400/90",
                      "shadow-md shadow-green-500/25 dark:shadow-green-400/40 z-5 scale-[1.02]",
                      "ring-2 ring-green-400/30 dark:ring-green-400/60",
                      "font-semibold",
                      // Additional glow effect for dark mode
                      "dark:shadow-[0_0_8px_rgba(74,222,128,0.3)]"
                    ],
                    
                    // Default state
                    !isSelected && !isSameResult && !isAreaHighlighted && [
                      "bg-background/95 supports-[backdrop-filter]:bg-background/60",
                      "hover:bg-accent hover:text-accent-foreground",
                      "border-border hover:border-accent-foreground/50",
                      "hover:shadow-md hover:scale-[1.05]",
                      "hover:z-5"
                    ]
                  )}
                  style={{
                    zIndex: isSelected ? 20 : (isSameResult || isAreaHighlighted) ? 10 : 1
                  }}
                >
                  {/* Cell content with enhanced typography */}
                  <span className={cn(
                    "relative z-10 transition-all duration-200",
                    isSelected && "drop-shadow-sm",
                    (isSameResult || isAreaHighlighted) && "font-bold drop-shadow-sm"
                  )}>
                    {value}
                  </span>
                  
                  {/* Subtle shine effect for selected cells */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-lg" />
                  )}
                  
                  {/* Enhanced glow effects for dark mode highlighting */}
                  {isSameResult && !isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 dark:from-blue-400/20 to-transparent rounded-lg" />
                  )}
                  
                  {isAreaHighlighted && !isSameResult && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 dark:from-green-400/20 to-transparent rounded-lg" />
                  )}
                </Button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
} 