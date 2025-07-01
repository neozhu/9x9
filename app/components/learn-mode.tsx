import { MultiplicationGrid } from './multiplication-grid';
import { getFormulaByLocale, generateGrid, findSameResultCombinations } from '@/lib/multiplication-utils';
import { useLocale } from '@/app/hooks/use-locale';
import { Volume2, RotateCcw, VolumeX, Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';

interface LearnModeProps {
  selectedCell: {row: number, col: number} | null;
  selectedResult: number | null;
  speechEnabled: boolean;
  speechSupported: boolean;
  speechInitialized?: boolean;
  onCellClick: (row: number, col: number) => void;
  onSpeechToggle: () => void;
  onRepeatSpeech: () => void;
}

export function LearnMode({
  selectedCell,
  selectedResult,
  speechEnabled,
  speechSupported,
  speechInitialized = true,
  onCellClick,
  onSpeechToggle,
  onRepeatSpeech
}: LearnModeProps) {
  const { locale, t, isLoading, messages } = useLocale();

  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  // 安全的翻译函数，在翻译未加载时提供默认值
  const safeT = (key: string, fallback?: string) => {
    if (isLoading || !messages) {
      if (fallback) return fallback;
      // 提供一些常用的默认翻译
      const defaultTexts: Record<string, Record<string, string>> = {
        zh: {
          'grid.clickCell': '点击格子学习乘法',
          'grid.welcomeTitle': '🎯 开始你的乘法之旅',
          'grid.welcomeSubtitle': '选择任意格子，探索乘法的奥秘',
          'speech.enabled': '语音开启',
          'common.repeat': '重复',
          'common.enabled': '开启',
          'common.disabled': '关闭',
          'learn.clickAnyNumber': '点击任意数字学习乘法口诀',
          'learn.practiceDaily': '每天练习几分钟，轻松记住九九表',
          'learn.clickToHear': '点击数字即可听到语音朗读',
          'learn.sameResult': '蓝色方块表示相同的结果',
          'common.other': '其他组合'
        },
        en: {
          'grid.clickCell': 'Click a cell to learn multiplication',
          'grid.welcomeTitle': '🎯 Start Your Multiplication Journey',
          'grid.welcomeSubtitle': 'Choose any cell to explore the magic of multiplication',
          'speech.enabled': 'Speech Enabled',
          'common.repeat': 'Repeat',
          'common.enabled': 'Enabled',
          'common.disabled': 'Disabled',
          'learn.clickAnyNumber': 'Click any number to learn multiplication',
          'learn.practiceDaily': 'Practice a few minutes daily to master the multiplication table',
          'learn.clickToHear': 'Click numbers to hear speech',
          'learn.sameResult': 'Blue squares show same results',
          'common.other': 'Other combinations'
        },
        de: {
          'grid.clickCell': 'Klicken Sie auf eine Zelle, um Multiplikation zu lernen',
          'grid.welcomeTitle': '🎯 Beginnen Sie Ihre Einmaleins-Reise',
          'grid.welcomeSubtitle': 'Wählen Sie eine beliebige Zelle, um die Wunder der Multiplikation zu entdecken',
          'speech.enabled': 'Sprache aktiviert',
          'common.repeat': 'Wiederholen',
          'common.enabled': 'Aktiviert',
          'common.disabled': 'Deaktiviert',
          'learn.clickAnyNumber': 'Klicken Sie auf eine beliebige Zahl, um Multiplikation zu lernen',
          'learn.practiceDaily': 'Üben Sie täglich einige Minuten, um das Einmaleins zu beherrschen',
          'learn.clickToHear': 'Zahlen anklicken, um Sprache zu hören',
          'learn.sameResult': 'Blaue Quadrate zeigen gleiche Ergebnisse',
          'common.other': 'Andere Kombinationen'
        },
        ja: {
          'grid.clickCell': 'セルをクリックして掛け算を学習しましょう',
          'grid.welcomeTitle': '🎯 かけ算の旅を始めよう',
          'grid.welcomeSubtitle': '好きなマスを選んで、かけ算の魔法を発見しよう',
          'speech.enabled': '音声有効',
          'common.repeat': '繰り返し',
          'common.enabled': '有効',
          'common.disabled': '無効',
          'learn.clickAnyNumber': '任意の数字をクリックして掛け算を学習',
          'learn.practiceDaily': '毎日数分練習して九九表をマスター',
          'learn.clickToHear': '数字をクリックして音声を聞く',
          'learn.sameResult': '青い四角は同じ結果を表示',
          'common.other': '他の組み合わせ'
        }
      };
      
      return defaultTexts[locale]?.[key] || defaultTexts['en']?.[key] || key;
    }
    return t(key);
  };

  const getDisplayFormula = () => {
    if (!selectedCell) {
      return {
        formula: safeT('grid.welcomeTitle'),
        equation: safeT('grid.welcomeSubtitle'),
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
      combinationInfo = `${safeT('common.other')}: ${otherFormulas}`;
    }
    
    return {
      formula: getFormulaByLocale(selectedCell.row, selectedCell.col, result, locale),
      equation: `${selectedCell.row} × ${selectedCell.col} = ${result}`,
      combinationInfo
    };
  };

  const grid = useMemo(() => generateGrid(), []);
  const { formula, equation, combinationInfo } = useMemo(getDisplayFormula, [selectedCell, locale, safeT]);
  const sameResultCombinations = useMemo(() => selectedResult ? findSameResultCombinations(selectedResult) : [], [selectedResult]);

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
                  <span className="text-xs font-medium text-foreground truncate">
                    {speechInitialized ? safeT('speech.enabled') : (isIOS ? 'Audio is being prepared—tap anywhere to activate.' : safeT('speech.enabled'))}
                  </span>
                </div>
                
                {selectedCell && speechInitialized && (
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
                    <span className="text-xs">{safeT('common.repeat')}</span>
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
                <span className="text-xs">{speechEnabled ? safeT('common.enabled') : safeT('common.disabled')}</span>
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
          <p className="text-sm text-muted-foreground">{safeT('learn.clickAnyNumber')}</p>
          <p className="text-sm text-muted-foreground">{safeT('learn.practiceDaily')}</p>
          
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {speechSupported && (
              <Badge variant="outline" className={cn(
                "bg-background/50 backdrop-blur text-xs gap-1",
                "dark:bg-background/70 dark:border-border/60"
              )}>
                <Lightbulb className="w-3 h-3" />
                <span>{speechInitialized ? safeT('learn.clickToHear') : '点击激活语音功能'}</span>
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
                <span>{safeT('learn.sameResult')}</span>
              </Badge>
          </div>
        </CardContent>
      </Card>

      {/* iOS Safari 特别提示 */}
      {isIOS && speechSupported && !speechInitialized && speechEnabled && (
        <Card className="mb-6 bg-amber-50/80 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-700/50">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">iOS Safari 语音提示</p>
                <p>请点击屏幕任意位置来激活语音功能。这是 iOS Safari 的安全要求。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
} 