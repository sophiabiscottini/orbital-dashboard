import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// ============================================
// Font Configuration
// ============================================

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

// ============================================
// Metadata
// ============================================

export const metadata: Metadata = {
  title: 'Orbital Dashboard | Financial Control Center',
  description:
    'A modern financial dashboard for personal and business finance management. Track your income, expenses, and savings with beautiful visualizations.',
  keywords: ['dashboard', 'finance', 'money', 'tracking', 'analytics'],
};

// ============================================
// Root Layout
// ============================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
