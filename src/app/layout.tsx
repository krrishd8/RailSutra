import React from 'react';
import type { Metadata } from 'next';
import '@/shared/styles/globals.css';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';

export const metadata: Metadata = {
  title: 'RailSutra — B2B Railway Operations Intelligence Platform',
  description: 'AI-powered railway operations intelligence, bottleneck analytics, and demand forecasting platform for Indian Railways.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar />
          <main style={{ flex: 1, backgroundColor: 'var(--bg-main)', overflowY: 'auto', padding: '20px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
