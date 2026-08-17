import { describe, it, expect } from 'vitest';
import { analyzeSection, analyzeCorridors, analyzeNetwork } from '../src/modules/network/network.analytics';
import { SimulationEngine } from '../src/modules/simulation/simulation.engine';
import { SectionRuntimeState, TrainRuntimeState } from '../src/modules/simulation/simulation.types';

describe('Network Bottleneck Analytics Engine', () => {
  const mockTrains: Record<string, TrainRuntimeState> = {
    trn_101: {
      id: 'trn_101',
      number: '12301',
      name: 'Rajdhani Express',
      type: 'SUPERFAST',
      currentSectionId: 'sec_test_1',
      progress: 0.5,
      speedKmh: 120,
      maxSpeedKmh: 130,
      status: 'RUNNING',
      delayMinutes: 0,
      routeSectionIds: ['sec_test_1'],
      currentRouteIndex: 0,
    },
  };

  it('should analyze section saturation and map train numbers correctly', () => {
    const section: SectionRuntimeState = {
      id: 'sec_test_1',
      name: 'Delhi - Kanpur',
      corridorId: 'cor_main',
      maxDailyCapacity: 100,
      activeTrainIds: ['trn_101'],
      activeTrainCount: 1,
      saturationRatio: 0.75,
      saturationStatus: 'WARNING',
      isDisrupted: false,
    };

    const result = analyzeSection(section, mockTrains);
    expect(result.sectionId).toBe('sec_test_1');
    expect(result.activeTrainNumbers).toContain('12301');
    expect(result.status).toBe('WARNING');
    expect(result.isBottleneck).toBe(false);
  });

  it('should flag sections with V/C >= 0.85 or disruption as bottlenecks', () => {
    const bottleneckSection: SectionRuntimeState = {
      id: 'sec_test_2',
      name: 'Kanpur - Prayagraj',
      corridorId: 'cor_main',
      maxDailyCapacity: 100,
      activeTrainIds: ['trn_101'],
      activeTrainCount: 1,
      saturationRatio: 0.88,
      saturationStatus: 'WARNING',
      isDisrupted: false,
    };

    const disruptedSection: SectionRuntimeState = {
      id: 'sec_test_3',
      name: 'Allahabad Junction Area',
      corridorId: 'cor_main',
      maxDailyCapacity: 80,
      activeTrainIds: [],
      activeTrainCount: 0,
      saturationRatio: 0.50,
      saturationStatus: 'NORMAL',
      isDisrupted: true,
      disruptionReason: 'Signal Failure',
    };

    const resBottleneck = analyzeSection(bottleneckSection, mockTrains);
    expect(resBottleneck.isBottleneck).toBe(true);

    const resDisrupted = analyzeSection(disruptedSection, mockTrains);
    expect(resDisrupted.isBottleneck).toBe(true);
    expect(resDisrupted.recommendation).toContain('CRITICAL');
  });

  it('should aggregate corridor metrics and rank corridors by saturation', () => {
    const sections = [
      analyzeSection(
        {
          id: 'sec_1',
          name: 'Section 1',
          corridorId: 'cor_high',
          maxDailyCapacity: 100,
          activeTrainIds: ['trn_101'],
          activeTrainCount: 1,
          saturationRatio: 0.90,
          saturationStatus: 'CRITICAL',
          isDisrupted: false,
        },
        mockTrains
      ),
      analyzeSection(
        {
          id: 'sec_2',
          name: 'Section 2',
          corridorId: 'cor_high',
          maxDailyCapacity: 100,
          activeTrainIds: [],
          activeTrainCount: 0,
          saturationRatio: 0.80,
          saturationStatus: 'WARNING',
          isDisrupted: false,
        },
        mockTrains
      ),
      analyzeSection(
        {
          id: 'sec_3',
          name: 'Section 3',
          corridorId: 'cor_low',
          maxDailyCapacity: 100,
          activeTrainIds: [],
          activeTrainCount: 0,
          saturationRatio: 0.40,
          saturationStatus: 'NORMAL',
          isDisrupted: false,
        },
        mockTrains
      ),
    ];

    const corridors = analyzeCorridors(sections);
    expect(corridors.length).toBe(2);
    expect(corridors[0].corridorId).toBe('cor_high'); // higher average saturation (0.85 vs 0.40)
    expect(corridors[0].averageSaturationRatio).toBe(0.85);
    expect(corridors[0].bottleneckSectionCount).toBe(1);
  });

  it('should generate complete network analytics summary without mutating state', () => {
    const engine = new SimulationEngine();
    const stateBefore = engine.getState();
    const summary = analyzeNetwork(stateBefore);

    expect(summary.networkHealthIndex).toBe(stateBefore.metrics.networkHealthIndex);
    expect(summary.bottlenecks.length).toBeGreaterThanOrEqual(1);
    expect(summary.rankedCongestedSections.length).toBe(6);
    expect(summary.rankedCorridors.length).toBe(2);

    // Verify state immutability
    const stateAfter = engine.getState();
    expect(stateAfter).toEqual(stateBefore);
  });

  it('should handle edge cases with empty sections or 0 capacity', () => {
    const emptyCorridors = analyzeCorridors([]);
    expect(emptyCorridors).toEqual([]);

    const zeroCapacitySection: SectionRuntimeState = {
      id: 'sec_zero',
      name: 'Zero Cap Section',
      corridorId: 'cor_zero',
      maxDailyCapacity: 0,
      activeTrainIds: [],
      activeTrainCount: 0,
      saturationRatio: 0,
      saturationStatus: 'NORMAL',
      isDisrupted: false,
    };

    const resZero = analyzeSection(zeroCapacitySection, mockTrains);
    expect(resZero.saturationRatio).toBe(0);
    expect(resZero.isBottleneck).toBe(false);
  });
});
