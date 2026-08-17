import { describe, it, expect } from 'vitest';
import {
  getDemandMultiplier,
  calculateCapacityGap,
  calculateSpecialTrains,
  forecastRouteDemand,
  generateDemandForecast,
} from '../src/modules/demand/demand.forecaster';
import { SimulationEngine } from '../src/modules/simulation/simulation.engine';

describe('Festival Demand Forecasting & Capacity Gap Engine', () => {
  it('should return correct festival demand multipliers', () => {
    expect(getDemandMultiplier('CHHATH_PUJA', 'rt_ndls_pryj')).toBe(3.5);
    expect(getDemandMultiplier('DURGA_PUJA', 'rt_ndls_hwh')).toBe(3.2);
    expect(getDemandMultiplier('REGULAR', 'rt_ndls_hwh')).toBe(1.0);
  });

  it('should calculate capacity gap correctly (bounded at >= 0)', () => {
    expect(calculateCapacityGap(10000, 6000)).toBe(4000);
    expect(calculateCapacityGap(5000, 6000)).toBe(0);
    expect(calculateCapacityGap(6000, 6000)).toBe(0);
  });

  it('should calculate recommended special trains with standard 1200-seat rakes', () => {
    expect(calculateSpecialTrains(4000)).toBe(4); // ceil(4000/1200) = 4
    expect(calculateSpecialTrains(1200)).toBe(1);
    expect(calculateSpecialTrains(1201)).toBe(2);
    expect(calculateSpecialTrains(0)).toBe(0);
  });

  it('should forecast individual route demand and flag high-demand routes', () => {
    const route = {
      routeId: 'rt_ndls_hwh',
      originCode: 'NDLS',
      originName: 'New Delhi',
      destinationCode: 'HWH',
      destinationName: 'Howrah Junction',
      corridorId: 'cor_ndls_hwh',
      baselineDailyDemand: 4200,
      baselineDailyCapacity: 3600,
      peakWindow: 'Oct 15 – Nov 08',
    };

    const forecast = forecastRouteDemand(route, 'DURGA_PUJA', 2);
    expect(forecast.predictedPassengerDemand).toBe(Math.round(4200 * 3.2));
    expect(forecast.demandSurgeIndex).toBe(3.2);
    expect(forecast.isHighDemandRoute).toBe(true);
    expect(forecast.status).toBe('SURGE_CRITICAL');
    expect(forecast.recommendedSpecialTrains).toBeGreaterThan(0);
  });

  it('should generate complete corridor demand forecast without mutating operational state', () => {
    const engine = new SimulationEngine();
    const stateBefore = engine.getState();

    const result = generateDemandForecast(stateBefore, 'CHHATH_PUJA');

    expect(result.festivalSeason).toBe('CHHATH_PUJA');
    expect(result.corridors.length).toBe(2);
    expect(result.totalCorridorCapacityGap).toBeGreaterThan(0);
    expect(result.totalSpecialTrainsRecommended).toBeGreaterThan(0);
    expect(result.highDemandRoutesCount).toBeGreaterThan(0);

    // Verify operational state immutability
    const stateAfter = engine.getState();
    expect(stateAfter).toEqual(stateBefore);
  });

  it('should return balanced demand status during regular non-festival season', () => {
    const engine = new SimulationEngine();
    const result = generateDemandForecast(engine.getState(), 'REGULAR');

    expect(result.festivalSeason).toBe('REGULAR');
    expect(result.totalSpecialTrainsRecommended).toBe(0);
    expect(result.totalCorridorCapacityGap).toBe(0);
  });
});
