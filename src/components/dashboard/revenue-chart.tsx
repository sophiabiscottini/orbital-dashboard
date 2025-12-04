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
    <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-medium text-zinc-400">{data.payload.label}</p>
      <p className="font-mono text-lg font-bold text-zinc-100">
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
  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />

              {/* Axes */}
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 12 }}
                tickFormatter={(value) => formatCompactCurrency(value)}
                dx={-10}
              />

              {/* Tooltip */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: '#a855f7',
                  strokeWidth: 1,
                  strokeDasharray: '5 5',
                }}
              />

              {/* Area */}
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#a855f7"
                strokeWidth={CHART_CONFIG.strokeWidth}
                fill="url(#balanceGradient)"
                dot={false}
                activeDot={{
                  r: CHART_CONFIG.activeDotRadius,
                  fill: '#a855f7',
                  strokeWidth: 2,
                  stroke: '#18181b',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
