'use client';

import React from 'react';
import { MetricCard } from '@/shared/components/MetricCard';
import { TrendingUp, Calendar, Users, Train } from 'lucide-react';

export default function DemandPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Passenger Demand Intelligence
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Festival and seasonal demand forecasting, capacity gap calculations, and special train deployment recommendations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Predicted Festival Demand"
          value="+280%"
          subtext="Durga Puja & Chhath Puja Window"
          status="warning"
          icon={TrendingUp}
        />
        <MetricCard
          title="Corridor Peak Surge"
          value="4,850/day"
          subtext="Delhi–Howrah Trunk Line"
          status="critical"
          icon={Users}
        />
        <MetricCard
          title="Recommended Special Trains"
          value="4 Services"
          subtext="2 Superfast, 2 Express rakes"
          status="success"
          icon={Train}
        />
        <MetricCard
          title="Target Window"
          value="Oct 15 - Nov 10"
          subtext="Historical trend alignment"
          status="info"
          icon={Calendar}
        />
      </div>

      <div
        style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Phase 1 Demand Intelligence Foundation
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          This page establishes the UI layout for passenger demand intelligence. Phase 2 will integrate the live formula calculation engine that dynamically evaluates origin-destination waitlist surges against available train capacities.
        </p>
      </div>
    </div>
  );
}
