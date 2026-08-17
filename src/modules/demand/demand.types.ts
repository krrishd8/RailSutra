export type FestivalSeason =
  | 'DURGA_PUJA'
  | 'CHHATH_PUJA'
  | 'DIWALI'
  | 'SUMMER_RUSH'
  | 'REGULAR';

export type DemandSurgeStatus = 'SURGE_CRITICAL' | 'SURGE_MODERATE' | 'BALANCED';

export interface RouteDemandForecast {
  routeId: string;
  originCode: string;
  originName: string;
  destinationCode: string;
  destinationName: string;
  corridorId: string;
  baselineDailyDemand: number;
  festivalSeason: FestivalSeason;
  demandMultiplier: number;
  predictedPassengerDemand: number;
  availableCapacity: number;
  capacityGap: number;
  demandSurgeIndex: number; // Ratio of predicted to baseline
  recommendedSpecialTrains: number; // Additional services required
  isHighDemandRoute: boolean;
  confidenceScore: number; // 0 - 100%
  status: DemandSurgeStatus;
  peakWindow: string;
}

export interface CorridorDemandSummary {
  corridorId: string;
  name: string;
  totalBaselineDemand: number;
  totalPredictedDemand: number;
  totalAvailableCapacity: number;
  totalCapacityGap: number;
  totalRecommendedSpecialTrains: number;
  routes: RouteDemandForecast[];
}

export interface DemandForecastResponse {
  festivalSeason: FestivalSeason;
  activeScenario: string;
  totalCorridorCapacityGap: number;
  totalSpecialTrainsRecommended: number;
  highDemandRoutesCount: number;
  corridors: CorridorDemandSummary[];
  simulatedTime: string;
  tick: number;
}
