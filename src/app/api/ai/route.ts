import { NextRequest, NextResponse } from 'next/server';
import { getSimulationEngine } from '@/modules/simulation/simulation.engine';
import { generateAiResponse } from '@/modules/ai-assistant/ai.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, role } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'query parameter is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const engine = getSimulationEngine();
    const state = engine.getState();
    const aiResponse = await generateAiResponse(query.trim(), state, role);

    return NextResponse.json({
      status: 'success',
      data: aiResponse,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to process AI query' },
      { status: 500 }
    );
  }
}
