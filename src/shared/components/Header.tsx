'use client';

import React from 'react';
import { useAuthStore } from '@/modules/auth/useAuthStore';
import { Role, DEMO_USERS } from '@/modules/auth/auth.types';
import { Train, UserCheck, ShieldAlert, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentRole, currentUser, setRole } = useAuthStore();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-darker)',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
      }}
    >
      {/* Brand & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 0 12px var(--color-primary-glow)',
          }}
        >
          <Train size={22} />
        </div>
        <div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.02em',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            RailSutra
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--color-primary-light)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              DEMO / MVP
            </span>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.02em',
            }}
          >
            Indian Railways Intelligence Platform
          </div>
        </div>
      </div>

      {/* Center Status Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'var(--surface-primary)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success)',
              boxShadow: '0 0 6px var(--color-success)',
            }}
          />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            Operational Engine: <strong style={{ color: 'var(--text-primary)' }}>Online</strong>
          </span>
        </div>

        <span style={{ color: 'var(--border-strong)' }}>|</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <Clock size={14} />
          <span>Simulated Time: 08:30 IST</span>
        </div>
      </div>

      {/* Right User & Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {currentUser.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {currentUser.title} ({currentUser.zone})
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UserCheck size={16} style={{ color: 'var(--color-primary-light)' }} />
          <select
            value={currentRole}
            onChange={(e) => setRole(e.target.value as Role)}
            style={{
              backgroundColor: 'var(--surface-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="CONTROLLER">Operations Controller</option>
            <option value="PLANNER">Capacity Planner</option>
            <option value="MAINTENANCE">Maintenance Manager</option>
            <option value="EXECUTIVE">Executive Director</option>
          </select>
        </div>
      </div>
    </header>
  );
};
