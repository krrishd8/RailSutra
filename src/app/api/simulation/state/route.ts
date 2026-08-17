import { NextResponse } from 'next/server';
import { getSimulationEngine } from '@/modules/simulation/simulation.engine';

export async function GET() {
  const engine = getSimulationEngine();
  const state = engine.getState();

  return NextResponse.json({
    status: 'success',
    data: state,
  });
}
