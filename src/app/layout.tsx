import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
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
// Theme Script
// ============================================

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('orbital-dashboard-storage');
    if (stored) {
      var parsed = JSON.parse(stored);
      var theme = parsed.state?.theme || 'dark';
      if (theme === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.classList.add(theme);
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#09090b" />
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
