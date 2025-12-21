import { createContext, useContext, ReactNode } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

interface ThemeContextType {
  colorMode: 'light' | 'dark';
  toggleColorMode: () => void;
  isDarkMode: boolean;
  isLightMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { colorMode, setColorMode } = useColorMode();

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    colorMode,
    toggleColorMode,
    isDarkMode: colorMode === 'dark',
    isLightMode: colorMode === 'light',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};