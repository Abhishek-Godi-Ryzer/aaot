import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light';
  primaryColor: string;
  backgroundColor: string;
  cardShadow: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Directives mandate light theme only
  const [theme] = useState<'light'>('light');

  const value: ThemeContextType = {
    theme,
    primaryColor: 'indigo-600',
    backgroundColor: 'bg-[#f8fafc]',
    cardShadow: 'shadow-sm border border-slate-100 rounded-3xl bg-white'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
