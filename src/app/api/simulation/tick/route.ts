import { NextResponse } from 'next/server';
import { getSimulationEngine } from '@/modules/simulation/simulation.engine';

export async function POST() {
  const engine = getSimulationEngine();
  const nextState = engine.tick();

  return NextResponse.json({
    status: 'success',
    data: nextState,
  });
}
