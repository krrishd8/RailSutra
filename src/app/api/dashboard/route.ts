import { NextResponse } from 'next/server';
import { NetworkKpis } from '@/modules/command-center/commandCenter.types';
import { AlertItem } from '@/modules/alerts/alert.types';

export async function GET() {
  const kpis: NetworkKpis = {
    networkHealthIndex: 88,
    totalActiveTrains: 142,
    onTimePercentage: 91.4,
    activeBottlenecks: 2,
    criticalAlerts: 1,
    corridorCapacityUtilization: 68.5,
    simulatedTime: '08:30 IST',
  };

  const activeAlerts: AlertItem[] = [
    {
      id: 'alt_01',
      severity: 'CRITICAL',
      category: 'CONGESTION',
      title: 'Kanpur–Prayagraj Track Saturation Warning',
      message: 'V/C ratio reached 0.88 on SEC_CNB_PRYJ due to freight rake congestion.',
      sectionCode: 'SEC_CNB_PRYJ',
      timestamp: '08:24 IST',
      isAcknowledged: false,
    },
    {
      id: 'alt_02',
      severity: 'WARNING',
      category: 'DEMAND',
      title: 'Festival Demand Spike Detected',
      message: 'Durga Puja travel demand surge (+280%) predicted on Delhi–Howrah corridor.',
      sectionCode: 'COR_NDLS_HWH',
      timestamp: '08:15 IST',
      isAcknowledged: false,
    },
    {
      id: 'alt_03',
      severity: 'INFO',
      category: 'WEATHER',
      title: 'Northern Plains Thermal Risk Monitoring',
      message: 'Rail thermal expansion monitoring active for New Delhi–Kanpur line.',
      sectionCode: 'SEC_NDLS_CNB',
      timestamp: '07:45 IST',
      isAcknowledged: true,
    },
  ];

  return NextResponse.json({
    status: 'success',
    kpis,
    alerts: activeAlerts,
    demoNotice: 'Phase 1 static data provider. Phase 2 will bind this endpoint to the live Simulation Engine.',
  });
}
