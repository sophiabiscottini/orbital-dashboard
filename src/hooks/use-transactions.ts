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

  // Filter transactions by date range only (for metrics calculation)
  const dateFilteredTransactions = React.useMemo(() => {
    return MOCK_TRANSACTIONS.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return isWithinInterval(transactionDate, {
        start: dateRange.from,
        end: dateRange.to,
      });
    });
  }, [dateRange]);

  // Filter transactions based on date range AND search (for table display)
  const filteredTransactions = React.useMemo(() => {
    const combinedSearch = globalSearch || searchTerm;

    if (!combinedSearch) {
      return dateFilteredTransactions;
    }

    return dateFilteredTransactions.filter((transaction) => {
      return (
        transaction.description.toLowerCase().includes(combinedSearch.toLowerCase()) ||
        transaction.merchant.name.toLowerCase().includes(combinedSearch.toLowerCase()) ||
        transaction.category.toLowerCase().includes(combinedSearch.toLowerCase())
      );
    });
  }, [dateFilteredTransactions, globalSearch, searchTerm]);

  // Calculate metrics based on DATE-filtered transactions only (not search)
  const metrics = React.useMemo(
    () => calculateDashboardMetrics(dateFilteredTransactions),
    [dateFilteredTransactions]
  );

  // Calculate category breakdown based on DATE-filtered transactions only
  const categoryBreakdown = React.useMemo(
    () => calculateCategoryBreakdown(dateFilteredTransactions),
    [dateFilteredTransactions]
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
