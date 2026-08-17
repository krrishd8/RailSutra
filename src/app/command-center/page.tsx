'use client';

import React, { useEffect, useState } from 'react';
import { MetricCard } from '@/shared/components/MetricCard';
import { AlertBadge } from '@/shared/components/AlertBadge';
import { ScenarioBar } from '@/shared/components/ScenarioBar';
import { OperationalMap } from '@/modules/map/OperationalMap';
import { useSimulationPoller } from '@/modules/simulation/useSimulationStore';
import { AlertItem } from '@/modules/alerts/alert.types';
import { Activity, AlertTriangle, CheckCircle, Clock, ShieldAlert, Train, Zap, Play } from 'lucide-react';

export default function CommandCenterPage() {
  const { state: simState, isLoading: isSimLoading, triggerTick } = useSimulationPoller(2000);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          setAlerts(data.alerts || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard alerts:', err);
      }
    }

    fetchAlerts();
  }, []);

  const metrics = simState?.metrics;
  const simulatedTime = simState?.simulatedTime || '08:30 IST';
  const tickCount = simState?.tick ?? 0;

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => triggerTick()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-secondary)',
              color: 'var(--color-primary-light)',
              border: '1px solid var(--border-default)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Advance Simulation Clock by 1 Tick"
          >
            <Play size={13} /> Step Tick ({simulatedTime})
          </button>

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
            <CheckCircle size={14} /> Shared State Live (Tick #{tickCount})
          </span>
        </div>
      </div>

      {/* Scenario Launcher Banner */}
      <ScenarioBar />

      {/* KPI Cards Grid - Bound to Live Simulation State */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Network Health Index"
          value={metrics ? `${metrics.networkHealthIndex}/100` : '88/100'}
          subtext="Optimal operational range (> 80)"
          status={
            metrics && metrics.networkHealthIndex >= 80
              ? 'success'
              : metrics && metrics.networkHealthIndex >= 60
              ? 'warning'
              : 'critical'
          }
          icon={Activity}
        />
        <MetricCard
          title="Active Trains"
          value={metrics ? metrics.totalActiveTrains : 6}
          subtext={`${metrics?.delayedTrainCount ?? 1} delayed (>15m)`}
          status="info"
          icon={Train}
          trend={metrics ? `${metrics.totalActiveTrains} active` : '+4 vs avg'}
        />
        <MetricCard
          title="On-Time Punctuality"
          value={metrics ? `${metrics.onTimePercentage}%` : '83.3%'}
          subtext="Target threshold: 90.0%"
          status={metrics && metrics.onTimePercentage >= 90 ? 'success' : 'warning'}
          icon={Clock}
        />
        <MetricCard
          title="Saturated Sections"
          value={metrics ? metrics.saturatedSectionCount : 1}
          subtext={metrics?.criticalBottleneckCount ? `${metrics.criticalBottleneckCount} critical bottlenecks` : 'Kanpur-Prayagraj (V/C 0.88)'}
          status={metrics?.criticalBottleneckCount ? 'critical' : metrics?.saturatedSectionCount ? 'warning' : 'success'}
          icon={AlertTriangle}
          trend={metrics?.criticalBottleneckCount ? `+${metrics.criticalBottleneckCount} critical` : undefined}
        />
        <MetricCard
          title="Capacity Utilization"
          value={metrics ? `${metrics.corridorCapacityUtilization}%` : '68.5%'}
          subtext="Corridor-wide avg V/C ratio"
          status="info"
          icon={ShieldAlert}
        />
      </div>

      {/* Main Grid: MapLibre Map (Left 70%) & Active Alerts / Details (Right 30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', flex: 1, minHeight: '480px' }}>
        {/* MapLibre Operational Map consuming live state */}
        <OperationalMap
          onSelectFeature={(props) => setSelectedFeature(props)}
          simulationSections={simState?.sections}
          simulationTrains={simState?.trains}
        />

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
                {selectedFeature.name} ({selectedFeature.code || selectedFeature.id})
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {selectedFeature.zone ? (
                  <>Zone: <strong>{selectedFeature.zone}</strong> | Platform Tracks: <strong>{selectedFeature.tracks}</strong></>
                ) : (
                  <>Saturation Ratio: <strong>{selectedFeature.saturationRatio ?? 'N/A'}</strong></>
                )}
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '6px',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Clear Selection
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px dashed var(--border-default)',
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
              Click any station node or corridor line to inspect live telemetry.
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
