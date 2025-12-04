'use client';

import * as React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  PiggyBank,
} from 'lucide-react';
import { Card, CardContent, Skeleton } from '@/src/components/ui';
import { cn } from '@/src/lib/utils';
import { formatCurrency, formatPercentage } from '@/src/lib/formatters';
import type { DashboardMetrics } from '@/src/types';

// ============================================
// Types
// ============================================

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'income' | 'expense' | 'savings';
}

interface StatsCardsProps {
  metrics: DashboardMetrics;
  isLoading?: boolean;
}

// ============================================
// Stat Card Component
// ============================================

function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend = 'neutral',
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'from-purple-500/10 to-transparent',
    income: 'from-emerald-500/10 to-transparent',
    expense: 'from-red-500/10 to-transparent',
    savings: 'from-blue-500/10 to-transparent',
  };

  const iconStyles = {
    default: 'bg-purple-500/20 text-purple-400',
    income: 'bg-emerald-500/20 text-emerald-400',
    expense: 'bg-red-500/20 text-red-400',
    savings: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <Card className={cn('relative overflow-hidden bg-gradient-to-br', variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--foreground-muted)]">{title}</p>
            <p className="font-mono text-3xl font-bold text-[var(--foreground)]">{value}</p>

            {change !== undefined && (
              <div className="flex items-center gap-1.5">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                ) : null}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend === 'up' && 'text-emerald-400',
                    trend === 'down' && 'text-red-400',
                    trend === 'neutral' && 'text-[var(--foreground-muted)]'
                  )}
                >
                  {formatPercentage(change)}
                </span>
                {changeLabel && (
                  <span className="text-sm text-[var(--foreground-muted)]">{changeLabel}</span>
                )}
              </div>
            )}
          </div>

          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              iconStyles[variant]
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Skeleton Loading State
// ============================================

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Stats Cards Component
// ============================================

export function StatsCards({ metrics, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Only show change percentages when the base value is meaningful
  const hasBalance = metrics.totalBalance > 0;
  const hasIncome = metrics.monthlyIncome > 0;
  const hasExpenses = metrics.monthlyExpenses > 0;
  const hasSavings = metrics.savingsRatePercent > 0;

  const cards: StatCardProps[] = [
    {
      title: 'Total Balance',
      value: formatCurrency(metrics.totalBalance),
      change: hasBalance ? 3.2 : undefined,
      changeLabel: hasBalance ? 'from last month' : undefined,
      icon: <Wallet className="h-6 w-6" />,
      trend: hasBalance ? 'up' : 'neutral',
      variant: 'default',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(metrics.monthlyIncome),
      change: hasIncome ? 8.4 : undefined,
      changeLabel: hasIncome ? 'from last month' : undefined,
      icon: <ArrowDownToLine className="h-6 w-6" />,
      trend: hasIncome ? 'up' : 'neutral',
      variant: 'income',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(metrics.monthlyExpenses),
      change: hasExpenses ? -2.1 : undefined,
      changeLabel: hasExpenses ? 'from last month' : undefined,
      icon: <ArrowUpFromLine className="h-6 w-6" />,
      trend: hasExpenses ? 'down' : 'neutral',
      variant: 'expense',
    },
    {
      title: 'Savings Rate',
      value: formatPercentage(metrics.savingsRatePercent, { showSign: false }),
      change: hasSavings ? 5.2 : undefined,
      changeLabel: hasSavings ? 'improvement' : undefined,
      icon: <PiggyBank className="h-6 w-6" />,
      trend: hasSavings ? 'up' : 'neutral',
      variant: 'savings',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
