import { useLocale } from "../hooks/use-locale";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useCallback, useMemo } from 'react';

interface MultiplicationGridProps {
  grid: number[][];
  selectedCell: {row: number, col: number} | null;
  selectedResult: number | null;
  sameResultCombinations: Array<{row: number, col: number}>;
  onCellClick: (row: number, col: number) => void;
}

interface GridCellProps {
  value: number;
  row: number;
  col: number;
  selectedCell: {row: number, col: number} | null;
  sameResultCombinations: Array<{row: number, col: number}>;
  onCellClick: (row: number, col: number) => void;
}

const GridCell = React.memo(function GridCell({
  value,
  row,
  col,
  selectedCell,
  sameResultCombinations,
  onCellClick
}: GridCellProps) {
  const { t } = useLocale();
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const isInHighlightedArea = selectedCell && row <= selectedCell.row && col <= selectedCell.col;
  const isAreaHighlighted = isInHighlightedArea && !isSelected;
  const isSameResult = sameResultCombinations.some(combo => combo.row === row && combo.col === col) && !isSelected;

  // 移动端下精简样式
  const baseClass =
    "aspect-square p-0 text-xs sm:text-sm font-semibold min-h-[2.5rem] min-w-[2.5rem] rounded-lg relative overflow-hidden border-2 touch-manipulation";
  const selectedClass = isSelected && [
    "bg-primary text-primary-foreground border-primary font-black text-base sm:text-lg z-20 scale-110 ring-4 ring-primary/30"
  ];
  const sameResultClass = isSameResult && !isSelected && [
    "bg-blue-100 dark:bg-blue-800/80 text-blue-900 dark:text-blue-100 border-blue-400 dark:border-blue-400/90 font-bold z-10 scale-105 ring-2 ring-blue-400/40 dark:ring-blue-400/60"
  ];
  const areaHighlightedClass = isAreaHighlighted && !isSameResult && [
    "bg-green-50 dark:bg-green-800/70 text-green-800 dark:text-green-100 border-green-400 dark:border-green-400/90 font-semibold z-5 scale-[1.02] ring-2 ring-green-400/30 dark:ring-green-400/60"
  ];
  const defaultClass = !isSelected && !isSameResult && !isAreaHighlighted && [
    "bg-background/95 sm:supports-[backdrop-filter]:bg-background/60 hover:bg-accent hover:text-accent-foreground border-border hover:border-accent-foreground/50 hover:scale-[1.05] hover:z-5"
  ];

  // 移动端下移除高开销样式
  const transitionClass = "sm:transition-all sm:duration-300 sm:ease-out";
  const shadowClass = isSelected
    ? "sm:shadow-xl sm:shadow-primary/40"
    : isSameResult
      ? "sm:shadow-lg sm:shadow-blue-500/30 dark:sm:shadow-blue-400/40"
      : isAreaHighlighted
        ? "sm:shadow-md sm:shadow-green-500/25 dark:sm:shadow-green-400/40"
        : "";

  const handleClick = useCallback(() => onCellClick(row - 1, col - 1), [onCellClick, row, col]);

  return (
    <Button
      key={`${row}-${col}`}
      onClick={handleClick}
      variant="outline"
      size="sm"
      aria-label={t('grid.formula', { num1: row, num2: col, result: value })}
      className={cn(
        baseClass,
        selectedClass,
        sameResultClass,
        areaHighlightedClass,
        defaultClass,
        transitionClass,
        shadowClass
      )}
      style={{
        zIndex: isSelected ? 20 : (isSameResult || isAreaHighlighted) ? 10 : 1
      }}
    >
      <span className={cn(
        "relative z-10 sm:transition-all sm:duration-200",
        isSelected && "drop-shadow-sm",
        (isSameResult || isAreaHighlighted) && "font-bold drop-shadow-sm"
      )}>
        {value}
      </span>
      {/* 仅在桌面端保留高开销效果 */}
      {isSelected && (
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-lg" />
      )}
      {isSameResult && !isSelected && (
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-blue-400/10 dark:from-blue-400/20 to-transparent rounded-lg" />
      )}
      {isAreaHighlighted && !isSameResult && (
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-green-400/10 dark:from-green-400/20 to-transparent rounded-lg" />
      )}
    </Button>
  );
});

export function MultiplicationGrid({
  grid,
  selectedCell,
  sameResultCombinations,
  onCellClick
}: MultiplicationGridProps) {
  // 用 useMemo 缓存 grid 渲染
  const cells = useMemo(() => (
    grid.map((row, rowIndex) =>
      row.map((value, colIndex) => (
        <GridCell
          key={`${rowIndex + 1}-${colIndex + 1}`}
          value={value}
          row={rowIndex + 1}
          col={colIndex + 1}
          selectedCell={selectedCell}
          sameResultCombinations={sameResultCombinations}
          onCellClick={onCellClick}
        />
      ))
    )
  ), [grid, selectedCell, sameResultCombinations, onCellClick]);

  return (
    <Card className={cn(
      "mb-8 py-0 bg-background/95 sm:backdrop-blur sm:supports-[backdrop-filter]:bg-background/60",
      "border border-border/50 sm:shadow-xl",
      "sm:transition-all sm:duration-300 sm:ease-in-out",
      "sm:animate-in sm:fade-in-0 sm:slide-in-from-bottom-6"
    )}>
      {/* Glassmorphism overlay effect 仅桌面端保留 */}
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-background/10 to-transparent rounded-xl pointer-events-none" />
      <CardContent className="p-4 sm:p-6 relative z-10">
        <div className="grid grid-cols-9 gap-1 sm:gap-2 max-w-lg mx-auto">
          {cells}
        </div>
      </CardContent>
    </Card>
  );
} 