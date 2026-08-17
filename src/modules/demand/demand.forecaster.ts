import { OperationalState } from '@/modules/simulation/simulation.types';
import {
  FestivalSeason,
  RouteDemandForecast,
  CorridorDemandSummary,
  DemandForecastResponse,
  DemandSurgeStatus,
} from './demand.types';

interface BaselineRouteConfig {
  routeId: string;
  originCode: string;
  originName: string;
  destinationCode: string;
  destinationName: string;
  corridorId: string;
  baselineDailyDemand: number;
  baselineDailyCapacity: number;
  peakWindow: string;
}

const BASELINE_ROUTES: BaselineRouteConfig[] = [
  {
    routeId: 'rt_ndls_hwh',
    originCode: 'NDLS',
    originName: 'New Delhi',
    destinationCode: 'HWH',
    destinationName: 'Howrah Junction',
    corridorId: 'cor_ndls_hwh',
    baselineDailyDemand: 4200,
    baselineDailyCapacity: 3600,
    peakWindow: 'Oct 15 – Nov 08',
  },
  {
    routeId: 'rt_ndls_pryj',
    originCode: 'NDLS',
    originName: 'New Delhi',
    destinationCode: 'PRYJ',
    destinationName: 'Prayagraj Junction',
    corridorId: 'cor_ndls_hwh',
    baselineDailyDemand: 3100,
    baselineDailyCapacity: 2400,
    peakWindow: 'Oct 20 – Nov 12',
  },
  {
    routeId: 'rt_cnb_hwh',
    originCode: 'CNB',
    originName: 'Kanpur Central',
    destinationCode: 'HWH',
    destinationName: 'Howrah Junction',
    corridorId: 'cor_ndls_hwh',
    baselineDailyDemand: 2200,
    baselineDailyCapacity: 2000,
    peakWindow: 'Oct 18 – Nov 05',
  },
  {
    routeId: 'rt_mmct_ndls',
    originCode: 'MMCT',
    originName: 'Mumbai Central',
    destinationCode: 'NDLS',
    destinationName: 'New Delhi',
    corridorId: 'cor_mmct_ndls',
    baselineDailyDemand: 3800,
    baselineDailyCapacity: 3600,
    peakWindow: 'Oct 22 – Nov 06',
  },
  {
    routeId: 'rt_adi_ndls',
    originCode: 'ADI',
    originName: 'Ahmedabad Junction',
    destinationCode: 'NDLS',
    destinationName: 'New Delhi',
    corridorId: 'cor_mmct_ndls',
    baselineDailyDemand: 2600,
    baselineDailyCapacity: 2400,
    peakWindow: 'Oct 24 – Nov 04',
  },
];

const CORRIDOR_NAMES: Record<string, string> = {
  cor_ndls_hwh: 'Delhi–Howrah Main Trunk Corridor',
  cor_mmct_ndls: 'Mumbai–Delhi Western Trunk Corridor',
};

const SEASON_MULTIPLIERS: Record<FestivalSeason, Record<string, number> | number> = {
  CHHATH_PUJA: {
    rt_ndls_pryj: 3.5,
    rt_ndls_hwh: 3.0,
    rt_cnb_hwh: 2.8,
    rt_mmct_ndls: 1.8,
    rt_adi_ndls: 1.5,
  },
  DURGA_PUJA: {
    rt_ndls_hwh: 3.2,
    rt_cnb_hwh: 2.9,
    rt_ndls_pryj: 2.2,
    rt_mmct_ndls: 1.6,
    rt_adi_ndls: 1.4,
  },
  DIWALI: {
    rt_ndls_hwh: 2.6,
    rt_ndls_pryj: 2.5,
    rt_cnb_hwh: 2.2,
    rt_mmct_ndls: 2.4,
    rt_adi_ndls: 2.1,
  },
  SUMMER_RUSH: 1.6,
  REGULAR: 1.0,
};

/**
 * Get multiplier for a given route and season
 */
export function getDemandMultiplier(season: FestivalSeason, routeId: string): number {
  const config = SEASON_MULTIPLIERS[season];
  if (typeof config === 'number') {
    return config;
  }
  return config[routeId] || 2.0;
}

/**
 * Calculate capacity gap: predicted demand minus available capacity (bounded at >= 0)
 */
export function calculateCapacityGap(predictedDemand: number, availableCapacity: number): number {
  return Math.max(0, predictedDemand - availableCapacity);
}

/**
 * Calculate recommended additional special train rakes (standard rake ~1200 seats)
 */
export function calculateSpecialTrains(capacityGap: number, standardRakeCapacity: number = 1200): number {
  if (capacityGap <= 0) return 0;
  return Math.ceil(capacityGap / standardRakeCapacity);
}

/**
 * Forecast demand for a specific route
 */
export function forecastRouteDemand(
  route: BaselineRouteConfig,
  season: FestivalSeason,
  activeCorridorTrains: number = 0
): RouteDemandForecast {
  const multiplier = getDemandMultiplier(season, route.routeId);
  const predictedPassengerDemand = Math.round(route.baselineDailyDemand * multiplier);

  // Dynamic capacity incorporates active running train rakes on corridor
  const availableCapacity = route.baselineDailyCapacity + activeCorridorTrains * 300;
  const capacityGap = calculateCapacityGap(predictedPassengerDemand, availableCapacity);
  const demandSurgeIndex = Number((predictedPassengerDemand / route.baselineDailyDemand).toFixed(2));
  const recommendedSpecialTrains = calculateSpecialTrains(capacityGap);
  const isHighDemandRoute = demandSurgeIndex >= 1.5 || capacityGap > 1000;

  let status: DemandSurgeStatus = 'BALANCED';
  if (capacityGap >= 2500 || demandSurgeIndex >= 2.5) {
    status = 'SURGE_CRITICAL';
  } else if (capacityGap >= 800 || demandSurgeIndex >= 1.4) {
    status = 'SURGE_MODERATE';
  }

  return {
    routeId: route.routeId,
    originCode: route.originCode,
    originName: route.originName,
    destinationCode: route.destinationCode,
    destinationName: route.destinationName,
    corridorId: route.corridorId,
    baselineDailyDemand: route.baselineDailyDemand,
    festivalSeason: season,
    demandMultiplier: multiplier,
    predictedPassengerDemand,
    availableCapacity,
    capacityGap,
    demandSurgeIndex,
    recommendedSpecialTrains,
    isHighDemandRoute,
    confidenceScore: 92, // Deterministic high confidence for historical holiday models
    status,
    peakWindow: route.peakWindow,
  };
}

/**
 * Generate full demand forecasting and capacity gap analysis.
 * PURE READ-ONLY with respect to OperationalState.
 */
export function generateDemandForecast(
  state: OperationalState,
  season: FestivalSeason = 'DURGA_PUJA'
): DemandForecastResponse {
  // Extract active trains per corridor from operational state
  const corridorTrainCounts: Record<string, number> = {};
  for (const train of Object.values(state.trains)) {
    const section = state.sections[train.currentSectionId];
    if (section?.corridorId) {
      corridorTrainCounts[section.corridorId] = (corridorTrainCounts[section.corridorId] || 0) + 1;
    }
  }

  const routeForecasts = BASELINE_ROUTES.map((route) =>
    forecastRouteDemand(route, season, corridorTrainCounts[route.corridorId] || 0)
  );

  // Group forecasts by corridor
  const corridorMap = new Map<string, RouteDemandForecast[]>();
  for (const forecast of routeForecasts) {
    const list = corridorMap.get(forecast.corridorId) || [];
    list.push(forecast);
    corridorMap.set(forecast.corridorId, list);
  }

  const corridors: CorridorDemandSummary[] = [];
  let totalCorridorCapacityGap = 0;
  let totalSpecialTrainsRecommended = 0;
  let highDemandRoutesCount = 0;

  for (const [corridorId, routes] of corridorMap.entries()) {
    const totalBaselineDemand = routes.reduce((acc, r) => acc + r.baselineDailyDemand, 0);
    const totalPredictedDemand = routes.reduce((acc, r) => acc + r.predictedPassengerDemand, 0);
    const totalAvailableCapacity = routes.reduce((acc, r) => acc + r.availableCapacity, 0);
    const totalGap = routes.reduce((acc, r) => acc + r.capacityGap, 0);
    const totalSpecials = routes.reduce((acc, r) => acc + r.recommendedSpecialTrains, 0);

    totalCorridorCapacityGap += totalGap;
    totalSpecialTrainsRecommended += totalSpecials;
    highDemandRoutesCount += routes.filter((r) => r.isHighDemandRoute).length;

    corridors.push({
      corridorId,
      name: CORRIDOR_NAMES[corridorId] || corridorId,
      totalBaselineDemand,
      totalPredictedDemand,
      totalAvailableCapacity,
      totalCapacityGap: totalGap,
      totalRecommendedSpecialTrains: totalSpecials,
      routes,
    });
  }

  return {
    festivalSeason: season,
    activeScenario: state.activeScenarioId,
    totalCorridorCapacityGap,
    totalSpecialTrainsRecommended,
    highDemandRoutesCount,
    corridors,
    simulatedTime: state.simulatedTime,
    tick: state.tick,
  };
}
