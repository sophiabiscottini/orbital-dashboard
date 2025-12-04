'use client';

import * as React from 'react';
import { useDashboardStore } from '@/src/hooks/use-dashboard-store';
import type { Theme } from '@/src/types';

// ============================================
// Theme Provider Context
// ============================================

interface ThemeProviderContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = React.createContext<ThemeProviderContextValue | undefined>(
  undefined
);

// ============================================
// Theme Provider Component
// ============================================

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const { theme, setTheme } = useDashboardStore();
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = React.useState(false);

  // Get system theme preference
  const getSystemTheme = React.useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Apply theme to document
  const applyTheme = React.useCallback((newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the new theme class
    root.classList.add(newTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        newTheme === 'dark' ? '#09090b' : '#ffffff'
      );
    }

    setResolvedTheme(newTheme);
  }, []);

  // Handle theme changes
  React.useEffect(() => {
    setMounted(true);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Apply initial theme
    if (theme === 'system') {
      applyTheme(getSystemTheme());
    } else {
      applyTheme(theme);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, applyTheme, getSystemTheme]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider
        value={{ theme: defaultTheme, resolvedTheme: 'dark', setTheme }}
      >
        {children}
      </ThemeProviderContext.Provider>
    );
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// ============================================
// useTheme Hook
// ============================================

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
