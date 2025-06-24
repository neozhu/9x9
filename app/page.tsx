'use client';

import { useState, useEffect } from "react";

// 中文数字转换
const chineseNumbers = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

// 中文口诀转换函数
function getChineseFormula(multiplicand: number, multiplier: number, result: number): string {
  // 特殊处理一的乘法
  if (multiplicand === 1) {
    return `一${chineseNumbers[multiplier]}得${chineseNumbers[multiplier]}`;
  }
  
  // 转换结果为中文
  let resultChinese = '';
  if (result < 10) {
    resultChinese = chineseNumbers[result];
  } else if (result === 10) {
    resultChinese = '一十';
  } else if (result < 20) {
    resultChinese = `一十${chineseNumbers[result - 10]}`;
  } else {
    const tens = Math.floor(result / 10);
    const units = result % 10;
    resultChinese = `${chineseNumbers[tens]}十${units === 0 ? '' : chineseNumbers[units]}`;
  }
  
  return `${chineseNumbers[multiplicand]}${chineseNumbers[multiplier]}${resultChinese}`;
}

export default function Home() {
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [highlightSameResults, setHighlightSameResults] = useState(true);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);

  // 检测浏览器是否支持语音合成
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // 语音朗读函数
  const speakFormula = (multiplicand: number, multiplier: number) => {
    if (!speechEnabled || !speechSupported) return;
    
    // 停止当前正在播放的语音
    speechSynthesis.cancel();
    
    const result = multiplicand * multiplier;
    const formula = getChineseFormula(multiplicand, multiplier, result);
    
    const utterance = new SpeechSynthesisUtterance(formula);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8; // 稍慢的语速，便于理解
    utterance.pitch = 1.1; // 稍高的音调，更生动
    utterance.volume = 0.8;
    
    speechSynthesis.speak(utterance);
  };

  // 生成9x9网格数据
  const generateGrid = () => {
    const grid = [];
    for (let row = 1; row <= 9; row++) {
      const rowData = [];
      for (let col = 1; col <= 9; col++) {
        rowData.push(row * col);
      }
      grid.push(rowData);
    }
    return grid;
  };

  // 查找所有具有相同结果的组合
  const findSameResultCombinations = (targetResult: number) => {
    const combinations = [];
    for (let row = 1; row <= 9; row++) {
      for (let col = 1; col <= 9; col++) {
        if (row * col === targetResult) {
          combinations.push({ row, col });
        }
      }
    }
    return combinations;
  };

  const grid = generateGrid();

  const handleCellClick = (row: number, col: number) => {
    const newRow = row + 1;
    const newCol = col + 1;
    const result = newRow * newCol;
    
    setSelectedCell({ row: newRow, col: newCol });
    setSelectedResult(result);
    
    // 朗读口诀
    speakFormula(newRow, newCol);
  };

  const getDisplayFormula = () => {
    if (!selectedCell) {
      return {
        chinese: "请选择一个数字",
        equation: "点击下方数字开始学习",
        areaInfo: ""
      };
    }
    
    const result = selectedCell.row * selectedCell.col;
    const areaSize = selectedCell.row * selectedCell.col;
    
    // 获取相同结果的组合
    const sameResultCombinations = findSameResultCombinations(result);
    const otherCombinations = sameResultCombinations.filter(
      combo => !(combo.row === selectedCell.row && combo.col === selectedCell.col)
    );
    
    let combinationInfo = "";
    if (otherCombinations.length > 0 && highlightSameResults) {
      const otherFormulas = otherCombinations.map(combo => `${combo.row}×${combo.col}`).join('、');
      combinationInfo = `其他组合：${otherFormulas}`;
    }
    
    return {
      chinese: getChineseFormula(selectedCell.row, selectedCell.col, result),
      equation: `${selectedCell.row} × ${selectedCell.col} = ${result}`,
      areaInfo: `${selectedCell.row}行×${selectedCell.col}列矩形区域 (共${areaSize}个方块)`,
      combinationInfo
    };
  };

  const { chinese, equation, areaInfo, combinationInfo } = getDisplayFormula();

  // 重新朗读当前选中的口诀
  const repeatSpeech = () => {
    if (selectedCell) {
      speakFormula(selectedCell.row, selectedCell.col);
    }
  };

  // 获取相同结果的组合
  const sameResultCombinations = selectedResult && highlightSameResults 
    ? findSameResultCombinations(selectedResult) 
    : [];

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-md sm:max-w-lg">
        {/* 功能控制区域 */}
        <div className="mb-4 space-y-3">
          {/* 语音控制 */}
          {speechSupported && (
            <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">🔊 语音朗读</span>
                {selectedCell && (
                  <button
                    onClick={repeatSpeech}
                    className="ml-2 px-2 py-1 text-xs bg-accent text-accent-foreground rounded hover:bg-accent/80 transition-colors"
                  >
                    🔁 重复
                  </button>
                )}
              </div>
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  speechEnabled 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                <span>{speechEnabled ? '🔊' : '🔇'}</span>
                <span>{speechEnabled ? '开启' : '关闭'}</span>
              </button>
            </div>
          )}


        </div>

        {/* 顶部口诀显示区域 */}
        <div className="mb-8 p-6 bg-card border border-border rounded-lg shadow-sm text-center">
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
              <div className="text-sm text-muted-foreground opacity-75">
                <span className="text-xs">{areaInfo}</span>
              </div>
              {combinationInfo && (
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  <span className="text-xs">💡 {combinationInfo}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 9x9网格区域 */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-9 multiplication-grid gap-1 sm:gap-2">
            {grid.map((row, rowIndex) =>
              row.map((value, colIndex) => {
                const currentRow = rowIndex + 1;
                const currentCol = colIndex + 1;
                const isSelected = selectedCell?.row === currentRow && selectedCell?.col === currentCol;
                
                // 高亮显示矩形区域：从(1,1)到(selectedRow, selectedCol)的所有方块
                const isInHighlightedArea = selectedCell && 
                  currentRow <= selectedCell.row && 
                  currentCol <= selectedCell.col;
                const isAreaHighlighted = isInHighlightedArea && !isSelected;
                
                // 检查是否是相同结果的方块
                const isSameResult = highlightSameResults && 
                  sameResultCombinations.some(combo => 
                    combo.row === currentRow && combo.col === currentCol
                  ) && !isSelected;
                
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      multiplication-cell aspect-square flex items-center justify-center text-xs sm:text-sm font-semibold
                      rounded transition-all duration-300 border-2 touch-button touch-manipulation no-zoom
                      ${isSelected
                        ? 'selected bg-primary text-primary-foreground border-primary shadow-xl z-10 relative ring-4 ring-primary/30'
                        : isSameResult
                        ? 'same-result bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-600 shadow-lg ring-2 ring-blue-400/50'
                        : isAreaHighlighted
                        ? 'highlighted bg-accent text-accent-foreground border-accent-foreground shadow-md ring-2 ring-accent/50'
                        : 'bg-secondary hover:bg-accent text-secondary-foreground border-border hover:border-accent-foreground hover:shadow-md hover:scale-102'
                      }
                    `}
                    style={{
                      minHeight: '2.5rem',
                      minWidth: '2.5rem',
                      transform: isSelected ? 'scale(1.15)' : (isSameResult || isAreaHighlighted) ? 'scale(1.05)' : 'scale(1)',
                      zIndex: isSelected ? 10 : (isSameResult || isAreaHighlighted) ? 5 : 1
                    }}
                  >
                    <span className={`${isSelected ? 'font-black text-lg' : (isSameResult || isAreaHighlighted) ? 'font-bold' : 'font-semibold'}`}>
                      {value}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>点击任意数字学习乘法口诀</p>
          <p className="mt-1">每天练习几分钟，轻松记住九九表</p>
          {speechSupported && (
            <p className="mt-2 text-xs opacity-75">💡 点击数字即可听到语音朗读</p>
          )}
          {highlightSameResults && (
            <p className="mt-1 text-xs opacity-75 text-blue-600 dark:text-blue-400">
              ✨ 蓝色方块表示相同的结果
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
