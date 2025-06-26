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
          "mb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border border-border/50 shadow-lg"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{t('speech.enabled')}</span>
                </div>
                
                {selectedCell && (
                  <Button
                    onClick={onRepeatSpeech}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 px-3 bg-background/95 backdrop-blur",
                      "supports-[backdrop-filter]:bg-background/60",
                      "hover:bg-accent hover:scale-105",
                      "transition-all duration-200"
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
                  "transition-all duration-200 backdrop-blur",
                  speechEnabled 
                    ? "bg-green-600/90 hover:bg-green-600 text-white border-green-600/20 shadow-green-600/25" 
                    : "hover:scale-105"
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
        "mb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border border-border/50 shadow-xl",
        "transition-all duration-300 ease-in-out",
        selectedCell && "shadow-2xl scale-[1.02]"
      )}>
        <CardContent className="p-6 sm:p-8 text-center space-y-4">
          {/* Main Formula Display */}
          <div 
            className={cn(
              "font-bold text-card-foreground transition-all duration-300 ease-in-out",
              "animate-in fade-in-0 slide-in-from-top-4",
              selectedCell ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl opacity-70"
            )}
          >
            {formula}
          </div>
          
          {/* Equation Display */}
          <div 
            className={cn(
              "text-muted-foreground transition-all duration-300 ease-in-out",
              "animate-in fade-in-0 slide-in-from-top-4 delay-100",
              selectedCell ? "text-lg sm:text-xl md:text-2xl" : "text-base sm:text-lg opacity-70"
            )}
          >
            {equation}
          </div>
          
          {/* Combination Info with Badge */}
          {selectedCell && combinationInfo && (
            <div className="flex justify-center animate-in fade-in-0 slide-in-from-bottom-4 delay-200">
              <Badge 
                variant="outline" 
                className={cn(
                  "bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300",
                  "border-blue-200/50 dark:border-blue-800/50 backdrop-blur",
                  "px-3 py-1.5 text-xs gap-1.5"
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
      <div className="animate-in fade-in-0 slide-in-from-bottom-6 delay-300">
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
        "animate-in fade-in-0 slide-in-from-bottom-4 delay-500"
      )}>
        <CardContent className="p-4 text-center space-y-3">
          <p className="text-sm text-muted-foreground">{t('learn.clickAnyNumber')}</p>
          <p className="text-sm text-muted-foreground">{t('learn.practiceDaily')}</p>
          
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {speechSupported && (
              <Badge variant="outline" className="bg-background/50 backdrop-blur text-xs gap-1">
                <Lightbulb className="w-3 h-3" />
                <span>{t('learn.clickToHear')}</span>
              </Badge>
            )}
            
            <Badge 
              variant="outline" 
              className={cn(
                "bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
                "border-blue-200/50 dark:border-blue-800/50 text-xs gap-1"
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