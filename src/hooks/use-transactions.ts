'use client';

import * as React from 'react';
import type { Transaction, DateRange, CategoryBreakdown, DashboardMetrics, BalancePoint } from '@/src/types';
import {
  MOCK_TRANSACTIONS,
  MOCK_METRICS,
  MOCK_BALANCE_EVOLUTION,
  MOCK_CATEGORY_BREAKDOWN,
  calculateDashboardMetrics,
  calculateCategoryBreakdown,
} from '@/src/data/mock-data';
import { useDashboardStore } from './use-dashboard-store';
import { isWithinInterval } from 'date-fns';

// ============================================
// Types
// ============================================

interface UseTransactionsReturn {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  metrics: DashboardMetrics;
  balanceEvolution: BalancePoint[];
  categoryBreakdown: CategoryBreakdown[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// ============================================
// Hook Implementation
// ============================================

export function useTransactions(): UseTransactionsReturn {
  const { dateRange, globalSearch } = useDashboardStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter transactions based on date range and search
  const filteredTransactions = React.useMemo(() => {
    const combinedSearch = globalSearch || searchTerm;

    return MOCK_TRANSACTIONS.filter((transaction) => {
      // Date range filter
      const transactionDate = new Date(transaction.date);
      const isInDateRange = isWithinInterval(transactionDate, {
        start: dateRange.from,
        end: dateRange.to,
      });

      // Search filter
      const matchesSearch =
        !combinedSearch ||
        transaction.description.toLowerCase().includes(combinedSearch.toLowerCase()) ||
        transaction.merchant.name.toLowerCase().includes(combinedSearch.toLowerCase()) ||
        transaction.category.toLowerCase().includes(combinedSearch.toLowerCase());

      return isInDateRange && matchesSearch;
    });
  }, [dateRange, globalSearch, searchTerm]);

  // Recalculate metrics based on filtered transactions
  const metrics = React.useMemo(
    () => calculateDashboardMetrics(filteredTransactions),
    [filteredTransactions]
  );

  // Recalculate category breakdown based on filtered transactions
  const categoryBreakdown = React.useMemo(
    () => calculateCategoryBreakdown(filteredTransactions),
    [filteredTransactions]
  );

  return {
    transactions: MOCK_TRANSACTIONS,
    filteredTransactions,
    metrics,
    balanceEvolution: MOCK_BALANCE_EVOLUTION,
    categoryBreakdown,
    isLoading,
    searchTerm,
    setSearchTerm,
  };
}
