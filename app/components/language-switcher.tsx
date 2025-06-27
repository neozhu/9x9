"use client";

import { Globe } from 'lucide-react';
import { locales, languageConfig, type Locale } from '@/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ currentLocale, onLocaleChange }: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 px-3 gap-2 text-muted-foreground hover:text-foreground",
            "transition-all duration-200 hover:bg-accent/50",
            "backdrop-blur supports-[backdrop-filter]:bg-background/50"
          )}
          aria-label="切换语言"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">
            {languageConfig[currentLocale].name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "min-w-[140px] bg-background/95 backdrop-blur",
          "supports-[backdrop-filter]:bg-background/80",
          "border border-border/50 shadow-xl"
        )}
      >
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => onLocaleChange(locale)}
            className={cn(
              "cursor-pointer transition-all duration-200",
              "focus:bg-accent/50 hover:bg-accent/50",
              locale === currentLocale && "bg-accent text-accent-foreground font-medium"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span>{languageConfig[locale].name}</span>
              {locale === currentLocale && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 