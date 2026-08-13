'use client';

import React, { useState } from 'react';
import { OperationalMap } from '@/modules/map/OperationalMap';
import { Layers, MapPin, Radio, Sliders } from 'lucide-react';

export default function FullMapPage() {
  const [selectedNode, setSelectedNode] = useState<Record<string, any> | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Interactive Railway Network Map
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Geospatial visualization of Indian Railway corridors, junctions, and track saturation indexes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--border-default)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Radio size={14} style={{ color: 'var(--color-success)' }} /> MapLibre GL Vector Engine
          </span>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: '550px', position: 'relative' }}>
        <OperationalMap onSelectFeature={(props) => setSelectedNode(props)} />
      </div>
    </div>
  );
}
