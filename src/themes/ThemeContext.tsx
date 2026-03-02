import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Theme } from './types.js';
import { berryTheme } from './berry-theme.js';
import { cyberpunkTheme } from './cyberpunk-theme.js';

const themes: Theme[] = [berryTheme, cyberpunkTheme];

interface ThemeContextValue {
  theme: Theme;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: berryTheme,
  cycleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeIndex, setThemeIndex] = useState(0);

  const cycleTheme = useCallback(() => {
    setThemeIndex((i) => (i + 1) % themes.length);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: themes[themeIndex]!, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
