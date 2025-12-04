'use client';

import * as React from 'react';
import { Sidebar, Header, PageContainer } from '@/src/components/layout';
import {
  StatsCards,
  RevenueChart,
  ExpensesDonutChart,
  TransactionsTable,
} from '@/src/components/dashboard';
import { useTransactions } from '@/src/hooks';
import { TooltipProvider } from '@/src/components/ui';

// ============================================
// Dashboard Page Component
// ============================================

export default function DashboardPage() {
  const {
    filteredTransactions,
    metrics,
    balanceEvolution,
    categoryBreakdown,
    isLoading,
  } = useTransactions();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-zinc-950">
        <Sidebar />
        <Header />
        <PageContainer
          title="Dashboard"
          description="Welcome back! Here's an overview of your finances."
        >
          <div className="space-y-6">
            {/* Stats Cards Row */}
            <section aria-label="Financial metrics">
              <StatsCards metrics={metrics} isLoading={isLoading} />
            </section>

            {/* Charts Row */}
            <section className="grid gap-6 lg:grid-cols-2" aria-label="Charts">
              <RevenueChart data={balanceEvolution} isLoading={isLoading} />
              <ExpensesDonutChart data={categoryBreakdown} isLoading={isLoading} />
            </section>

            {/* Transactions Table */}
            <section aria-label="Recent transactions">
              <TransactionsTable
                data={filteredTransactions}
                isLoading={isLoading}
              />
            </section>
          </div>
        </PageContainer>
      </div>
    </TooltipProvider>
  );
}
