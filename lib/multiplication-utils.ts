import { chineseNumbers } from './constants';
import type { Question, UserProgress, WrongQuestion } from './types';

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

// 语音朗读函数
export function speakFormula(multiplicand: number, multiplier: number, speechEnabled: boolean, speechSupported: boolean) {
  if (!speechEnabled || !speechSupported) return;
  
  speechSynthesis.cancel();
  
  const result = multiplicand * multiplier;
  const formula = getChineseFormula(multiplicand, multiplier, result);
  
  const utterance = new SpeechSynthesisUtterance(formula);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.8;
  utterance.pitch = 1.1;
  utterance.volume = 0.8;
  
  speechSynthesis.speak(utterance);
} 