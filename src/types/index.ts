// ============================================
// Transaction Types
// ============================================

export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export type TransactionCategory =
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'subscription'
  | 'other';

export interface Merchant {
  name: string;
  logoUrl?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO String
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  status: TransactionStatus;
  merchant: Merchant;
}

// ============================================
// Dashboard Metrics Types
// ============================================

export interface DashboardMetrics {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRatePercent: number;
}

export interface BalancePoint {
  date: string;
  balance: number;
  label: string;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
}

// ============================================
// Date Range Filter Types
// ============================================

export interface DateRange {
  from: Date;
  to: Date;
}

export type DateRangePreset = 
  | 'today'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom';

// ============================================
// UI State Types
// ============================================

export type Theme = 'light' | 'dark' | 'system';

export interface SidebarState {
  isCollapsed: boolean;
  activeItem: string;
}

// ============================================
// Table Types
// ============================================

export interface TablePagination {
  pageIndex: number;
  pageSize: number;
}

export interface TableSorting {
  id: string;
  desc: boolean;
}

// ============================================
// Chart Types
// ============================================

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
  expenses: number;
}
