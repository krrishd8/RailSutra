import { NextRequest, NextResponse } from 'next/server';
import { getSimulationEngine } from '@/modules/simulation/simulation.engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioId, overrides } = body;

    if (!scenarioId || typeof scenarioId !== 'string') {
      return NextResponse.json(
        { status: 'error', message: 'Missing or invalid scenarioId' },
        { status: 400 }
      );
    }

    const engine = getSimulationEngine();
    const nextState = engine.applyScenario(scenarioId, overrides);

    return NextResponse.json({
      status: 'success',
      data: nextState,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err?.message || 'Failed to apply scenario' },
      { status: 500 }
    );
  }
}
