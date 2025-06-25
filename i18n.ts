// 支持的语言列表
export const locales = ['zh', 'en', 'de', 'ja'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'zh';

// 语言配置信息
export const languageConfig = {
  zh: {
    name: '中文',
    direction: 'ltr' as const,
    voice: 'zh-CN'
  },
  en: {
    name: 'English',
    direction: 'ltr' as const,
    voice: 'en-US'
  },
  de: {
    name: 'Deutsch',
    direction: 'ltr' as const,
    voice: 'de-DE'
  },
  ja: {
    name: '日本語',
    direction: 'ltr' as const,
    voice: 'ja-JP'
  }
} as const; 