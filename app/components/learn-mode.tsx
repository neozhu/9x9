import { MultiplicationGrid } from './multiplication-grid';
import { getFormulaByLocale, generateGrid, findSameResultCombinations } from '@/lib/multiplication-utils';
import { useLocale } from '@/app/hooks/use-locale';
import { Volume2, RotateCcw, VolumeX, Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LearnModeProps {
  selectedCell: {row: number, col: number} | null;
  selectedResult: number | null;
  speechEnabled: boolean;
  speechSupported: boolean;
  onCellClick: (row: number, col: number) => void;
  onSpeechToggle: () => void;
  onRepeatSpeech: () => void;
}

export function LearnMode({
  selectedCell,
  selectedResult,
  speechEnabled,
  speechSupported,
  onCellClick,
  onSpeechToggle,
  onRepeatSpeech
}: LearnModeProps) {
  const { locale, t } = useLocale();

  const getDisplayFormula = () => {
    if (!selectedCell) {
      return {
        formula: t('grid.clickCell'),
        equation: t('grid.clickCell'),
        combinationInfo: ""
      };
    }
    
    const result = selectedCell.row * selectedCell.col;
    
    const sameResultCombinations = findSameResultCombinations(result);
    const otherCombinations = sameResultCombinations.filter(
      combo => !(combo.row === selectedCell.row && combo.col === selectedCell.col)
    );
    
    let combinationInfo = "";
    if (otherCombinations.length > 0) {
      const otherFormulas = otherCombinations.map(combo => `${combo.row}×${combo.col}`).join('、');
      combinationInfo = `${t('common.other')}: ${otherFormulas}`;
    }
    
    return {
      formula: getFormulaByLocale(selectedCell.row, selectedCell.col, result, locale),
      equation: `${selectedCell.row} × ${selectedCell.col} = ${result}`,
      combinationInfo
    };
  };

  const grid = generateGrid();
  const { formula, equation, combinationInfo } = getDisplayFormula();
  const sameResultCombinations = selectedResult ? findSameResultCombinations(selectedResult) : [];

  return (
    <>
      {/* 功能控制区域 - Enhanced with shadcn/ui */}
      {speechSupported && (
        <Card className={cn(
          "mb-3 py-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border border-border/10 shadow-sm",
          "dark:bg-background/90 dark:border-border/60 dark:shadow-sm dark:shadow-background/20"
        )}>
          <CardContent className="p-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground truncate">{t('speech.enabled')}</span>
                </div>
                
                {selectedCell && (
                  <Button
                    onClick={onRepeatSpeech}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-7 px-2 bg-background/95 backdrop-blur",
                      "supports-[backdrop-filter]:bg-background/60",
                      "hover:bg-accent",
                      "dark:bg-background/90 dark:hover:bg-accent/80 dark:border-border/70"
                    )}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    <span className="text-xs">{t('common.repeat')}</span>
                  </Button>
                )}
              </div>
              
              <Button
                onClick={onSpeechToggle}
                variant={speechEnabled ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-7 px-2 backdrop-blur flex-shrink-0",
                  speechEnabled 
                    ? [
                        "bg-green-600/90 hover:bg-green-600 text-white border-green-600/20",
                        "shadow-green-600/25 dark:bg-green-600 dark:hover:bg-green-500",
                        "dark:shadow-green-600/40"
                      ]
                    : [
                        "dark:border-border/70 dark:hover:bg-accent/80"
                      ]
                )}
              >
                {speechEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
                <span className="text-xs">{speechEnabled ? t('common.enabled') : t('common.disabled')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 顶部口诀显示区域 - Enhanced with shadcn/ui */}
      <Card className={cn(
        "mb-8 py-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border border-border/50 shadow-xl",
        selectedCell && [
          "border-primary/30 dark:border-primary/50",
          "shadow-primary/10 dark:shadow-primary/20"
        ]
      )}>
        <CardContent className="p-6 sm:p-8 text-center space-y-4">
          {/* Main Formula Display */}
          <div 
            className={cn(
              "font-bold text-card-foreground",
              selectedCell ? [
                "text-2xl sm:text-3xl md:text-4xl",
                "text-primary dark:text-primary-foreground",
                "drop-shadow-sm dark:drop-shadow-md"
              ] : "text-xl sm:text-2xl opacity-70"
            )}
          >
            {formula}
          </div>
          
          {/* Equation Display */}
          <div 
            className={cn(
              "text-muted-foreground",
              selectedCell ? [
                "text-lg sm:text-xl md:text-2xl",
                "text-foreground/80 dark:text-foreground/90"
              ] : "text-base sm:text-lg opacity-70"
            )}
          >
            {equation}
          </div>
          
          {/* Combination Info with Badge */}
          {selectedCell && combinationInfo && (
            <div className="flex justify-center">
              <Badge 
                variant="outline" 
                className={cn(
                  "bg-blue-50/80 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200",
                  "border-blue-200/50 dark:border-blue-700/70 backdrop-blur",
                  "px-3 py-1.5 text-xs gap-1.5",
                  "shadow-sm dark:shadow-blue-900/30"
                )}
              >
                <Lightbulb className="w-3 h-3" />
                <span>{combinationInfo}</span>
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 9x9网格区域 */}
      <div>
        <MultiplicationGrid
          grid={grid}
          selectedCell={selectedCell}
          selectedResult={selectedResult}
          sameResultCombinations={sameResultCombinations}
          onCellClick={onCellClick}
        />
      </div>

      {/* 底部说明 - Enhanced with Cards */}
      <Card className={cn(
        "mt-6 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30",
        "border border-border/30 shadow-sm",
        "dark:bg-background/60 dark:border-border/40"
      )}>
        <CardContent className="p-4 text-center space-y-3">
          <p className="text-sm text-muted-foreground">{t('learn.clickAnyNumber')}</p>
          <p className="text-sm text-muted-foreground">{t('learn.practiceDaily')}</p>
          
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {speechSupported && (
              <Badge variant="outline" className={cn(
                "bg-background/50 backdrop-blur text-xs gap-1",
                "dark:bg-background/70 dark:border-border/60"
              )}>
                <Lightbulb className="w-3 h-3" />
                <span>{t('learn.clickToHear')}</span>
              </Badge>
            )}
            
            <Badge 
              variant="outline" 
              className={cn(
                "bg-blue-50/50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300",
                "border-blue-200/50 dark:border-blue-700/60 text-xs gap-1",
                "shadow-sm dark:shadow-blue-900/20"
              )}
            >
              <Sparkles className="w-3 h-3" />
              <span>{t('learn.sameResult')}</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 