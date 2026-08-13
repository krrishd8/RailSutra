import React from 'react';
import { AlertSeverity } from '@/modules/alerts/alert.types';

interface AlertBadgeProps {
  severity: AlertSeverity;
  label?: string;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ severity, label }) => {
  const badgeClass =
    severity === 'CRITICAL'
      ? 'badge-critical'
      : severity === 'WARNING'
      ? 'badge-warning'
      : 'badge-info';

  return (
    <span
      className={badgeClass}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
        }}
      />
      {label || severity}
    </span>
  );
};
