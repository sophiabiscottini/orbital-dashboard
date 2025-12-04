import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ============================================
// Currency Formatting
// ============================================

export interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  notation?: 'standard' | 'compact';
}

const DEFAULT_CURRENCY_OPTIONS: CurrencyFormatOptions = {
  locale: 'en-US',
  currency: 'USD',
  notation: 'standard',
};

/**
 * Format a number as currency
 */
export function formatCurrency(
  value: number,
  options: CurrencyFormatOptions = {}
): string {
  const { locale, currency, notation } = {
    ...DEFAULT_CURRENCY_OPTIONS,
    ...options,
  };

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as a compact currency (e.g., $24.3K)
 */
export function formatCompactCurrency(
  value: number,
  options: Omit<CurrencyFormatOptions, 'notation'> = {}
): string {
  return formatCurrency(value, { ...options, notation: 'compact' });
}

// ============================================
// Percentage Formatting
// ============================================

/**
 * Format a number as a percentage
 */
export function formatPercentage(
  value: number,
  options: { showSign?: boolean; decimals?: number } = {}
): string {
  const { showSign = true, decimals = 1 } = options;
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

// ============================================
// Date Formatting
// ============================================

/**
 * Format an ISO date string to a readable format
 */
export function formatDate(
  isoString: string,
  formatStr: string = 'MMM d, yyyy'
): string {
  return format(parseISO(isoString), formatStr);
}

/**
 * Format an ISO date string to a short format (e.g., "Jan 15")
 */
export function formatShortDate(isoString: string): string {
  return format(parseISO(isoString), 'MMM d');
}

/**
 * Format an ISO date string to a long format (e.g., "January 15, 2024")
 */
export function formatLongDate(isoString: string): string {
  return format(parseISO(isoString), 'MMMM d, yyyy');
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(isoString: string): string {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
}

/**
 * Format a date for chart axis labels (e.g., "Jan")
 */
export function formatChartMonth(isoString: string): string {
  return format(parseISO(isoString), 'MMM');
}

// ============================================
// Number Formatting
// ============================================

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a number as compact (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
