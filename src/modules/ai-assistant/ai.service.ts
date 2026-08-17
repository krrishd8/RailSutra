import { OperationalState } from '@/modules/simulation/simulation.types';
import { AiQueryResponse } from './ai.types';
import { generateFallbackResponse } from './fallback.provider';

/**
 * Service to handle AI Operations queries using Google Gemini API with automatic deterministic fallback.
 */
export async function generateAiResponse(
  query: string,
  state: OperationalState,
  userRole: string = 'CONTROLLER'
): Promise<AiQueryResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no Gemini API key configured, seamlessly use deterministic fallback provider
  if (!apiKey) {
    return generateFallbackResponse(query, state);
  }

  try {
    const contextSummary = {
      simulatedTime: state.simulatedTime,
      networkHealthIndex: state.metrics.networkHealthIndex,
      totalActiveTrains: state.metrics.totalActiveTrains,
      delayedTrainCount: state.metrics.delayedTrainCount,
      onTimePercentage: state.metrics.onTimePercentage,
      saturatedSections: Object.values(state.sections)
        .filter((s) => s.saturationRatio >= 0.7 || s.isDisrupted)
        .map((s) => ({
          name: s.name,
          saturation: s.saturationRatio,
          disrupted: s.isDisrupted,
        })),
      delayedTrains: Object.values(state.trains)
        .filter((t) => t.status === 'DELAYED')
        .map((t) => ({ number: t.number, name: t.name, delayMinutes: t.delayMinutes })),
    };

    const promptText = `
You are RailSutra AI, an operational decision-support copilot for Indian Railways controllers and network planners.
User Role: ${userRole}
Current Railway Operational State Snapshot:
${JSON.stringify(contextSummary, null, 2)}

User Query: "${query}"

Instructions:
1. Provide a concise, bulleted operational response based on the actual telemetry provided above.
2. Give clear, actionable railway dispatch/rerouting/capacity recommendations where appropriate.
3. Keep the tone professional, authoritative, and focused on operations.
`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Using fallback provider.`);
      return generateFallbackResponse(query, state);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return generateFallbackResponse(query, state);
    }

    // Reuse fallback recommendations as structured actionable pills
    const fallbackBase = generateFallbackResponse(query, state);

    return {
      answer: candidateText.trim(),
      provider: 'GEMINI',
      recommendations: fallbackBase.recommendations,
      contextSummary: {
        networkHealth: state.metrics.networkHealthIndex,
        activeBottlenecks: state.metrics.criticalBottleneckCount + state.metrics.saturatedSectionCount,
        delayedTrains: state.metrics.delayedTrainCount,
        simulatedTime: state.simulatedTime,
      },
      timestamp: state.simulatedTime || '08:30 IST',
    };
  } catch (error) {
    console.warn('Gemini API call failed or timed out. Falling back to local operational engine:', error);
    return generateFallbackResponse(query, state);
  }
}
