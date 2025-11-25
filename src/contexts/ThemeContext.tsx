// ThemeContext.tsx – provides theme state and hook
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the possible theme values
export type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the context with a default (will be overridden by provider)
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialise theme from localStorage or default to 'auto'
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    return (stored as Theme) || 'auto';
  });

  // Persist theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Apply theme class to <html> element (optional, for CSS handling)
  useEffect(() => {
    const root = document.documentElement;
    const remove = () => {
      root.classList.remove('light', 'dark');
    };
    remove();
    if (theme === 'light') root.classList.add('light');
    else if (theme === 'dark') root.classList.add('dark');
    // 'auto' leaves it to CSS media queries
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

// Hook for consuming the context
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
