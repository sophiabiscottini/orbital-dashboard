'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  BarChart3,
  ArrowLeftRight,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui';
import { SIDEBAR_ITEMS } from '@/src/lib/constants';
import { useDashboardStore } from '@/src/hooks/use-dashboard-store';
import type { SidebarItemId } from '@/src/lib/constants';

// ============================================
// Icon Mapping
// ============================================

const ICON_MAP = {
  LayoutDashboard,
  BarChart3,
  ArrowLeftRight,
  Settings,
} as const;

type IconName = keyof typeof ICON_MAP;

// ============================================
// Sidebar Item Component
// ============================================

interface SidebarItemProps {
  id: SidebarItemId;
  label: string;
  href: string;
  icon: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

function SidebarItem({
  id,
  label,
  href,
  icon,
  isActive,
  isCollapsed,
  onClick,
}: SidebarItemProps) {
  const Icon = ICON_MAP[icon as IconName];

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:bg-[var(--primary-muted)] hover:text-[var(--primary)]',
        isActive
          ? 'bg-[var(--primary-muted)] text-[var(--primary)] shadow-sm'
          : 'text-[var(--foreground-muted)]',
        // Only collapse on desktop (md+), never on mobile
        isCollapsed && 'md:justify-center md:px-2'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {/* Always show label on mobile, hide on desktop when collapsed */}
      <span className={cn(isCollapsed && 'md:hidden')}>{label}</span>
    </Link>
  );
}

// ============================================
// Sidebar Component
// ============================================

export function Sidebar() {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    activeNavItem, 
    setActiveNavItem,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useDashboardStore();

  // Close mobile menu on navigation
  const handleNavClick = (id: SidebarItemId) => {
    setActiveNavItem(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[var(--border)] bg-[var(--background)] transition-all duration-300',
          // Desktop: normal behavior
          'md:z-40 md:bg-[var(--background)]/95 md:backdrop-blur-xl',
          // Mobile: slide in/out with fixed width
          mobileMenuOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0',
          // Desktop: width based on collapsed state
          sidebarCollapsed ? 'md:w-16' : 'md:w-56'
        )}
      >
        {/* Logo & Mobile Close */}
        <div
          className={cn(
            'flex h-16 items-center justify-between border-b border-[var(--border)] px-4',
            sidebarCollapsed && 'md:justify-center md:px-2'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
              <span className="text-sm font-bold text-white">O</span>
            </div>
            {/* Always show on mobile, hide on desktop when collapsed */}
            <span className={cn(
              'text-lg font-semibold text-[var(--foreground)]',
              sidebarCollapsed && 'md:hidden'
            )}>
              Orbital
            </span>
          </div>
          
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--foreground-muted)] md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              id={item.id}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isActive={activeNavItem === item.id}
              isCollapsed={sidebarCollapsed}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </nav>

        {/* Collapse Toggle - Desktop Only, Okay */}
        <div className="hidden border-t border-[var(--border)] p-3 md:block">
          <Button
            variant="ghost"
            size={sidebarCollapsed ? 'icon' : 'default'}
            onClick={toggleSidebar}
            className={cn(
              'w-full justify-center text-[var(--foreground-muted)]',
              !sidebarCollapsed && 'justify-start gap-3'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
