'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { MetricCard } from '@/shared/components/MetricCard';
import { AlertBadge } from '@/shared/components/AlertBadge';
import { ScenarioBar } from '@/shared/components/ScenarioBar';
import { OperationalMap } from '@/modules/map/OperationalMap';
import { useSimulationPoller } from '@/modules/simulation/useSimulationStore';
import { AlertItem } from '@/modules/alerts/alert.types';
import { Activity, AlertTriangle, CheckCircle, Clock, ShieldAlert, Train, Zap, Play, Check } from 'lucide-react';

export default function CommandCenterPage() {
  const { state: simState, triggerTick } = useSimulationPoller(2000);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Record<string, any> | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.data?.alerts || []);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 2000);
    return () => clearInterval(interval);
  }, [fetchAlerts, simState?.tick]);

  const handleAcknowledge = async (alertId: string) => {
    try {
      const res = await fetch('/api/alerts/ack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId }),
      });
      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? { ...a, isAcknowledged: true } : a))
        );
      }
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };

  const handleSelectFeature = useCallback((props: Record<string, any>) => {
    setSelectedFeature(props);
  }, []);

  const metrics = simState?.metrics;
  const simulatedTime = simState?.simulatedTime || '08:30 IST';
  const tickCount = simState?.tick ?? 0;
  const criticalAlertCount = alerts.filter((a) => a.severity === 'CRITICAL' && !a.isAcknowledged).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Page Title & Operational Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Operational Command Center
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Real-time railway network health, geospatial telemetry, and smart alert analytics.
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

      {/* KPI Cards Grid */}
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
          title="Critical Alerts"
          value={criticalAlertCount}
          subtext={criticalAlertCount > 0 ? 'Requires controller action' : 'No unacknowledged criticals'}
          status={criticalAlertCount > 0 ? 'critical' : 'success'}
          icon={ShieldAlert}
        />
      </div>

      {/* Main Grid: MapLibre Map (Left 70%) & Active Alerts / Details (Right 30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', flex: 1, minHeight: '480px' }}>
        {/* MapLibre Operational Map */}
        <OperationalMap
          onSelectFeature={handleSelectFeature}
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
                Smart Network Alerts ({alerts.length})
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto-evaluating</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '360px' }}>
              {alerts.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                  No active alerts. Network status nominal.
                </div>
              ) : (
                alerts.map((alert) => (
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
                      opacity: alert.isAcknowledged ? 0.6 : 1,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertBadge severity={alert.severity} label={alert.category} />
                        {alert.isAcknowledged && (
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                            (ACK)
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.timestamp}</span>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {alert.title}
                    </div>

                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {alert.message}
                    </p>

                    {!alert.isAcknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        style={{
                          alignSelf: 'flex-end',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '10px',
                          fontWeight: 600,
                          backgroundColor: 'var(--surface-hover)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={11} /> Acknowledge
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
