import { NextResponse } from 'next/server';
import { getSimulationEngine } from '@/modules/simulation/simulation.engine';
import { analyzeNetwork } from '@/modules/network/network.analytics';

export async function GET() {
  const engine = getSimulationEngine();
  const state = engine.getState();
  const analytics = analyzeNetwork(state);

  return NextResponse.json({
    status: 'success',
    data: analytics,
  });
}
