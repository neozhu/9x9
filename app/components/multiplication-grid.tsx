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
      "border border-border/50 shadow-2xl",
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
                      "shadow-xl shadow-primary/30 z-20 scale-110",
                      "ring-4 ring-primary/20",
                      "font-black text-base sm:text-lg"
                    ],
                    
                    // Same result state
                    isSameResult && !isSelected && [
                      "bg-blue-100/80 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
                      "border-blue-300/70 dark:border-blue-600/70",
                      "shadow-lg shadow-blue-500/20 z-10 scale-105",
                      "ring-2 ring-blue-400/30",
                      "font-bold"
                    ],
                    
                    // Highlighted area state
                    isAreaHighlighted && !isSameResult && [
                      "bg-accent/80 text-accent-foreground border-accent-foreground/50",
                      "shadow-md shadow-accent/20 z-5 scale-[1.02]",
                      "ring-2 ring-accent/20",
                      "font-semibold"
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
                    (isSameResult || isAreaHighlighted) && "font-bold"
                  )}>
                    {value}
                  </span>
                  
                  {/* Subtle shine effect for selected cells */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-lg" />
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