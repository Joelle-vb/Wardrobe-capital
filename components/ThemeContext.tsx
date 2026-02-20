import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig } from '../types';

const defaultTheme: ThemeConfig = {
  name: 'Chic',
  colors: {
    bg: '#f9fafb', // gray-50
    card: '#ffffff',
    text: '#111827', // gray-900
    muted: '#6b7280', // gray-500
    primary: '#111827', // gray-900
    secondary: '#f3f4f6', // gray-100
    accent: '#059669', // emerald-600
    accentBg: '#ecfdf5', // emerald-50
    border: '#e5e7eb', // gray-200
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Inter',
  },
};

export const themes: Record<string, ThemeConfig> = {
  chic: defaultTheme,
  modern: {
    name: 'Modern',
    colors: {
      bg: '#f8fafc', // slate-50
      card: '#ffffff',
      text: '#0f172a', // slate-900
      muted: '#64748b', // slate-500
      primary: '#2563eb', // blue-600
      secondary: '#e2e8f0', // slate-200
      accent: '#4f46e5', // indigo-600
      accentBg: '#eef2ff', // indigo-50
      border: '#cbd5e1', // slate-300
    },
    fonts: {
      heading: 'Montserrat',
      body: 'DM Sans',
    },
  },
  soft: {
    name: 'Soft',
    colors: {
      bg: '#fdf4f4', // rose-50 approx (custom)
      card: '#fff1f2', // rose-50
      text: '#881337', // rose-900
      muted: '#9f1239', // rose-800
      primary: '#be123c', // rose-700
      secondary: '#ffe4e6', // rose-100
      accent: '#db2777', // pink-600
      accentBg: '#fce7f3', // pink-100
      border: '#fecdd3', // rose-200
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Inter',
    },
  },
  dark: {
    name: 'Executive',
    colors: {
      bg: '#0f172a', // slate-900
      card: '#1e293b', // slate-800
      text: '#e2e8f0', // slate-200
      muted: '#94a3b8', // slate-400
      primary: '#38bdf8', // sky-400
      secondary: '#334155', // slate-700
      accent: '#22d3ee', // cyan-400
      accentBg: '#164e63', // cyan-900
      border: '#334155', // slate-700
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Inter',
    },
  }
};

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (key: string) => void;
  customTheme: ThemeConfig;
  updateCustomTheme: (updates: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    const { colors, fonts } = currentTheme;

    root.style.setProperty('--color-bg', colors.bg);
    root.style.setProperty('--color-card', colors.card);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-muted', colors.muted);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-bg', colors.accentBg);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--font-heading', fonts.heading);
    root.style.setProperty('--font-body', fonts.body);

  }, [currentTheme]);

  const setTheme = (key: string) => {
    if (themes[key]) {
      setCurrentTheme(themes[key]);
    }
  };

  const updateCustomTheme = (updates: any) => {
    setCurrentTheme(prev => ({
        ...prev,
        ...updates
    }));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, customTheme: currentTheme, updateCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};