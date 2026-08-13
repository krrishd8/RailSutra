'use client';

import React from 'react';
import { Play, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';

interface ScenarioBarProps {
  currentScenario?: string;
  onSelectScenario?: (scenarioId: string) => void;
}

export const ScenarioBar: React.FC<ScenarioBarProps> = ({
  currentScenario = 'NORMAL_OPERATIONS',
  onSelectScenario,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Sparkles size={16} style={{ color: 'var(--color-primary-light)' }} />
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Scenario Preset Control Bar (Phase 1 Ready)
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => onSelectScenario?.('NORMAL_OPERATIONS')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: currentScenario === 'NORMAL_OPERATIONS' ? 'var(--surface-hover)' : 'var(--bg-darker)',
            color: currentScenario === 'NORMAL_OPERATIONS' ? 'var(--color-success)' : 'var(--text-secondary)',
            border: currentScenario === 'NORMAL_OPERATIONS' ? '1px solid var(--color-success)' : '1px solid var(--border-subtle)',
          }}
        >
          <RotateCcw size={14} />
          Normal Operations
        </button>

        <button
          onClick={() => onSelectScenario?.('FESTIVAL_SURGE')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: currentScenario === 'FESTIVAL_SURGE' ? 'var(--surface-hover)' : 'var(--bg-darker)',
            color: currentScenario === 'FESTIVAL_SURGE' ? 'var(--color-warning)' : 'var(--text-secondary)',
            border: currentScenario === 'FESTIVAL_SURGE' ? '1px solid var(--color-warning)' : '1px solid var(--border-subtle)',
          }}
        >
          <Play size={14} />
          Festival Demand Surge
        </button>

        <button
          onClick={() => onSelectScenario?.('TRACK_FAILURE_KANPUR')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: currentScenario === 'TRACK_FAILURE_KANPUR' ? 'var(--surface-hover)' : 'var(--bg-darker)',
            color: currentScenario === 'TRACK_FAILURE_KANPUR' ? 'var(--color-critical)' : 'var(--text-secondary)',
            border: currentScenario === 'TRACK_FAILURE_KANPUR' ? '1px solid var(--color-critical)' : '1px solid var(--border-subtle)',
          }}
        >
          <AlertTriangle size={14} />
          Track Failure (Kanpur)
        </button>
      </div>
    </div>
  );
};
