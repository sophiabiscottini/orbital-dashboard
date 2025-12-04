import type { TransactionCategory } from '@/src/types';

// ============================================
// Theme Colors (Orbital Design System) ,-,
// ============================================

export const THEME_COLORS = {
  // Primary palette - Purple/Violet futuristic
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  // Accent - Neon Blue
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Success - Green
  success: '#22c55e',
  // Error - Red
  error: '#ef4444',
  // Warning - Amber
  warning: '#f59e0b',
} as const;

// ============================================
// Category Colors (for charts)
// ============================================

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  salary: '#22c55e',
  freelance: '#10b981',
  investments: '#14b8a6',
  food: '#f97316',
  transport: '#3b82f6',
  entertainment: '#a855f7',
  shopping: '#ec4899',
  utilities: '#6366f1',
  healthcare: '#ef4444',
  education: '#8b5cf6',
  travel: '#06b6d4',
  subscription: '#f59e0b',
  other: '#6b7280',
} as const;

// ============================================
// Category Labels
// ============================================

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  investments: 'Investments',
  food: 'Food & Dining',
  transport: 'Transport',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  utilities: 'Utilities',
  healthcare: 'Healthcare',
  education: 'Education',
  travel: 'Travel',
  subscription: 'Subscriptions',
  other: 'Other',
} as const;

// ============================================
// Chart Configuration
// ============================================

export const CHART_CONFIG = {
  animationDuration: 300,
  strokeWidth: 2,
  dotRadius: 4,
  activeDotRadius: 6,
} as const;

// ============================================
// Table Configuration
// ============================================

export const TABLE_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50] as const,
} as const;

// ============================================
// Sidebar Navigation
// ============================================

export const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { id: 'transactions', label: 'Transactions', href: '/transactions', icon: 'ArrowLeftRight' },
  { id: 'settings', label: 'Settings', href: '/settings', icon: 'Settings' },
] as const;

export type SidebarItemId = (typeof SIDEBAR_ITEMS)[number]['id'];
