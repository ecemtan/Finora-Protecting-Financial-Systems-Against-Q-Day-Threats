import '../styles/globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Finora – Post-Quantum Financial Security',
  description: 'Post-Quantum Financial Security Platform Dashboard',
};

import AppShell from '@/components/AppShell';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

