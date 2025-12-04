'use client';

import * as React from 'react';
import { Moon, Sun, Search, Bell } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button, Input } from '@/src/components/ui';
import { useDashboardStore } from '@/src/hooks/use-dashboard-store';

// ============================================
// Theme Toggle Component
// ============================================

function ThemeToggle() {
  const { theme, setTheme } = useDashboardStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-zinc-400 hover:text-zinc-100"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

// ============================================
// Search Bar Component
// ============================================

function SearchBar() {
  const { globalSearch, setGlobalSearch } = useDashboardStore();

  return (
    <div className="relative max-w-md flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
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
  const { sidebarCollapsed } = useDashboardStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 backdrop-blur-xl transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-56',
        className
      )}
    >
      {/* Search */}
      <SearchBar />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-zinc-400 hover:text-zinc-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-500" />
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
