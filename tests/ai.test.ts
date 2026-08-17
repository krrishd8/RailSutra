import { describe, it, expect } from 'vitest';
import { generateFallbackResponse } from '../src/modules/ai-assistant/fallback.provider';
import { generateAiResponse } from '../src/modules/ai-assistant/ai.service';
import { SimulationEngine } from '../src/modules/simulation/simulation.engine';

describe('AI Operations Assistant & Fallback Provider', () => {
  it('should generate context-aware bottleneck answers and recommendations', () => {
    const engine = new SimulationEngine();
    const state = engine.getState();

    const res = generateFallbackResponse('How should we mitigate Kanpur corridor congestion?', state);

    expect(res.provider).toBe('FALLBACK_LOCAL');
    expect(res.answer).toContain('Kanpur');
    expect(res.answer).toContain('Saturation');
    expect(res.recommendations.length).toBeGreaterThan(0);
    expect(res.recommendations.some((r) => r.type === 'SPEED_REGULATION' || r.type === 'DISPATCH_TIMING')).toBe(true);
  });

  it('should generate festival demand intelligence responses', () => {
    const engine = new SimulationEngine();
    const state = engine.getState();

    const res = generateFallbackResponse('Recommend special trains for Chhath Puja surge', state);

    expect(res.answer).toContain('Demand');
    expect(res.answer).toContain('special train');
    expect(res.recommendations.some((r) => r.type === 'SPECIAL_TRAIN')).toBe(true);
  });

  it('should generate train delay and punctuality briefs', () => {
    const engine = new SimulationEngine();
    const state = engine.getState();

    const res = generateFallbackResponse('List delayed trains and punctuality status', state);

    expect(res.answer).toContain('Punctuality');
    expect(res.contextSummary.delayedTrains).toBe(state.metrics.delayedTrainCount);
  });

  it('should generate rerouting advice on disruption query', () => {
    const engine = new SimulationEngine();
    const state = engine.getState();

    const res = generateFallbackResponse('What is the alternative rerouting plan for track failure?', state);

    expect(res.answer).toContain('routing');
    expect(res.recommendations.some((r) => r.type === 'REROUTE')).toBe(true);
  });

  it('should seamlessly execute generateAiResponse without GEMINI_API_KEY', async () => {
    const engine = new SimulationEngine();
    const state = engine.getState();

    // Ensure test runs without GEMINI_API_KEY
    delete process.env.GEMINI_API_KEY;

    const res = await generateAiResponse('Summarize current railway network health', state);

    expect(res.provider).toBe('FALLBACK_LOCAL');
    expect(res.answer).toContain('Network Health Index');
    expect(res.contextSummary.networkHealth).toBe(state.metrics.networkHealthIndex);
  });
});
