# 🚀 Orbital Dashboard

A modern, futuristic financial dashboard built with Next.js 16, TypeScript, and Tailwind CSS.

## ✨ Features

- **📊 Real-time Metrics**: Track total balance, monthly income, expenses, and savings rate
- **📈 Interactive Charts**: Revenue evolution and expense breakdown with Recharts
- **📋 Advanced Data Table**: Filter, sort, and paginate transactions with TanStack Table
- **🌙 Dark Mode**: Beautiful dark theme with purple/blue neon accents
- **📱 Responsive**: Fully responsive design for all screen sizes
- **⚡ Collapsible Sidebar**: Space-efficient navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI (Shadcn pattern)
- **State Management**: Zustand
- **Data Visualization**: Recharts
- **Data Tables**: TanStack Table v8
- **Validation**: Zod
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## 📂 Project Structure

```bash
src/
├── app/                  # Next.js App Router
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard page
├── components/
│   ├── ui/               # Base UI components (Button, Card, etc.)
│   ├── layout/           # Layout components (Sidebar, Header)
│   └── dashboard/        # Dashboard-specific components
├── hooks/                # Custom React hooks
│   ├── use-dashboard-store.ts  # Zustand store
│   └── use-transactions.ts     # Transaction logic
├── lib/                  # Utilities and helpers
│   ├── utils.ts          # cn() helper
│   ├── formatters.ts     # Currency/Date formatters
│   └── constants.ts      # App constants
├── data/                 # Mock data
│   └── mock-data.ts      # Transaction generators
└── types/                # TypeScript interfaces
    └── index.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Design System

### Colors

- **Primary**: Purple (#a855f7)
- **Accent**: Blue (#3b82f6)
- **Success**: Emerald (#22c55e)
- **Error**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)

### Typography

- **Sans**: Inter
- **Mono**: JetBrains Mono (for numbers)

## 📊 Components

### StatsCards
Displays key financial metrics with trend indicators.

### RevenueChart
Area chart showing balance evolution over time.

### ExpensesDonutChart
Donut chart with category breakdown and legend.

### TransactionsTable
Full-featured data table with:
- Global search
- Column sorting
- Pagination
- Status badges

## 🔧 Architecture Decisions

1. **Feature-based structure**: Components organized by feature, not type
2. **Logic separation**: Business logic in hooks, UI in components
3. **Strict typing**: No `any` types, all interfaces defined
4. **Composition pattern**: Radix UI-style component composition
5. **DRY principles**: Reusable utilities and constants

---

Built with 💜 by Sophia (Biscottini) Ი𐑼
