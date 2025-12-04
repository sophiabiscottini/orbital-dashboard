# 🚀 Orbital Dashboard

> *A sleek financial command center for the modern age* ✧˖°

A futuristic financial dashboard crafted with Next.js 16, TypeScript, and Tailwind CSS. Because spreadsheets are so last century. ꒰ᐢ. .ᐢ꒱

## ✨ What's Inside

| Feature | Description |
|---------|-------------|
| 📊 **Live Metrics** | Balance, income, expenses, and savings rate (all at a glance) |
| 📈 **Smart Charts** | Revenue trends & expense breakdowns powered by Recharts |
| 📋 **Transaction Hub** | Filter, sort, and explore your data with TanStack Table |
| 🌙 **Dark Mode** | Neon-accented dark theme for night owls |
| 🌞 **Light Mode** | Clean light theme *(may cause temporary blindness)* |
| 📱 **Fully Responsive** | Looks great on everything from phones to ultrawide monitors |
| ⚡ **Collapsible Nav** | More space for what matters |

## 🛠️ Built With

```
Next.js 16        →  App Router architecture
TypeScript        →  Strict mode, zero 'any' tolerance
Tailwind CSS v4   →  Utility-first styling
Radix UI          →  Accessible component primitives
Zustand           →  Lightweight state management
Recharts          →  Beautiful data visualization
TanStack Table    →  Powerful table interactions
Zod               →  Runtime type validation
Lucide React      →  Crisp iconography
date-fns          →  Date manipulation done right
```

## 📂 How It's Organized

```bash
src/
├── app/                  # Next.js App Router
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard page
├── components/
│   ├── ui/               # Base UI primitives
│   ├── layout/           # Structural components
│   └── dashboard/        # Feature components
├── hooks/                # Custom React hooks
│   ├── use-dashboard-store.ts
│   └── use-transactions.ts
├── lib/                  # Utilities & helpers
│   ├── utils.ts
│   ├── formatters.ts
│   └── constants.ts
├── data/                 # Mock data generators
└── types/                # TypeScript definitions
```

## 🚀 Quick Start

**Requirements:** Node.js 18+ ᕙ(⇀‸↼‶)ᕗ

```bash
# Get the dependencies
npm install

# Launch the dashboard
npm run dev
```

Then visit [localhost:3000](http://localhost:3000) and explore! ₊˚⊹

## 📜 Available Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Spin up dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Check code quality |

## 🎨 Design Language

**Color Palette**
- `#a855f7` — Primary Purple
- `#3b82f6` — Accent Blue  
- `#22c55e` — Success Green
- `#ef4444` — Error Red
- `#f59e0b` — Warning Amber

**Typography**
- *Inter* — UI text
- *JetBrains Mono* — Numbers & code

## 📊 Key Components

**StatsCards** — Financial KPIs with trend indicators ↗️↘️

**RevenueChart** — Area chart tracking balance over time

**ExpensesDonutChart** — Category breakdown with interactive legend

**TransactionsTable** — Full-featured data grid with search, sort & pagination

## 🔧 Engineering Philosophy

- **Feature-first organization** — Components live where they're used
- **Separation of concerns** — Logic in hooks, presentation in components  
- **Type safety** — Strict TypeScript, no shortcuts
- **Composition over inheritance** — Radix UI patterns throughout
- **DRY codebase** — Shared utilities and constants

---

*Designed & developed with* 🤎 *by* **Sophia (Biscottini)** ꒰ა ˚₊ ✧ ໒꒱

