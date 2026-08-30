import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';
export type ThemeMode = 'light' | 'dark';

interface ThemeLanguageContextType {
  language: Language;
  direction: Direction;
  theme: ThemeMode;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  t: (arText: string, enText: string) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language State
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ats_app_lang');
    return (saved as Language) || 'ar';
  });

  // Theme State (Light vs Dark)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ats_app_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  // Apply Language & Direction
  useEffect(() => {
    localStorage.setItem('ats_app_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    if (language === 'ar') {
      document.body.classList.add('font-cairo');
      document.body.classList.remove('font-outfit');
    } else {
      document.body.classList.add('font-outfit');
      document.body.classList.remove('font-cairo');
    }
  }, [language, direction]);

  // Apply Theme to both html and body
  useEffect(() => {
    localStorage.setItem('ats_app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = (arText: string, enText: string): string => {
    return language === 'ar' ? arText : enText;
  };

  return (
    <ThemeLanguageContext.Provider
      value={{
        language,
        direction,
        theme,
        setLanguage,
        toggleLanguage,
        setTheme,
        toggleTheme,
        t,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
