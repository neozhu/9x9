import { MultiplicationGrid } from './multiplication-grid';
import { getFormulaByLocale, generateGrid, findSameResultCombinations } from '@/lib/multiplication-utils';
import { useLocale } from '../hooks/use-locale';
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
          <div className="flex items-center justify-between p-3 bg-white/30 dark:bg-white/10 backdrop-blur-lg backdrop-saturate-150 border border-white/50 dark:border-white/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">{t('speech.enabled')}</span>
              {selectedCell && (
                <button
                  onClick={onRepeatSpeech}
                  className="ml-2 px-2 py-1 text-xs bg-accent text-accent-foreground rounded hover:bg-accent/80 transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('common.repeat')}</span>
                </button>
              )}
            </div>
            <button
              onClick={onSpeechToggle}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                speechEnabled 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
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
        className="mb-8 p-6 relative rounded-xl text-center bg-white/30 dark:bg-white/10 backdrop-blur-lg backdrop-saturate-150 border border-white/50 dark:border-white/20 shadow-xl"
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