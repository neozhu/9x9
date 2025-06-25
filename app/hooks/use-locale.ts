"use client";

import { useState, useEffect } from 'react';
import { defaultLocale, type Locale } from '@/i18n';

const LOCALE_STORAGE_KEY = 'preferred-locale';

// 全局语言状态
let globalLocale: Locale = defaultLocale;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalMessages: any = null;
let globalIsLoading = true;
const listeners = new Set<() => void>();

// 添加监听器
const addListener = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// 通知所有监听器
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// 加载语言包
const loadMessages = async (targetLocale: Locale) => {
  try {
    globalIsLoading = true;
    notifyListeners();
    
    const messagesModule = await import(`../../messages/${targetLocale}.json`);
    globalMessages = messagesModule.default;
    globalLocale = targetLocale;
  } catch (error) {
    console.error(`Failed to load messages for locale ${targetLocale}:`, error);
    // 如果加载失败，尝试加载默认语言
    if (targetLocale !== defaultLocale) {
      const fallbackModule = await import(`../../messages/${defaultLocale}.json`);
      globalMessages = fallbackModule.default;
      globalLocale = defaultLocale;
    }
  } finally {
    globalIsLoading = false;
    notifyListeners();
  }
};

// 切换语言
const changeLocale = (newLocale: Locale) => {
  localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  loadMessages(newLocale);
};

// 获取翻译文本的函数
const getTranslation = (key: string, params?: Record<string, string | number>) => {
  if (!globalMessages) return key;

  const keys = key.split('.');
  let value = globalMessages;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // 如果找不到对应的键，返回原键名
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // 处理参数替换
  if (params) {
    return Object.entries(params).reduce((text, [param, val]) => {
      return text.replace(new RegExp(`{${param}}`, 'g'), String(val));
    }, value);
  }

  return value;
};

export function useLocale() {
  const [, forceUpdate] = useState({});

  // 强制组件重新渲染
  const triggerUpdate = () => forceUpdate({});

  useEffect(() => {
    // 初始化语言设置
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
    const initialLocale = savedLocale && ['zh', 'en', 'de', 'ja'].includes(savedLocale) 
      ? savedLocale 
      : defaultLocale;
    
    if (!globalMessages) {
      loadMessages(initialLocale);
    }

    // 添加监听器
    const removeListener = addListener(triggerUpdate);
    
    return () => {
      removeListener();
    };
  }, []);

  return {
    locale: globalLocale,
    messages: globalMessages,
    isLoading: globalIsLoading,
    changeLocale,
    t: getTranslation
  };
} 