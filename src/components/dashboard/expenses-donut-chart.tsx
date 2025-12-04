'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/src/components/ui';
import { formatCurrency, formatPercentage } from '@/src/lib/formatters';
import { CATEGORY_LABELS } from '@/src/lib/constants';
import { cn } from '@/src/lib/utils';
import type { CategoryBreakdown, TransactionCategory } from '@/src/types';

// ============================================
// Types
// ============================================

interface ExpensesDonutChartProps {
  data: CategoryBreakdown[];
  isLoading?: boolean;
}

// ============================================
// Custom Tooltip Component
// ============================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CategoryBreakdown;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-medium text-[var(--foreground-muted)]">
        {CATEGORY_LABELS[data.category]}
      </p>
      <p className="font-mono text-lg font-bold text-[var(--foreground)]">
        {formatCurrency(data.amount)}
      </p>
      <p className="text-sm text-[var(--foreground-muted)]">
        {formatPercentage(data.percentage, { showSign: false })} of total
      </p>
    </div>
  );
}

// ============================================
// Legend Item Component
// ============================================

interface LegendItemProps {
  category: TransactionCategory;
  color: string;
  amount: number;
  percentage: number;
}

function LegendItem({ category, color, amount, percentage }: LegendItemProps) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-[var(--foreground)]">
          {CATEGORY_LABELS[category]}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-[var(--foreground-muted)]">
          {formatPercentage(percentage, { showSign: false })}
        </span>
      </div>
    </div>
  );
}

// ============================================
// Skeleton Loading State
// ============================================

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
          <div className="flex-1 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Expenses Donut Chart Component
// ============================================

export function ExpensesDonutChart({ data, isLoading }: ExpensesDonutChartProps) {
  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Take top 6 categories for display
  const displayData = data.slice(0, 6);
  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);

  // Transform data for Recharts compatibility
  const chartData = displayData.map((item) => ({
    name: item.category,
    value: item.amount,
    category: item.category,
    percentage: item.percentage,
    color: item.color,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Donut Chart */}
          <div className="relative mx-auto h-[200px] w-[200px] lg:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const item = payload[0].payload as (typeof chartData)[number];
                    return (
                      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]/95 px-4 py-3 shadow-xl backdrop-blur-sm">
                        <p className="text-sm font-medium text-[var(--foreground-muted)]">
                          {CATEGORY_LABELS[item.category]}
                        </p>
                        <p className="font-mono text-lg font-bold text-[var(--foreground)]">
                          {formatCurrency(item.value)}
                        </p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {formatPercentage(item.percentage, { showSign: false })} of total
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-[var(--foreground-muted)]">Total</span>
              <span className="font-mono text-lg font-bold text-[var(--foreground)]">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1">
            {displayData.map((item) => (
              <LegendItem
                key={item.category}
                category={item.category}
                color={item.color}
                amount={item.amount}
                percentage={item.percentage}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
