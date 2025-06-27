import { useLocale } from "../hooks/use-locale";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useCallback, useMemo, useEffect, useState } from 'react';

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
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  
  // 检测iOS设备
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOSDevice(isIOS);
  }, []);
  
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const isInHighlightedArea = selectedCell && row <= selectedCell.row && col <= selectedCell.col;
  const isAreaHighlighted = isInHighlightedArea && !isSelected;
  const isSameResult = sameResultCombinations.some(combo => combo.row === row && combo.col === col) && !isSelected;

  // 移动端下精简样式
  const baseClass =
    "aspect-square p-0 text-xs sm:text-sm font-semibold min-h-[2.5rem] min-w-[2.5rem] rounded-lg relative overflow-hidden border-2 touch-manipulation";
  const selectedClass = isSelected && [
    "bg-orange-500 dark:bg-orange-400 text-white dark:text-orange-900 border-orange-600 dark:border-orange-300 font-black text-base sm:text-lg z-20 scale-110 ring-4 ring-orange-500/30 dark:ring-orange-400/50"
  ];
  const sameResultClass = isSameResult && !isSelected && [
    "bg-blue-100 dark:bg-blue-800/80 text-blue-900 dark:text-blue-100 border-blue-400 dark:border-blue-400/90 font-bold z-10 scale-105 ring-2 ring-blue-400/40 dark:ring-blue-400/60"
  ];
  const areaHighlightedClass = isAreaHighlighted && !isSameResult && [
    "bg-green-50 dark:bg-green-800/70 text-green-800 dark:text-green-100 border-green-400 dark:border-green-400/90 font-semibold z-5 scale-[1.02] ring-2 ring-green-400/30 dark:ring-green-400/60"
  ];
  const defaultClass = !isSelected && !isSameResult && !isAreaHighlighted && [
    "bg-background/95 sm:supports-[backdrop-filter]:bg-background/60 border-border",
    "hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-700 dark:hover:to-slate-800",
    "hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-400 dark:hover:border-slate-500",
    "hover:scale-[1.08] hover:z-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-800/50",
    "hover:ring-2 hover:ring-slate-300/40 dark:hover:ring-slate-600/40"
  ];

  // 移动端下移除高开销样式
  const transitionClass = "sm:transition-all sm:duration-300 sm:ease-out";
  const shadowClass = isSelected
    ? "sm:shadow-xl sm:shadow-orange-500/50 dark:sm:shadow-orange-400/60"
    : isSameResult
      ? "sm:shadow-lg sm:shadow-blue-500/30 dark:sm:shadow-blue-400/40"
      : isAreaHighlighted
        ? "sm:shadow-md sm:shadow-green-500/25 dark:sm:shadow-green-400/40"
        : "hover:sm:shadow-md hover:sm:shadow-slate-300/30 dark:hover:sm:shadow-slate-700/40";

  const handleClick = useCallback(() => {
    // iOS特殊处理：确保用户交互触发语音
    if (isIOSDevice) {
      // 添加触觉反馈（如果支持）
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // iOS需要在用户交互的同步上下文中激活语音合成
      if ('speechSynthesis' in window) {
        // 先尝试说一个空白字符来"激活"语音合成
        try {
          const testUtterance = new SpeechSynthesisUtterance(' ');
          testUtterance.volume = 0.01;
          speechSynthesis.speak(testUtterance);
        } catch (e) {
          console.log('iOS speech activation failed:', e);
        }
      }
    }
    
    onCellClick(row - 1, col - 1);
  }, [onCellClick, row, col, isIOSDevice]);

  // iOS无障碍增强
  const accessibilityProps = isIOSDevice ? {
    role: "button",
    tabIndex: 0,
    // iOS VoiceOver特殊属性
    'aria-describedby': `formula-${row}-${col}`,
    'data-ios-click': 'true',
    // 确保iOS能正确识别为可点击元素
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => {
      const element = e.currentTarget as HTMLButtonElement;
      element.style.transform = 'scale(0.95)';
    },
    onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => {
      const element = e.currentTarget as HTMLButtonElement;
      element.style.transform = '';
    }
  } : {};

  return (
    <>
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
          shadowClass,
          "multiplication-cell",
          isIOSDevice && "ios-enhanced"
        )}
        style={{
          zIndex: isSelected ? 20 : (isSameResult || isAreaHighlighted) ? 10 : 1
        }}
        {...accessibilityProps}
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
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-white/20 dark:from-orange-300/30 to-transparent opacity-50 rounded-lg" />
        )}
        {isSameResult && !isSelected && (
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-blue-400/10 dark:from-blue-400/20 to-transparent rounded-lg" />
        )}
        {isAreaHighlighted && !isSameResult && (
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-green-400/10 dark:from-green-400/20 to-transparent rounded-lg" />
        )}
        {/* 默认状态悬停效果 */}
        {!isSelected && !isSameResult && !isAreaHighlighted && (
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-transparent hover:from-slate-200/20 dark:hover:from-slate-600/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        )}
      </Button>
      
      {/* iOS VoiceOver的隐藏描述元素 */}
      {isIOSDevice && (
        <div 
          id={`formula-${row}-${col}`} 
          className="sr-only"
          aria-live="polite"
        >
          {t('grid.formula', { num1: row, num2: col, result: value })}
        </div>
      )}
    </>
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