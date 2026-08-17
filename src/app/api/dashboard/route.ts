import { NextResponse } from 'next/server';
import { getSimulationEngine } from '@/modules/simulation/simulation.engine';
import { evaluateAlerts } from '@/modules/alerts/alert.evaluator';

export async function GET() {
  const engine = getSimulationEngine();
  const state = engine.getState();
  const activeAlerts = evaluateAlerts(state);

  return NextResponse.json({
    status: 'success',
    kpis: state.metrics,
    alerts: activeAlerts,
  });
}
