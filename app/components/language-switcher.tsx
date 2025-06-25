"use client";

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { locales, languageConfig, type Locale } from '@/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ currentLocale, onLocaleChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    onLocaleChange(locale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-accent text-muted-foreground hover:text-foreground"
        aria-label="切换语言"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{languageConfig[currentLocale].name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${
                locale === currentLocale ? 'bg-accent text-accent-foreground' : 'text-foreground'
              }`}
            >
              {languageConfig[locale].name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 