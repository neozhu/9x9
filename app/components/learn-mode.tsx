import { MultiplicationGrid } from './multiplication-grid';
import { getFormulaByLocale, generateGrid, findSameResultCombinations } from '@/lib/multiplication-utils';
import { useLocale } from '@/app/hooks/use-locale';
import { Volume2, RotateCcw, VolumeX, Lightbulb, Sparkles } from 'lucide-react';

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
      {/* 功能控制区域 */}
      <div className="mb-4 space-y-3">
        {speechSupported && (
          <div className="flex items-center justify-between p-3 supports-[backdrop-filter]:bg-white/30 supports-[backdrop-filter]:dark:bg-white/10 supports-[backdrop-filter]:backdrop-blur-lg supports-[backdrop-filter]:backdrop-saturate-150 bg-white/90 dark:bg-gray-800/90 border border-white/50 dark:border-white/20 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">{t('speech.enabled')}</span>
              {selectedCell && (
                <button
                  onClick={onRepeatSpeech}
                  className="ml-2 px-2 py-1 text-xs supports-[backdrop-filter]:bg-white/20 supports-[backdrop-filter]:dark:bg-white/10 supports-[backdrop-filter]:backdrop-blur-sm bg-white/40 dark:bg-gray-700/60 border border-white/30 dark:border-white/20 text-foreground rounded hover:supports-[backdrop-filter]:bg-white/30 hover:supports-[backdrop-filter]:dark:bg-white/15 hover:bg-white/60 hover:dark:bg-gray-600/80 transition-all duration-200 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('common.repeat')}</span>
                </button>
              )}
            </div>
            <button
              onClick={onSpeechToggle}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 supports-[backdrop-filter]:backdrop-blur-sm border ${
                speechEnabled 
                  ? 'supports-[backdrop-filter]:bg-green-100/60 supports-[backdrop-filter]:dark:bg-green-900/40 bg-green-100/80 dark:bg-green-900/60 text-green-800 dark:text-green-400 border-green-200/50 dark:border-green-700/50 hover:supports-[backdrop-filter]:bg-green-100/80 hover:supports-[backdrop-filter]:dark:bg-green-900/60 hover:bg-green-100 hover:dark:bg-green-900/80' 
                  : 'supports-[backdrop-filter]:bg-white/20 supports-[backdrop-filter]:dark:bg-white/10 bg-white/40 dark:bg-gray-700/60 text-muted-foreground border-white/30 dark:border-white/20 hover:supports-[backdrop-filter]:bg-white/30 hover:supports-[backdrop-filter]:dark:bg-white/15 hover:bg-white/60 hover:dark:bg-gray-600/80'
              }`}
            >
              {speechEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              <span>{speechEnabled ? t('common.enabled') : t('common.disabled')}</span>
            </button>
          </div>
        )}
      </div>

      {/* 顶部口诀显示区域 */}
      <div
        className="mb-8 p-6 relative rounded-xl text-center supports-[backdrop-filter]:bg-white/30 supports-[backdrop-filter]:dark:bg-white/10 supports-[backdrop-filter]:backdrop-blur-lg supports-[backdrop-filter]:backdrop-saturate-150 bg-white/90 dark:bg-gray-800/90 border border-white/50 dark:border-white/20 shadow-xl"
      >
        <div 
          className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2 transition-all duration-300 ease-in-out"
          style={{ 
            fontSize: selectedCell ? '2rem' : '1.5rem',
            opacity: selectedCell ? 1 : 0.7 
          }}
        >
          {formula}
        </div>
        <div 
          className="text-lg sm:text-xl text-muted-foreground transition-all duration-300 ease-in-out"
          style={{ 
            fontSize: selectedCell ? '1.25rem' : '1rem',
            opacity: selectedCell ? 1 : 0.7 
          }}
        >
          {equation}
        </div>
        {selectedCell && (
          <div className="mt-3 space-y-1">
            {combinationInfo && (
              <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center space-x-1">
                <Lightbulb className="w-3 h-3" />
                <span className="text-xs">{combinationInfo}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 9x9网格区域 */}
      <MultiplicationGrid
        grid={grid}
        selectedCell={selectedCell}
        selectedResult={selectedResult}
        sameResultCombinations={sameResultCombinations}
        onCellClick={onCellClick}
      />

      {/* 底部说明 */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>{t('learn.clickAnyNumber')}</p>
        <p className="mt-1">{t('learn.practiceDaily')}</p>
        {speechSupported && (
          <p className="mt-2 text-xs opacity-75 flex items-center justify-center space-x-1">
            <Lightbulb className="w-3 h-3" />
            <span>{t('learn.clickToHear')}</span>
          </p>
        )}
        <p className="mt-1 text-xs opacity-75 text-blue-600 dark:text-blue-400 flex items-center justify-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>{t('learn.sameResult')}</span>
        </p>
      </div>
    </>
  );
} 