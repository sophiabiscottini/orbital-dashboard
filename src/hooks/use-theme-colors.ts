'use client';

import { useState, useEffect } from 'react';

interface ThemeColors {
  foreground: string;
  foregroundMuted: string;
  background: string;
  border: string;
  card: string;
  primary: string;
}

const DEFAULT_DARK_COLORS: ThemeColors = {
  foreground: '#fafafa',
  foregroundMuted: '#71717a',
  background: '#09090b',
  border: '#27272a',
  card: '#18181b',
  primary: '#a855f7',
};

function getCSSVariableValue(variable: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_DARK_COLORS);

  useEffect(() => {
    function updateColors() {
      setColors({
        foreground: getCSSVariableValue('--foreground') || DEFAULT_DARK_COLORS.foreground,
        foregroundMuted: getCSSVariableValue('--foreground-muted') || DEFAULT_DARK_COLORS.foregroundMuted,
        background: getCSSVariableValue('--background') || DEFAULT_DARK_COLORS.background,
        border: getCSSVariableValue('--border') || DEFAULT_DARK_COLORS.border,
        card: getCSSVariableValue('--card') || DEFAULT_DARK_COLORS.card,
        primary: getCSSVariableValue('--primary') || DEFAULT_DARK_COLORS.primary,
      });
    }

    updateColors();

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return colors;
}
