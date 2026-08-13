'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, TrendingUp, FileText, Info } from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Command Center',
    href: '/command-center',
    icon: LayoutDashboard,
  },
  {
    name: 'Interactive Map',
    href: '/map',
    icon: Map,
  },
  {
    name: 'Demand Intelligence',
    href: '/demand',
    icon: TrendingUp,
  },
  {
    name: 'Executive Reports',
    href: '/reports',
    icon: FileText,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-darker)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '8px 12px',
          }}
        >
          Navigation
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/command-center');

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--surface-hover)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon
                size={18}
                style={{
                  color: isActive ? 'var(--color-primary-light)' : 'var(--text-muted)',
                }}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Demo Information Callout */}
      <div
        style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-info)',
          }}
        >
          <Info size={14} />
          Phase 1 Active
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Shared operational state scaffold ready. Simulated telemetry seeded for Indian Railway corridors.
        </p>
      </div>
    </aside>
  );
};
