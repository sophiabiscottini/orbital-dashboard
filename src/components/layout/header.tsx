'use client';

import * as React from 'react';
import { Moon, Sun, Monitor, Search, Bell, Check, Menu } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/src/components/ui';
import { useDashboardStore } from '@/src/hooks/use-dashboard-store';
import { useTheme } from '@/src/components/providers';
import type { Theme } from '@/src/types';

// ============================================
// Theme Options Configuration
// ============================================

const THEME_OPTIONS: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
];

// ============================================
// Theme Toggle Component
// ============================================

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Get current icon based on resolved theme :O
  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          aria-label="Select theme"
        >
          <CurrentIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEME_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
            {theme === option.value && (
              <Check className="h-4 w-4 text-[var(--primary)]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// Search Bar Component
// ============================================

function SearchBar() {
  const { globalSearch, setGlobalSearch } = useDashboardStore();

  return (
    <div className="relative max-w-md flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
      <Input
        type="search"
        placeholder="Search transactions, categories..."
        value={globalSearch}
        onChange={(e) => setGlobalSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}

// ============================================
// Header Component
// ============================================

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useDashboardStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur-xl transition-all duration-300 md:px-6',
        // Desktop: margin based on sidebar state
        // Mobile: no margin (sidebar is overlay)
        'ml-0',
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-56',
        className
      )}
    >
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <SearchBar />

      {/* Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--primary)]" />
        </Button>
        <ThemeToggle />
        
        {/* User Avatar */}
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
          <span className="text-xs font-medium text-white">SB</span>
        </div>
      </div>
    </header>
  );
}
