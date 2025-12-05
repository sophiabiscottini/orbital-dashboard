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
  Filter,
  X,
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
    id: 'merchant',
    accessorFn: (row) => `${row.merchant.name} ${row.description}`,
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
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
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
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-right">
        <AmountCell amount={row.getValue('amount')} type={row.original.type} />
      </div>
    ),
  },
];

// Helper function to create status column with filter state
function createStatusColumn(
  statusFilter: TransactionStatus[],
  setStatusFilter: (statuses: TransactionStatus[]) => void
): ColumnDef<Transaction> {
  return {
    accessorKey: 'status',
    header: () => (
      <StatusFilterHeader
        selectedStatuses={statusFilter}
        onStatusChange={setStatusFilter}
      />
    ),
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    filterFn: (row, id, filterValue: TransactionStatus[]) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
  };
}

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
// Status Filter Header Component
// ============================================

const STATUS_OPTIONS: { value: TransactionStatus; label: string }[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

interface StatusFilterHeaderProps {
  selectedStatuses: TransactionStatus[];
  onStatusChange: (statuses: TransactionStatus[]) => void;
}

function StatusFilterHeader({ selectedStatuses, onStatusChange }: StatusFilterHeaderProps) {
  const toggleStatus = (status: TransactionStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const clearFilters = () => onStatusChange([]);
  const hasFilters = selectedStatuses.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            '-ml-3 h-8',
            hasFilters
              ? 'text-[var(--primary)] hover:text-[var(--primary-hover)]'
              : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
          )}
        >
          Status
          {hasFilters ? (
            <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] text-white">
              {selectedStatuses.length}
            </span>
          ) : (
            <Filter className="ml-2 h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => toggleStatus(option.value)}
            className="flex items-center justify-between"
          >
            <span>{option.label}</span>
            {selectedStatuses.includes(option.value) && (
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
            )}
          </DropdownMenuItem>
        ))}
        {hasFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearFilters} className="text-[var(--error)]">
              <X className="mr-2 h-4 w-4" />
              Clear filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
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
  const [statusFilter, setStatusFilter] = React.useState<TransactionStatus[]>([]);

  // Update column filters when status filter changes
  React.useEffect(() => {
    setColumnFilters((prev) => {
      const otherFilters = prev.filter((f) => f.id !== 'status');
      if (statusFilter.length === 0) {
        return otherFilters;
      }
      return [...otherFilters, { id: 'status', value: statusFilter }];
    });
  }, [statusFilter]);

  // Create columns with status filter state
  const tableColumns = React.useMemo(() => {
    // Insert status column between date and amount
    const statusColumn = createStatusColumn(statusFilter, setStatusFilter);
    // columns array has: merchant, category, date, amount
    // We want: merchant, category, date, status, amount
    return [
      ...columns.slice(0, 3), // merchant, category, date
      statusColumn,
      ...columns.slice(3),    // amount
    ];
  }, [statusFilter]);

  const table = useReactTable({
    data,
    columns: tableColumns,
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
