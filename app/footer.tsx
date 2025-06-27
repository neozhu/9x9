"use client"

import { Calculator, Target, Sparkles, Moon } from 'lucide-react';
import { useLocale } from './hooks/use-locale';

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="w-full border-t border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 text-center">
            <Calculator className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{t('footer.appName')}</p>
              <p className="text-xs text-muted-foreground">{t('footer.tagline')}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-muted-foreground">
            <div className="flex space-x-4">
              <span className="flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>{t('footer.focusedLearning')}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>{t('footer.interactiveExperience')}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Moon className="w-3 h-3" />
                <span>{t('footer.eyeProtection')}</span>
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <a
              href="https://github.com/neozhu/9x9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-xs text-primary hover:underline transition-colors"
            >
              GitHub: @neozhu/9x9
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 