import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, DateRange } from '@/src/types';
import type { SidebarItemId } from '@/src/lib/constants';
import { subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

// ============================================
// Store State Interface
// ============================================

interface DashboardState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  activeNavItem: SidebarItemId;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveNavItem: (item: SidebarItemId) => void;

  // Date Range Filter
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  setPresetDateRange: (preset: 'today' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth') => void;

  // Global Search
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
}

// ============================================
// Default Values
// ============================================

const getDefaultDateRange = (): DateRange => ({
  from: startOfMonth(new Date()),
  to: new Date(),
});

// ============================================
// Store Implementation
// ============================================

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarCollapsed: false,
      activeNavItem: 'dashboard',
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setActiveNavItem: (item) => set({ activeNavItem: item }),

      // Date Range
      dateRange: getDefaultDateRange(),
      setDateRange: (range) => set({ dateRange: range }),
      setPresetDateRange: (preset) => {
        const now = new Date();
        let range: DateRange;

        switch (preset) {
          case 'today':
            range = { from: now, to: now };
            break;
          case 'last7days':
            range = { from: subDays(now, 7), to: now };
            break;
          case 'last30days':
            range = { from: subDays(now, 30), to: now };
            break;
          case 'thisMonth':
            range = { from: startOfMonth(now), to: now };
            break;
          case 'lastMonth':
            const lastMonth = subMonths(now, 1);
            range = { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
            break;
          default:
            range = getDefaultDateRange();
        }

        set({ dateRange: range });
      },

      // Global Search
      globalSearch: '',
      setGlobalSearch: (search) => set({ globalSearch: search }),
    }),
    {
      name: 'orbital-dashboard-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
