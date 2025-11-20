import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'navin-theme';

const getSystemTheme = (): 'light' | 'dark' => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize theme from localStorage or default to auto
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored && (stored === 'light' || stored === 'dark' || stored === 'auto')) {
      return stored;
    }
    return 'auto';
  });

  // Calculate effective theme (actual theme to apply)
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    if (theme === 'auto') {
      return getSystemTheme();
    }
    return theme;
  });

  useEffect(() => {
    // Listen to system theme changes when in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Calculate effective theme
    if (theme === 'auto') {
      setEffectiveTheme(getSystemTheme());
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      setEffectiveTheme(theme);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [effectiveTheme, theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

