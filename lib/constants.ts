import type { Achievement } from './types';

// 中文数字转换
export const chineseNumbers = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

// 成就系统
export const achievements: Achievement[] = [
  { id: 'first_correct', name: '初出茅庐', description: '第一次答对题目', icon: 'Sprout' },
  { id: 'streak_5', name: '小试牛刀', description: '连续答对5题', icon: 'Flame' },
  { id: 'streak_10', name: '势如破竹', description: '连续答对10题', icon: 'Zap' },
  { id: 'streak_20', name: '一鼓作气', description: '连续答对20题', icon: 'Gem' },
  { id: 'daily_3', name: '坚持不懈', description: '连续3天练习', icon: 'Calendar' },
  { id: 'daily_7', name: '一周之星', description: '连续7天练习', icon: 'Star' },
  { id: 'accuracy_90', name: '神射手', description: '正确率达到90%', icon: 'Target' },
  { id: 'questions_100', name: '百题达人', description: '累计答题100道', icon: 'Trophy' },
  { id: 'daily_task_complete', name: '今日达人', description: '完成今日10题任务', icon: 'CheckCircle' },
]; 