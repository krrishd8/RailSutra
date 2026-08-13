import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  status?: 'success' | 'warning' | 'critical' | 'info';
  icon?: LucideIcon;
  trend?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  status = 'info',
  icon: Icon,
  trend,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'critical':
        return 'var(--color-critical)';
      default:
        return 'var(--color-primary-light)';
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: getStatusColor(),
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </span>
        {Icon && <Icon size={18} style={{ color: getStatusColor() }} />}
      </div>

      <div
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
        }}
      >
        {value}
        {trend && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: trend.startsWith('+') ? 'var(--color-warning)' : 'var(--color-success)',
            }}
          >
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
};
