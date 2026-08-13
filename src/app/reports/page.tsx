'use client';

import React from 'react';
import { FileText, Download, Printer, CheckCircle } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Executive Operations Shift Report
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Consolidated summary report compiling operational KPIs, bottleneck logs, and AI recommendations.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Printer size={16} /> Print / Export PDF
        </button>
      </div>

      <div
        style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            RailSutra — Daily Operations Executive Summary
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Generated: {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} | Shift: Morning (06:00 - 14:00 IST)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Network Health Index</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-success)' }}>88 / 100</div>
          </div>
          <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>On-Time Punctuality</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-info)' }}>91.4%</div>
          </div>
          <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Critical Bottlenecks</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-critical)' }}>1 Section</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Operational Summary & Recommendations
          </h3>
          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li>Delhi–Howrah trunk corridor operating smoothly with minor saturation on Kanpur–Prayagraj section ($V/C = 0.88$).</li>
            <li>Durga Puja demand surge expected to peak within 14 days; recommended 4 special train allocations.</li>
            <li>No critical track structural failures reported during current shift window.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
