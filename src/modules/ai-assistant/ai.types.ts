export interface AiActionRecommendation {
  type: 'REROUTE' | 'DISPATCH_TIMING' | 'SPEED_REGULATION' | 'SPECIAL_TRAIN' | 'MAINTENANCE_HOLD';
  title: string;
  description: string;
  sectionOrRouteId?: string;
}

export interface AiQueryResponse {
  answer: string;
  provider: 'GEMINI' | 'FALLBACK_LOCAL';
  recommendations: AiActionRecommendation[];
  contextSummary: {
    networkHealth: number;
    activeBottlenecks: number;
    delayedTrains: number;
    simulatedTime: string;
  };
  timestamp: string;
}

export interface AiQueryRequest {
  query: string;
  role?: string;
}
