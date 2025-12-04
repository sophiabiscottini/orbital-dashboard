import type {
  Transaction,
  TransactionCategory,
  TransactionType,
  TransactionStatus,
  DashboardMetrics,
  BalancePoint,
  CategoryBreakdown,
} from '@/src/types';
import { CATEGORY_COLORS } from '@/src/lib/constants';

// ============================================
// Mock Merchants
// ============================================

const MERCHANTS = {
  income: [
    { name: 'Acme Corp', logoUrl: undefined },
    { name: 'Tech Solutions', logoUrl: undefined },
    { name: 'Freelance Client', logoUrl: undefined },
    { name: 'Investment Returns', logoUrl: undefined },
  ],
  expense: [
    { name: 'Uber', logoUrl: undefined },
    { name: 'Spotify', logoUrl: undefined },
    { name: 'Netflix', logoUrl: undefined },
    { name: 'Amazon', logoUrl: undefined },
    { name: 'Whole Foods', logoUrl: undefined },
    { name: 'Apple', logoUrl: undefined },
    { name: 'Starbucks', logoUrl: undefined },
    { name: 'Target', logoUrl: undefined },
    { name: 'CVS Pharmacy', logoUrl: undefined },
    { name: 'Delta Airlines', logoUrl: undefined },
    { name: 'Electric Company', logoUrl: undefined },
    { name: 'Gas & Power', logoUrl: undefined },
  ],
} as const;

// ============================================
// Transaction Descriptions
// ============================================

const DESCRIPTIONS: Record<TransactionCategory, string[]> = {
  salary: ['Monthly Salary', 'Bonus Payment', 'Performance Bonus'],
  freelance: ['Web Development Project', 'Consulting Fee', 'Design Work'],
  investments: ['Dividend Payment', 'Stock Sale', 'Interest Income'],
  food: ['Grocery Shopping', 'Restaurant Dinner', 'Coffee & Snacks', 'Lunch'],
  transport: ['Uber Ride', 'Gas Station', 'Monthly Subway Pass', 'Car Maintenance'],
  entertainment: ['Movie Tickets', 'Concert', 'Gaming Subscription', 'Streaming Service'],
  shopping: ['Electronics Purchase', 'Clothing', 'Home Decor', 'Books'],
  utilities: ['Electric Bill', 'Water Bill', 'Internet Service', 'Phone Bill'],
  healthcare: ['Doctor Visit', 'Pharmacy', 'Gym Membership', 'Health Insurance'],
  education: ['Online Course', 'Books & Materials', 'Workshop Registration'],
  travel: ['Flight Booking', 'Hotel Stay', 'Car Rental', 'Travel Insurance'],
  subscription: ['Software Subscription', 'Music Streaming', 'Cloud Storage'],
  other: ['Miscellaneous', 'Gift', 'Donation', 'ATM Withdrawal'],
};

// ============================================
// Helper Functions
// ============================================

function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(randomBetween(8, 22), randomBetween(0, 59), 0, 0);
  return date.toISOString();
}

// ============================================
// Generate Mock Transactions
// ============================================

const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'food',
  'transport',
  'entertainment',
  'shopping',
  'utilities',
  'healthcare',
  'education',
  'travel',
  'subscription',
  'other',
];

const INCOME_CATEGORIES: TransactionCategory[] = ['salary', 'freelance', 'investments'];

export function generateMockTransactions(count: number = 50): Transaction[] {
  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() < 0.25; // 25% income, 75% expense
    const type: TransactionType = isIncome ? 'income' : 'expense';
    const category = isIncome
      ? randomChoice(INCOME_CATEGORIES)
      : randomChoice(EXPENSE_CATEGORIES);

    const amount = isIncome
      ? randomBetween(500, 8000)
      : randomBetween(5, 500);

    const statusRoll = Math.random();
    let status: TransactionStatus;
    if (statusRoll < 0.85) {
      status = 'completed';
    } else if (statusRoll < 0.95) {
      status = 'pending';
    } else {
      status = 'failed';
    }

    const merchant = isIncome
      ? randomChoice(MERCHANTS.income)
      : randomChoice(MERCHANTS.expense);

    const description = randomChoice(DESCRIPTIONS[category]);

    transactions.push({
      id: generateTransactionId(),
      amount,
      date: generateDate(randomBetween(0, 180)),
      description,
      category,
      type,
      status,
      merchant: { name: merchant.name, logoUrl: merchant.logoUrl },
    });
  }

  // Sort by date descending (most recent first)
  return transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// ============================================
// Generate Dashboard Metrics
// ============================================

export function calculateDashboardMetrics(
  transactions: Transaction[]
): DashboardMetrics {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyTransactions = transactions.filter(
    (t) => new Date(t.date) >= startOfMonth && t.status === 'completed'
  );

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRatePercent =
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0;

  // Calculate total balance from all completed transactions
  const totalIncome = transactions
    .filter((t) => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalBalance: totalIncome - totalExpenses + 15000, // Base balance
    monthlyIncome,
    monthlyExpenses,
    savingsRatePercent: Math.max(0, Math.min(100, savingsRatePercent)),
  };
}

// ============================================
// Generate Balance Evolution Data
// ============================================

export function generateBalanceEvolution(months: number = 6): BalancePoint[] {
  const data: BalancePoint[] = [];
  let balance = 18000;

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    date.setDate(1);

    // Simulate income and expenses
    const income = randomBetween(4000, 8000);
    const expenses = randomBetween(2000, 5000);
    balance += income - expenses;

    data.push({
      date: date.toISOString(),
      balance: Math.max(0, balance),
      label: date.toLocaleDateString('en-US', { month: 'short' }),
    });
  }

  return data;
}

// ============================================
// Generate Category Breakdown
// ============================================

export function calculateCategoryBreakdown(
  transactions: Transaction[]
): CategoryBreakdown[] {
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense' && t.status === 'completed')
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<TransactionCategory, number>
    );

  const totalExpenses = Object.values(expensesByCategory).reduce(
    (sum, amount) => sum + amount,
    0
  );

  return Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category: category as TransactionCategory,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: CATEGORY_COLORS[category as TransactionCategory],
    }))
    .sort((a, b) => b.amount - a.amount);
}

// ============================================
// Pre-generated Mock Data
// ============================================

export const MOCK_TRANSACTIONS = generateMockTransactions(100);
export const MOCK_METRICS = calculateDashboardMetrics(MOCK_TRANSACTIONS);
export const MOCK_BALANCE_EVOLUTION = generateBalanceEvolution(6);
export const MOCK_CATEGORY_BREAKDOWN = calculateCategoryBreakdown(MOCK_TRANSACTIONS);
