"use client";

import { useEffect } from 'react';
import { useLocale } from '../hooks/use-locale';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { locale } = useLocale();

  useEffect(() => {
    // 更新document的lang属性
    if (typeof document !== 'undefined') {
      const langMap = {
        'zh': 'zh-CN',
        'en': 'en-US', 
        'de': 'de-DE',
        'ja': 'ja-JP'
      };
      document.documentElement.lang = langMap[locale] || 'zh-CN';
    }
  }, [locale]);

  return <>{children}</>;
} 