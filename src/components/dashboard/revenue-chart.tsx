'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/src/components/ui';
import { formatCompactCurrency, formatCurrency } from '@/src/lib/formatters';
import { CHART_CONFIG } from '@/src/lib/constants';
import { useThemeColors } from '@/src/hooks/use-theme-colors';
import type { BalancePoint } from '@/src/types';

// ============================================
// Types
// ============================================

interface RevenueChartProps {
  data: BalancePoint[];
  isLoading?: boolean;
}

// ============================================
// Custom Tooltip Component
// ============================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: BalancePoint;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0];

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-medium text-[var(--foreground-muted)]">{data.payload.label}</p>
      <p className="font-mono text-lg font-bold text-[var(--foreground)]">
        {formatCurrency(data.value)}
      </p>
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
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

// ============================================
// Revenue Chart Component
// ============================================

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const themeColors = useThemeColors();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full select-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.border}
                vertical={false}
              />

              {/* Axes */}
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: themeColors.foregroundMuted, fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: themeColors.foregroundMuted, fontSize: 12 }}
                tickFormatter={(value) => formatCompactCurrency(value)}
                width={55}
              />

              {/* Tooltip */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
              />

              {/* Area */}
              <Area
                type="monotone"
                dataKey="balance"
                stroke={themeColors.primary}
                strokeWidth={CHART_CONFIG.strokeWidth}
                fill="url(#balanceGradient)"
                dot={false}
                activeDot={{
                  r: CHART_CONFIG.activeDotRadius,
                  fill: themeColors.primary,
                  strokeWidth: 2,
                  stroke: themeColors.background,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
