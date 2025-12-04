'use client';

import * as React from 'react';
import { cn } from '@/src/lib/utils';
import { useDashboardStore } from '@/src/hooks/use-dashboard-store';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function PageContainer({
  children,
  className,
  title,
  description,
}: PageContainerProps) {
  const { sidebarCollapsed } = useDashboardStore();

  return (
    <main
      className={cn(
        'min-h-screen bg-zinc-950 transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-56'
      )}
    >
      <div className={cn('p-6', className)}>
        {/* Page Header */}
        {(title || description) && (
          <header className="mb-6">
            {title && (
              <h1 className="text-2xl font-bold text-zinc-100">{title}</h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-zinc-400">{description}</p>
            )}
          </header>
        )}

        {/* Page Content */}
        {children}
      </div>
    </main>
  );
}
