import { chineseNumbers, difficultyConfigs } from './constants';
import type { Question, WrongQuestion, Difficulty } from './types';

// 中文口诀转换函数
export function getChineseFormula(multiplicand: number, multiplier: number, result: number): string {
  if (multiplicand === 1) {
    return `一${chineseNumbers[multiplier]}得${chineseNumbers[multiplier]}`;
  }
  
  let resultChinese = '';
  if (result < 10) {
    resultChinese = chineseNumbers[result];
  } else if (result === 10) {
    resultChinese = '十';
  } else if (result < 20) {
    resultChinese = `十${chineseNumbers[result - 10]}`;
  } else {
    const tens = Math.floor(result / 10);
    const units = result % 10;
    resultChinese = `${chineseNumbers[tens]}十${units === 0 ? '' : chineseNumbers[units]}`;
  }
  
  return `${chineseNumbers[multiplicand]}${chineseNumbers[multiplier]}${resultChinese}`;
}

// 生成9x9乘法表网格
export function generateGrid(): number[][] {
  const grid = [];
  for (let row = 1; row <= 9; row++) {
    const rowData = [];
    for (let col = 1; col <= 9; col++) {
      rowData.push(row * col);
    }
    grid.push(rowData);
  }
  return grid;
}

// 查找相同结果的组合
export function findSameResultCombinations(targetResult: number): Array<{row: number, col: number}> {
  const combinations = [];
  for (let row = 1; row <= 9; row++) {
    for (let col = 1; col <= 9; col++) {
      if (row * col === targetResult) {
        combinations.push({ row, col });
      }
    }
  }
  return combinations;
}

// 生成答案选项 - 支持不同难度的答案范围
export function generateAnswerOptions(correctAnswer: number, difficulty: Difficulty = 'beginner'): number[] {
  const options = [correctAnswer];
  const usedNumbers = new Set([correctAnswer]);
  
  // 根据难度调整答案范围
  const difficultyConfig = difficultyConfigs.find(config => config.id === difficulty);
  const maxRange = difficulty === 'beginner' ? 81 : 
                   difficulty === 'advanced' ? 361 : 9801; // 19*19 或 99*99
  
  // 生成2个干扰项
  while (options.length < 3) {
    let wrongAnswer;
    // 生成合理的错误答案
    const random = Math.random();
    if (random < 0.3) {
      // 相邻的数字
      const offset = Math.floor(Math.random() * 10) + 1;
      wrongAnswer = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
    } else if (random < 0.6) {
      // 基于相似乘法的结果
      if (difficultyConfig) {
        const [minMult, maxMult] = difficultyConfig.multiplicandRange;
        const [minMultiplier, maxMultiplier] = difficultyConfig.multiplierRange;
        const randomMult = Math.floor(Math.random() * (maxMult - minMult + 1)) + minMult;
        const randomMultiplier = Math.floor(Math.random() * (maxMultiplier - minMultiplier + 1)) + minMultiplier;
        wrongAnswer = randomMult * randomMultiplier;
      } else {
        wrongAnswer = Math.floor(Math.random() * maxRange) + 1;
      }
    } else {
      // 完全随机但合理的数字
      wrongAnswer = Math.floor(Math.random() * Math.min(maxRange, correctAnswer + 50)) + Math.max(1, correctAnswer - 50);
    }
    
    if (wrongAnswer > 0 && wrongAnswer <= maxRange && !usedNumbers.has(wrongAnswer)) {
      options.push(wrongAnswer);
      usedNumbers.add(wrongAnswer);
    }
  }
  
  // 随机排序
  return options.sort(() => Math.random() - 0.5);
}

// 生成随机题目 - 支持难度选择
export function generateRandomQuestion(difficulty: Difficulty = 'beginner'): Question {
  const difficultyConfig = difficultyConfigs.find(config => config.id === difficulty);
  
  if (!difficultyConfig) {
    // 默认使用初级难度
    const multiplicand = Math.floor(Math.random() * 9) + 1;
    const multiplier = Math.floor(Math.random() * 9) + 1;
    return {
      multiplicand,
      multiplier,
      correctAnswer: multiplicand * multiplier
    };
  }
  
  const [minMult, maxMult] = difficultyConfig.multiplicandRange;
  const [minMultiplier, maxMultiplier] = difficultyConfig.multiplierRange;
  
  const multiplicand = Math.floor(Math.random() * (maxMult - minMult + 1)) + minMult;
  const multiplier = Math.floor(Math.random() * (maxMultiplier - minMultiplier + 1)) + minMultiplier;
  
  return {
    multiplicand,
    multiplier,
    correctAnswer: multiplicand * multiplier
  };
}

// 从错题本生成题目
export function generateReviewQuestion(wrongQuestions: WrongQuestion[]): Question | null {
  if (wrongQuestions.length === 0) return null;
  
  const randomWrong = wrongQuestions[Math.floor(Math.random() * wrongQuestions.length)];
  return {
    multiplicand: randomWrong.multiplicand,
    multiplier: randomWrong.multiplier,
    correctAnswer: randomWrong.correctAnswer
  };
}

// 多语言公式生成函数
export function getFormulaByLocale(multiplicand: number, multiplier: number, result: number, locale: string): string {
  switch (locale) {
    case 'zh':
      return getChineseFormula(multiplicand, multiplier, result);
    case 'en':
      return `${multiplicand} times ${multiplier} equals ${result}`;
    case 'de':
      return `${multiplicand} mal ${multiplier} ist ${result}`;
    case 'ja':
      return `${multiplicand} かける ${multiplier} は ${result}`;
    default:
      return getChineseFormula(multiplicand, multiplier, result);
  }
}

// 语音朗读函数（支持多语言）
export function speakFormula(
  multiplicand: number, 
  multiplier: number, 
  speechEnabled: boolean, 
  speechSupported: boolean, 
  locale: string = 'zh',
  voiceSettings?: { lang?: string; rate?: number; pitch?: number; volume?: number }
) {
  if (!speechEnabled || !speechSupported) return;
  
  try {
    console.log('[speakFormula] try speak:', { multiplicand, multiplier, locale });
    
    // 检查iOS Safari是否需要用户交互激活
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // 对于iOS Safari，需要在用户交互中激活语音合成
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      }
      
      // 取消之前的语音
      speechSynthesis.cancel();
      
      const result = multiplicand * multiplier;
      const formula = getFormulaByLocale(multiplicand, multiplier, result, locale);
      const utterance = new SpeechSynthesisUtterance(formula);
      
      // 只设置 lang，避免 iOS 兼容性问题
      const defaultSettings = {
        'zh': { lang: 'zh-CN' },
        'en': { lang: 'en-US' },
        'de': { lang: 'de-DE' },
        'ja': { lang: 'ja-JP' }
      };
      
      const settings = defaultSettings[locale as keyof typeof defaultSettings] || defaultSettings.zh;
      utterance.lang = voiceSettings?.lang || settings.lang;
      
      // 添加事件监听器
      utterance.onstart = () => console.log('[speakFormula] speech start');
      utterance.onerror = (e) => {
        console.error('[speakFormula] speech error', e);
        // iOS Safari 常见错误：未在用户交互中启动
        if (e.error === 'not-allowed' || e.error === 'interrupted') {
          console.warn('[speakFormula] iOS Safari may need user interaction to enable speech');
        }
      };
      utterance.onend = () => console.log('[speakFormula] speech end');
      
      // 立即执行，确保在用户交互事件中
      speechSynthesis.speak(utterance);
    }
  } catch (err) {
    console.error('[speakFormula] exception', err);
  }
}

// 新增：iOS Safari 语音合成初始化函数
export function initializeSpeechSynthesis(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve(false);
      return;
    }

    try {
      // 对于iOS Safari，需要在用户交互中创建一个静音的语音来激活
      const testUtterance = new SpeechSynthesisUtterance('');
      testUtterance.volume = 0;
      testUtterance.onend = () => resolve(true);
      testUtterance.onerror = () => resolve(false);
      
      speechSynthesis.speak(testUtterance);
      
      // 备用超时
      setTimeout(() => resolve(true), 100);
    } catch (err) {
      console.error('[initializeSpeechSynthesis] error:', err);
      resolve(false);
    }
  });
}

// 心算技巧生成函数
export function generateCalculationTip(multiplicand: number, multiplier: number, locale: string = 'zh'): string | null {
  // 只为高级(11-19)和专家级(21-99)提供技巧
  if ((multiplicand < 11 || multiplier < 11)) {
    return null;
  }

  const a = multiplicand;
  const b = multiplier;
  
  // 1. 11的乘法特殊规律
  if (a === 11 || b === 11) {
    const other = a === 11 ? b : a;
    if (other >= 10 && other <= 99) {
      const tens = Math.floor(other / 10);
      const units = other % 10;
      const sum = other + tens;
      const middleStep = sum * 10;
      const unitsProduct = 1 * units;
      
      switch (locale) {
        case 'zh':
          return `11乘法技巧：${other}+${tens}=${sum} → ${sum}×10=${middleStep} → 1×${units}=${unitsProduct} → ${middleStep}+${unitsProduct}=${11 * other}`;
        case 'en':
          return `11 trick: ${other}+${tens}=${sum} → ${sum}×10=${middleStep} → 1×${units}=${unitsProduct} → ${11 * other}`;
        case 'de':
          return `11-Trick: ${other}+${tens}=${sum} → ${sum}×10=${middleStep} → 1×${units}=${unitsProduct} → ${11 * other}`;
        case 'ja':
          return `11の技巧：${other}+${tens}=${sum} → ${sum}×10=${middleStep} → 1×${units}=${unitsProduct} → ${11 * other}`;
        default:
          return `11乘法技巧：${other}+${tens}=${sum} → ${sum}×10=${middleStep} → 1×${units}=${unitsProduct} → ${middleStep}+${unitsProduct}=${11 * other}`;
      }
    }
  }
  
  // 2. 首位互补=10，末位相同的速算
  if (a >= 10 && b >= 10 && a <= 99 && b <= 99) {
    const a_tens = Math.floor(a / 10);
    const a_units = a % 10;
    const b_tens = Math.floor(b / 10);
    const b_units = b % 10;
    
    if (a_tens + b_tens === 10 && a_units === b_units) {
      const left = a_tens * b_tens + a_units;
      const right = a_units * a_units;
      
      switch (locale) {
        case 'zh':
          return `首位互补法：${a_tens}×${b_tens}+${a_units}=${left}，${a_units}²=${right.toString().padStart(2, '0')} → ${left}${right.toString().padStart(2, '0')}`;
        case 'en':
          return `Complement method: ${a_tens}×${b_tens}+${a_units}=${left}, ${a_units}²=${right.toString().padStart(2, '0')} → ${left}${right.toString().padStart(2, '0')}`;
        case 'de':
          return `Ergänzung: ${a_tens}×${b_tens}+${a_units}=${left}, ${a_units}²=${right.toString().padStart(2, '0')} → ${left}${right.toString().padStart(2, '0')}`;
        case 'ja':
          return `補数法：${a_tens}×${b_tens}+${a_units}=${left}、${a_units}²=${right.toString().padStart(2, '0')} → ${left}${right.toString().padStart(2, '0')}`;
        default:
          return `首位互补法：${a_tens}×${b_tens}+${a_units}=${left}，${a_units}²=${right.toString().padStart(2, '0')} → ${left}${right.toString().padStart(2, '0')}`;
      }
    }
  }
  
  // 3. 平方数快速计算
  if (a === b) {
    if (a >= 10 && a <= 99) {
      const tens = Math.floor(a / 10);
      const units = a % 10;
      
      switch (locale) {
        case 'zh':
          return `平方技巧：(${tens}0+${units})² = ${tens}0²+2×${tens}0×${units}+${units}² = ${tens*tens*100}+${2*tens*10*units}+${units*units} = ${a*a}`;
        case 'en':
          return `Square trick: (${tens}0+${units})² = ${tens}0²+2×${tens}0×${units}+${units}² = ${a*a}`;
        case 'de':
          return `Quadrat-Trick: (${tens}0+${units})² = ${tens}0²+2×${tens}0×${units}+${units}² = ${a*a}`;
        case 'ja':
          return `平方の技巧：(${tens}0+${units})² = ${tens}0²+2×${tens}0×${units}+${units}² = ${a*a}`;
        default:
          return `平方技巧：(${tens}0+${units})² = ${tens}0²+2×${tens}0×${units}+${units}² = ${a*a}`;
      }
    }
  }
  
  // 4. 接近整十数的计算
  if ((a % 10 === 0 || b % 10 === 0) && (a > 10 || b > 10)) {
    switch (locale) {
      case 'zh':
        return `整十数技巧：先算整十部分，再调整个位数的影响`;
      case 'en':
        return `Round number trick: Calculate tens first, then adjust for units`;
      case 'de':
        return `Runde Zahl: Zuerst Zehner rechnen, dann Einer anpassen`;
      case 'ja':
        return `整十の技巧：まず十の位を計算し、一の位を調整`;
      default:
        return `整十数技巧：先算整十部分，再调整个位数的影响`;
    }
  }
  
  // 5. 对半翻倍法（适用于偶数）
  if (a % 2 === 0 || b % 2 === 0) {
    const even = a % 2 === 0 ? a : b;
    const other = a % 2 === 0 ? b : a;
    
    switch (locale) {
      case 'zh':
        return `对半翻倍法：${even}÷2×${other}×2 = ${even/2}×${other*2}`;
      case 'en':
        return `Half-double method: ${even}÷2×${other}×2 = ${even/2}×${other*2}`;
      case 'de':
        return `Halbieren-Verdoppeln: ${even}÷2×${other}×2 = ${even/2}×${other*2}`;
      case 'ja':
        return `半分倍増法：${even}÷2×${other}×2 = ${even/2}×${other*2}`;
      default:
        return `对半翻倍法：${even}÷2×${other}×2 = ${even/2}×${other*2}`;
    }
  }
  
  // 6. 通用拆分法（降低阈值以覆盖更多情况）
  const smaller = Math.min(a, b);
  const larger = Math.max(a, b);
  
  if (smaller >= 12) { // 降低阈值从20到12
    const tens = Math.floor(smaller / 10) * 10;
    const units = smaller % 10;
    
    switch (locale) {
      case 'zh':
        return `拆分法：${smaller}×${larger} = (${tens}+${units})×${larger} = ${tens}×${larger}+${units}×${larger}`;
      case 'en':
        return `Split method: ${smaller}×${larger} = (${tens}+${units})×${larger} = ${tens}×${larger}+${units}×${larger}`;
      case 'de':
        return `Aufteilen: ${smaller}×${larger} = (${tens}+${units})×${larger} = ${tens}×${larger}+${units}×${larger}`;
      case 'ja':
        return `分解法：${smaller}×${larger} = (${tens}+${units})×${larger} = ${tens}×${larger}+${units}×${larger}`;
      default:
        return `拆分法：${smaller}×${larger} = (${tens}+${units})×${larger} = ${tens}×${larger}+${units}×${larger}`;
    }
  }
  
  return null;
} 