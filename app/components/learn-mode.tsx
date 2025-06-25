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
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/40 via-white/25 to-white/30 dark:from-white/15 dark:via-white/8 dark:to-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/40 dark:border-white/25 rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/30 relative overflow-hidden">
            {/* 内部光泽效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 dark:from-white/10 dark:via-transparent dark:to-white/5 rounded-xl pointer-events-none"></div>
            
            <div className="flex items-center space-x-2 relative z-10">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">{t('speech.enabled')}</span>
              {selectedCell && (
                <button
                  onClick={onRepeatSpeech}
                  className="ml-2 px-3 py-1.5 text-xs bg-white/30 dark:bg-white/15 backdrop-blur-md border border-white/40 dark:border-white/25 text-foreground rounded-lg hover:bg-white/40 dark:hover:bg-white/20 transition-all duration-200 flex items-center space-x-1 shadow-lg"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('common.repeat')}</span>
                </button>
              )}
            </div>
            <button
              onClick={onSpeechToggle}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 backdrop-blur-md border shadow-lg relative z-10 ${
                speechEnabled 
                  ? 'bg-green-100/70 dark:bg-green-900/50 text-green-800 dark:text-green-400 border-green-200/60 dark:border-green-700/60 hover:bg-green-100/80 dark:hover:bg-green-900/60' 
                  : 'bg-white/30 dark:bg-white/15 text-muted-foreground border-white/40 dark:border-white/25 hover:bg-white/40 dark:hover:bg-white/20'
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
        className="mb-8 p-8 relative rounded-2xl text-center bg-gradient-to-br from-white/50 via-white/30 to-white/40 dark:from-white/20 dark:via-white/10 dark:to-white/15 backdrop-blur-2xl backdrop-saturate-150 border border-white/50 dark:border-white/30 shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden"
      >
        {/* 多层内部光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20 dark:from-white/15 dark:via-transparent dark:to-white/10 rounded-2xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent dark:from-white/10 dark:to-transparent rounded-t-2xl pointer-events-none"></div>
        
        <div 
          className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2 transition-all duration-300 ease-in-out relative z-10"
          style={{ 
            fontSize: selectedCell ? '2rem' : '1.5rem',
            opacity: selectedCell ? 1 : 0.7 
          }}
        >
          {formula}
        </div>
        <div 
          className="text-lg sm:text-xl text-muted-foreground transition-all duration-300 ease-in-out relative z-10"
          style={{ 
            fontSize: selectedCell ? '1.25rem' : '1rem',
            opacity: selectedCell ? 1 : 0.7 
          }}
        >
          {equation}
        </div>
        {selectedCell && (
          <div className="mt-4 space-y-2 relative z-10">
            {combinationInfo && (
              <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center space-x-1 bg-blue-50/50 dark:bg-blue-950/30 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 rounded-lg px-3 py-1">
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
        <div className="p-6 bg-gradient-to-r from-white/25 via-white/15 to-white/20 dark:from-white/10 dark:via-white/5 dark:to-white/8 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 relative overflow-hidden">
          {/* 内部光泽效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10 dark:from-white/8 dark:via-transparent dark:to-white/5 rounded-xl pointer-events-none"></div>
          
          <div className="space-y-3 relative z-10">
            <p>{t('learn.clickAnyNumber')}</p>
            <p>{t('learn.practiceDaily')}</p>
            {speechSupported && (
              <p className="text-xs opacity-75 flex items-center justify-center space-x-1 bg-blue-50/30 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/20 dark:border-blue-800/20 rounded-lg px-3 py-1 mx-auto w-fit">
                <Lightbulb className="w-3 h-3" />
                <span>{t('learn.clickToHear')}</span>
              </p>
            )}
            <p className="text-xs opacity-75 text-blue-600 dark:text-blue-400 flex items-center justify-center space-x-1 bg-blue-50/30 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/20 dark:border-blue-800/20 rounded-lg px-3 py-1 mx-auto w-fit">
              <Sparkles className="w-3 h-3" />
              <span>{t('learn.sameResult')}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 