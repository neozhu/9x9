"use client";

import { useEffect } from 'react';
import { useLocale } from '../hooks/use-locale';
import type { Locale } from '@/i18n';

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Language code mapping for HTML lang attribute
const langMap: Record<Locale, string> = {
  'zh': 'zh-CN',
  'en': 'en-US', 
  'de': 'de-DE',
  'ja': 'ja-JP'
} as const;

export function ClientLayout({ children }: ClientLayoutProps) {
  const { locale } = useLocale();

  useEffect(() => {
    // Update document lang attribute for accessibility and SEO
    if (typeof document !== 'undefined') {
      const htmlLang = langMap[locale] || 'zh-CN';
      document.documentElement.lang = htmlLang;
      
      // Optional: Update document dir attribute for RTL languages
      // Currently all supported languages are LTR
      document.documentElement.dir = 'ltr';
    }
  }, [locale]);

  return <>{children}</>;
} 