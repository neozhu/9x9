import { MultiplicationGrid } from './multiplication-grid';
import { getChineseFormula, generateGrid, findSameResultCombinations } from '@/lib/multiplication-utils';
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
  const getDisplayFormula = () => {
    if (!selectedCell) {
      return {
        chinese: "请选择一个数字",
        equation: "点击下方数字开始学习",
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
      combinationInfo = `其他组合：${otherFormulas}`;
    }
    
    return {
      chinese: getChineseFormula(selectedCell.row, selectedCell.col, result),
      equation: `${selectedCell.row} × ${selectedCell.col} = ${result}`,
      combinationInfo
    };
  };

  const grid = generateGrid();
  const { chinese, equation, combinationInfo } = getDisplayFormula();
  const sameResultCombinations = selectedResult ? findSameResultCombinations(selectedResult) : [];

  return (
    <>
      {/* 功能控制区域 */}
      <div className="mb-4 space-y-3">
        {speechSupported && (
          <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">语音朗读</span>
              {selectedCell && (
                <button
                  onClick={onRepeatSpeech}
                  className="ml-2 px-2 py-1 text-xs bg-accent text-accent-foreground rounded hover:bg-accent/80 transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重复</span>
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
              <span>{speechEnabled ? '开启' : '关闭'}</span>
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
          {chinese}
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
        <p>点击任意数字学习乘法口诀</p>
        <p className="mt-1">每天练习几分钟，轻松记住九九表</p>
        {speechSupported && (
          <p className="mt-2 text-xs opacity-75 flex items-center justify-center space-x-1">
            <Lightbulb className="w-3 h-3" />
            <span>点击数字即可听到语音朗读</span>
          </p>
        )}
        <p className="mt-1 text-xs opacity-75 text-blue-600 dark:text-blue-400 flex items-center justify-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>蓝色方块表示相同的结果</span>
        </p>
      </div>
    </>
  );
} 