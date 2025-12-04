'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Input,
  Button,
  Badge,
  Skeleton,
} from '@/src/components/ui';
import { cn } from '@/src/lib/utils';
import { formatCurrency, formatShortDate } from '@/src/lib/formatters';
import { CATEGORY_LABELS, TABLE_CONFIG } from '@/src/lib/constants';
import type { Transaction, TransactionStatus, TransactionType } from '@/src/types';

// ============================================
// Types
// ============================================

interface TransactionsTableProps {
  data: Transaction[];
  isLoading?: boolean;
}

// ============================================
// Status Badge Component
// ============================================

function StatusBadge({ status }: { status: TransactionStatus }) {
  const variants: Record<TransactionStatus, 'success' | 'warning' | 'error'> = {
    completed: 'success',
    pending: 'warning',
    failed: 'error',
  };

  const labels: Record<TransactionStatus, string> = {
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

// ============================================
// Amount Cell Component
// ============================================

function AmountCell({ amount, type }: { amount: number; type: TransactionType }) {
  const isIncome = type === 'income';

  return (
    <span
      className={cn(
        'font-mono font-medium',
        isIncome ? 'text-[var(--success)]' : 'text-[var(--error)]'
      )}
    >
      {isIncome ? '+' : '-'} {formatCurrency(amount)}
    </span>
  );
}

// ============================================
// Table Column Definitions
// ============================================

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'merchant',
    header: 'Merchant',
    cell: ({ row }) => {
      const merchant = row.original.merchant;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--background-tertiary)] text-sm font-medium text-[var(--foreground-secondary)]">
            {merchant.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-[var(--foreground)]">{merchant.name}</p>
            <p className="text-xs text-[var(--foreground-muted)]">{row.original.description}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-[var(--foreground-secondary)]">
        {CATEGORY_LABELS[row.getValue('category') as keyof typeof CATEGORY_LABELS]}
      </span>
    ),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-[var(--foreground-muted)]">{formatShortDate(row.getValue('date'))}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <AmountCell amount={row.getValue('amount')} type={row.original.type} />
    ),
  },
];

// ============================================
// Skeleton Loading State
// ============================================

function TableSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Pagination Controls Component
// ============================================

interface PaginationControlsProps {
  table: ReturnType<typeof useReactTable<Transaction>>;
}

function PaginationControls({ table }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between border-t border-[var(--border)] px-2 pt-4">
      <p className="text-sm text-[var(--foreground-muted)]">
        Page {table.getState().pagination.pageIndex + 1} of{' '}
        {table.getPageCount()}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Transactions Table Component
// ============================================

export function TransactionsTable({ data, isLoading }: TransactionsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'date', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: TABLE_CONFIG.defaultPageSize,
      },
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <Input
            placeholder="Search transactions..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-[var(--foreground-muted)]"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <PaginationControls table={table} />
      </CardContent>
    </Card>
  );
}
