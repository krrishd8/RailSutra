import { NextResponse } from 'next/server';
import { getSimulationEngine } from '@/modules/simulation/simulation.engine';
import { evaluateAlerts } from '@/modules/alerts/alert.evaluator';

export async function GET() {
  const engine = getSimulationEngine();
  const state = engine.getState();
  const alerts = evaluateAlerts(state);

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter((a) => a.severity === 'WARNING').length;
  const unacknowledgedCount = alerts.filter((a) => !a.isAcknowledged).length;

  return NextResponse.json({
    status: 'success',
    data: {
      totalAlerts: alerts.length,
      criticalCount,
      warningCount,
      unacknowledgedCount,
      alerts,
    },
  });
}
