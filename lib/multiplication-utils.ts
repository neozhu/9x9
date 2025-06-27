import { chineseNumbers } from './constants';
import type { Question, WrongQuestion } from './types';

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

// 生成答案选项
export function generateAnswerOptions(correctAnswer: number): number[] {
  const options = [correctAnswer];
  const usedNumbers = new Set([correctAnswer]);
  
  // 生成2个干扰项
  while (options.length < 3) {
    let wrongAnswer;
    // 生成合理的错误答案
    const random = Math.random();
    if (random < 0.3) {
      // 相邻的数字
      wrongAnswer = correctAnswer + (Math.random() < 0.5 ? 1 : -1);
    } else if (random < 0.6) {
      // 其他乘法表中的数字
      wrongAnswer = Math.floor(Math.random() * 81) + 1;
    } else {
      // 完全随机但合理的数字
      wrongAnswer = Math.floor(Math.random() * 20) + 1;
    }
    
    if (wrongAnswer > 0 && wrongAnswer <= 81 && !usedNumbers.has(wrongAnswer)) {
      options.push(wrongAnswer);
      usedNumbers.add(wrongAnswer);
    }
  }
  
  // 随机排序
  return options.sort(() => Math.random() - 0.5);
}

// 生成随机题目
export function generateRandomQuestion(): Question {
  const multiplicand = Math.floor(Math.random() * 9) + 1;
  const multiplier = Math.floor(Math.random() * 9) + 1;
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
    // 不设置 rate/pitch/volume
    utterance.onstart = () => console.log('[speakFormula] speech start');
    utterance.onerror = (e) => console.error('[speakFormula] speech error', e);
    utterance.onend = () => console.log('[speakFormula] speech end');
    speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('[speakFormula] exception', err);
<<<<<<< HEAD
    
         // iOS备用方案：如果语音合成失败，尝试创建一个简单的音频提示
     if (isIOS || isSafari) {
       try {
         // 创建一个短暂的音频上下文来"唤醒"语音合成
         const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
         const audioContext = new AudioContextConstructor();
         const oscillator = audioContext.createOscillator();
         const gainNode = audioContext.createGain();
         
         oscillator.connect(gainNode);
         gainNode.connect(audioContext.destination);
         
         oscillator.frequency.value = 0; // 静音
         gainNode.gain.value = 0;
         
         oscillator.start();
         oscillator.stop(audioContext.currentTime + 0.01);
         
         // 延迟后再次尝试语音合成
         setTimeout(() => {
           const retryUtterance = new SpeechSynthesisUtterance(getFormulaByLocale(multiplicand, multiplier, multiplicand * multiplier, locale));
           const retryDefaultSettings = {
             'zh': { lang: 'zh-CN' },
             'en': { lang: 'en-US' },
             'de': { lang: 'de-DE' },
             'ja': { lang: 'ja-JP' }
           };
           const retrySettings = retryDefaultSettings[locale as keyof typeof retryDefaultSettings] || retryDefaultSettings.zh;
           retryUtterance.lang = retrySettings.lang;
           retryUtterance.rate = 0.8;
           speechSynthesis.speak(retryUtterance);
         }, 200);
       } catch (audioErr) {
         console.error('[speakFormula] iOS audio fallback failed', audioErr);
       }
     }
=======
>>>>>>> parent of c6140aa (test)
  }
} 