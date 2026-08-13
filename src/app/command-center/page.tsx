'use client';

import React, { useEffect, useState } from 'react';
import { MetricCard } from '@/shared/components/MetricCard';
import { AlertBadge } from '@/shared/components/AlertBadge';
import { ScenarioBar } from '@/shared/components/ScenarioBar';
import { OperationalMap } from '@/modules/map/OperationalMap';
import { NetworkKpis } from '@/modules/command-center/commandCenter.types';
import { AlertItem } from '@/modules/alerts/alert.types';
import { Activity, AlertTriangle, CheckCircle, Clock, ShieldAlert, Train, Zap } from 'lucide-react';

export default function CommandCenterPage() {
  const [kpis, setKpis] = useState<NetworkKpis | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFeature, setSelectedFeature] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          setKpis(data.kpis);
          setAlerts(data.alerts);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Page Title & Operational Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Operational Command Center
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Real-time railway network health, geospatial telemetry, and bottleneck analytics summary.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              color: 'var(--color-success)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle size={14} /> Shared State Backbone Ready
          </span>
        </div>
      </div>

      {/* Scenario Launcher Banner */}
      <ScenarioBar />

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Network Health Index"
          value={kpis ? `${kpis.networkHealthIndex}/100` : '88/100'}
          subtext="Optimal operational range (> 80)"
          status="success"
          icon={Activity}
        />
        <MetricCard
          title="Active Trains"
          value={kpis ? kpis.totalActiveTrains : 142}
          subtext="6 Superfast, 2 Freight Rakes"
          status="info"
          icon={Train}
          trend="+4 vs avg"
        />
        <MetricCard
          title="On-Time Punctuality"
          value={kpis ? `${kpis.onTimePercentage}%` : '91.4%'}
          subtext="Target threshold: 90.0%"
          status="success"
          icon={Clock}
        />
        <MetricCard
          title="Active Bottlenecks"
          value={kpis ? kpis.activeBottlenecks : 2}
          subtext="Kanpur-Prayagraj (V/C 0.88)"
          status="warning"
          icon={AlertTriangle}
          trend="+1 critical"
        />
        <MetricCard
          title="Critical Alerts"
          value={kpis ? kpis.criticalAlerts : 1}
          subtext="Action required by controller"
          status="critical"
          icon={ShieldAlert}
        />
      </div>

      {/* Main Grid: MapLibre Map (Left 70%) & Active Alerts / Details (Right 30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', flex: 1, minHeight: '480px' }}>
        {/* MapLibre Operational Map */}
        <OperationalMap onSelectFeature={(props) => setSelectedFeature(props)} />

        {/* Right Panel: Active Alerts & Feature Inspection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Feature Inspection Card */}
          {selectedFeature ? (
            <div
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-light)', textTransform: 'uppercase' }}>
                Selected Map Node
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedFeature.name} ({selectedFeature.code})
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Zone: <strong>{selectedFeature.zone}</strong> | Platform Tracks: <strong>{selectedFeature.tracks}</strong>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '6px',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  textDecoration: 'underline',
                }}
              >
                Clear Selection
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px border-dashed var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 16px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Zap size={16} style={{ color: 'var(--color-primary)' }} />
              Click any station node on the map to inspect telemetry details.
            </div>
          )}

          {/* Active Alerts Panel */}
          <div
            style={{
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Active Network Alerts ({alerts.length})
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto-updating</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '360px' }}>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                    borderLeft: `4px solid ${
                      alert.severity === 'CRITICAL'
                        ? 'var(--color-critical)'
                        : alert.severity === 'WARNING'
                        ? 'var(--color-warning)'
                        : 'var(--color-info)'
                    }`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <AlertBadge severity={alert.severity} label={alert.category} />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {alert.title}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
