import {
  OperationalState,
  TrainRuntimeState,
  SectionRuntimeState,
  NetworkMetrics,
} from './simulation.types';
import { calculateVcRatio, getVcStatus, calculateNetworkHealth } from '@/shared/utils/math';

/**
 * Baseline initial configuration derived from seeded Indian Railway data.
 */
function createInitialState(): OperationalState {
  const sections: Record<string, SectionRuntimeState> = {
    sec_ndls_cnb: {
      id: 'sec_ndls_cnb',
      name: 'New Delhi – Kanpur Central Section',
      corridorId: 'cor_ndls_hwh',
      maxDailyCapacity: 85,
      activeTrainIds: ['trn_12301', 'trn_22436'],
      activeTrainCount: 2,
      saturationRatio: 0.65,
      saturationStatus: 'NORMAL',
      isDisrupted: false,
    },
    sec_cnb_pryj: {
      id: 'sec_cnb_pryj',
      name: 'Kanpur Central – Prayagraj Jn Section',
      corridorId: 'cor_ndls_hwh',
      maxDailyCapacity: 90,
      activeTrainIds: ['trn_12801', 'trn_freight_4021'],
      activeTrainCount: 2,
      saturationRatio: 0.88,
      saturationStatus: 'WARNING',
      isDisrupted: false,
    },
    sec_pryj_ddu: {
      id: 'sec_pryj_ddu',
      name: 'Prayagraj Jn – Pt DD Upadhyaya Section',
      corridorId: 'cor_ndls_hwh',
      maxDailyCapacity: 80,
      activeTrainIds: [],
      activeTrainCount: 0,
      saturationRatio: 0.40,
      saturationStatus: 'NORMAL',
      isDisrupted: false,
    },
    sec_ddu_hwh: {
      id: 'sec_ddu_hwh',
      name: 'Pt DD Upadhyaya – Howrah Jn Section',
      corridorId: 'cor_ndls_hwh',
      maxDailyCapacity: 100,
      activeTrainIds: ['trn_12260'],
      activeTrainCount: 1,
      saturationRatio: 0.55,
      saturationStatus: 'NORMAL',
      isDisrupted: false,
    },
    sec_mmct_adi: {
      id: 'sec_mmct_adi',
      name: 'Mumbai Central – Ahmedabad Jn Section',
      corridorId: 'cor_mmct_ndls',
      maxDailyCapacity: 75,
      activeTrainIds: ['trn_12951'],
      activeTrainCount: 1,
      saturationRatio: 0.50,
      saturationStatus: 'NORMAL',
      isDisrupted: false,
    },
    sec_adi_ndls: {
      id: 'sec_adi_ndls',
      name: 'Ahmedabad Jn – New Delhi Section',
      corridorId: 'cor_mmct_ndls',
      maxDailyCapacity: 70,
      activeTrainIds: [],
      activeTrainCount: 0,
      saturationRatio: 0.35,
      saturationStatus: 'NORMAL',
      isDisrupted: false,
    },
  };

  const trains: Record<string, TrainRuntimeState> = {
    trn_12301: {
      id: 'trn_12301',
      number: '12301',
      name: 'Howrah Rajdhani Express',
      type: 'SUPERFAST',
      currentSectionId: 'sec_ndls_cnb',
      progress: 0.35,
      speedKmh: 125,
      maxSpeedKmh: 130,
      status: 'RUNNING',
      delayMinutes: 4,
      routeSectionIds: ['sec_ndls_cnb', 'sec_cnb_pryj', 'sec_pryj_ddu', 'sec_ddu_hwh'],
      currentRouteIndex: 0,
    },
    trn_12951: {
      id: 'trn_12951',
      number: '12951',
      name: 'Mumbai Rajdhani Express',
      type: 'SUPERFAST',
      currentSectionId: 'sec_mmct_adi',
      progress: 0.50,
      speedKmh: 120,
      maxSpeedKmh: 130,
      status: 'RUNNING',
      delayMinutes: 0,
      routeSectionIds: ['sec_mmct_adi', 'sec_adi_ndls'],
      currentRouteIndex: 0,
    },
    trn_22436: {
      id: 'trn_22436',
      number: '22436',
      name: 'Vande Bharat Express (Varanasi–NDLS)',
      type: 'SUPERFAST',
      currentSectionId: 'sec_ndls_cnb',
      progress: 0.70,
      speedKmh: 140,
      maxSpeedKmh: 160,
      status: 'RUNNING',
      delayMinutes: 2,
      routeSectionIds: ['sec_ndls_cnb', 'sec_cnb_pryj', 'sec_pryj_ddu'],
      currentRouteIndex: 0,
    },
    trn_12801: {
      id: 'trn_12801',
      number: '12801',
      name: 'Purushottam Express',
      type: 'EXPRESS',
      currentSectionId: 'sec_cnb_pryj',
      progress: 0.40,
      speedKmh: 95,
      maxSpeedKmh: 110,
      status: 'RUNNING',
      delayMinutes: 12,
      routeSectionIds: ['sec_ndls_cnb', 'sec_cnb_pryj', 'sec_pryj_ddu', 'sec_ddu_hwh'],
      currentRouteIndex: 1,
    },
    trn_12260: {
      id: 'trn_12260',
      number: '12260',
      name: 'Sealdah Duronto Express',
      type: 'SUPERFAST',
      currentSectionId: 'sec_ddu_hwh',
      progress: 0.20,
      speedKmh: 115,
      maxSpeedKmh: 130,
      status: 'RUNNING',
      delayMinutes: 5,
      routeSectionIds: ['sec_ddu_hwh', 'sec_pryj_ddu', 'sec_cnb_pryj', 'sec_ndls_cnb'],
      currentRouteIndex: 0,
    },
    trn_freight_4021: {
      id: 'trn_freight_4021',
      number: 'FREIGHT-4021',
      name: 'Coal Freight Rake #4021',
      type: 'FREIGHT',
      currentSectionId: 'sec_cnb_pryj',
      progress: 0.85,
      speedKmh: 60,
      maxSpeedKmh: 75,
      status: 'RUNNING',
      delayMinutes: 25,
      routeSectionIds: ['sec_cnb_pryj', 'sec_pryj_ddu'],
      currentRouteIndex: 0,
    },
  };

  const metrics: NetworkMetrics = {
    networkHealthIndex: 88,
    totalActiveTrains: 6,
    delayedTrainCount: 1, // trn_freight_4021 has delay > 15
    onTimePercentage: 83.3,
    saturatedSectionCount: 1, // sec_cnb_pryj (0.88)
    criticalBottleneckCount: 0,
    corridorCapacityUtilization: 68.5,
  };

  return {
    tick: 0,
    simulatedTime: '08:30 IST',
    activeScenarioId: 'NORMAL_OPERATIONS',
    metrics,
    trains,
    sections,
    metadata: {
      version: '1.0.0',
      lastUpdated: Date.now(),
      mode: 'SIMULATION',
    },
  };
}

/**
 * Format simulated time from tick number
 */
function formatSimulatedTime(tick: number): string {
  const baseMinutes = 8 * 60 + 30; // 08:30
  const currentMinutes = (baseMinutes + tick * 3) % (24 * 60);
  const hours = Math.floor(currentMinutes / 60)
    .toString()
    .padStart(2, '0');
  const mins = (currentMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins} IST`;
}

/**
 * SimulationEngine Singleton
 * Authoritative single mutator of RailSutra OperationalState
 */
export class SimulationEngine {
  private state: OperationalState;

  constructor(initialState?: OperationalState) {
    this.state = initialState ? JSON.parse(JSON.stringify(initialState)) : createInitialState();
  }

  /**
   * Get immutable snapshot of current operational state
   */
  public getState(): OperationalState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Advance simulation by one deterministic tick
   */
  public tick(): OperationalState {
    const nextTick = this.state.tick + 1;
    const nextTime = formatSimulatedTime(nextTick);

    // 1. Advance Trains Progress and Update Route Positions
    const updatedTrains: Record<string, TrainRuntimeState> = {};
    for (const [id, train] of Object.entries(this.state.trains)) {
      const trainCopy: TrainRuntimeState = { ...train };

      if (trainCopy.status !== 'HALTED') {
        const stepProgress = 0.1;
        trainCopy.progress = Number((trainCopy.progress + stepProgress).toFixed(2));

        if (trainCopy.progress >= 1.0) {
          const nextRouteIndex = (trainCopy.currentRouteIndex + 1) % trainCopy.routeSectionIds.length;
          trainCopy.currentRouteIndex = nextRouteIndex;
          trainCopy.currentSectionId = trainCopy.routeSectionIds[nextRouteIndex];
          trainCopy.progress = 0.0;
        }
      }

      // Update Delay Status
      if (trainCopy.delayMinutes > 15) {
        trainCopy.status = 'DELAYED';
      } else if (trainCopy.speedKmh === 0) {
        trainCopy.status = 'HALTED';
      } else {
        trainCopy.status = 'RUNNING';
      }

      updatedTrains[id] = trainCopy;
    }

    // 2. Re-evaluate Section Occupancy & Saturation Ratios
    const updatedSections: Record<string, SectionRuntimeState> = {};
    for (const [secId, section] of Object.entries(this.state.sections)) {
      const activeTrainIds = Object.values(updatedTrains)
        .filter((t) => t.currentSectionId === secId)
        .map((t) => t.id);

      const activeTrainCount = activeTrainIds.length;
      const baseLoad = activeTrainCount * 30;
      const disruptionLoad = section.isDisrupted ? 45 : 10;
      const saturationRatio = calculateVcRatio(baseLoad + disruptionLoad, section.maxDailyCapacity);
      const saturationStatus = getVcStatus(saturationRatio);

      updatedSections[secId] = {
        ...section,
        activeTrainIds,
        activeTrainCount,
        saturationRatio,
        saturationStatus,
      };
    }

    // 3. Derive Global Network Metrics
    const trainList = Object.values(updatedTrains);
    const sectionList = Object.values(updatedSections);

    const totalActiveTrains = trainList.length;
    const delayedTrainCount = trainList.filter((t) => t.status === 'DELAYED').length;
    const onTimePercentage =
      totalActiveTrains > 0
        ? Number((((totalActiveTrains - delayedTrainCount) / totalActiveTrains) * 100).toFixed(1))
        : 100;

    const saturatedSectionCount = sectionList.filter((s) => s.saturationStatus !== 'NORMAL').length;
    const criticalBottleneckCount = sectionList.filter((s) => s.saturationStatus === 'CRITICAL').length;

    const totalSaturation = sectionList.reduce((acc, s) => acc + s.saturationRatio, 0);
    const corridorCapacityUtilization =
      sectionList.length > 0 ? Number(((totalSaturation / sectionList.length) * 100).toFixed(1)) : 0;

    const networkHealthIndex = calculateNetworkHealth(
      delayedTrainCount,
      totalActiveTrains,
      saturatedSectionCount,
      sectionList.length
    );

    const updatedMetrics: NetworkMetrics = {
      networkHealthIndex,
      totalActiveTrains,
      delayedTrainCount,
      onTimePercentage,
      saturatedSectionCount,
      criticalBottleneckCount,
      corridorCapacityUtilization,
    };

    // 4. Update Engine State
    this.state = {
      tick: nextTick,
      simulatedTime: nextTime,
      activeScenarioId: this.state.activeScenarioId,
      metrics: updatedMetrics,
      trains: updatedTrains,
      sections: updatedSections,
      metadata: {
        version: '1.0.0',
        lastUpdated: Date.now(),
        mode: this.state.metadata.mode,
      },
    };

    return this.getState();
  }

  /**
   * Reset simulation state to initial deterministic baseline
   */
  public reset(): OperationalState {
    this.state = createInitialState();
    return this.getState();
  }

  /**
   * Mutate simulation state for a scenario (e.g. track disruption)
   */
  public applyScenario(scenarioId: string, overrides?: Partial<OperationalState>): OperationalState {
    if (scenarioId === 'NORMAL_OPERATIONS') {
      return this.reset();
    }

    if (scenarioId === 'FESTIVAL_SURGE') {
      const base = createInitialState();
      base.activeScenarioId = 'FESTIVAL_SURGE';
      base.sections.sec_ndls_cnb.saturationRatio = 0.92;
      base.sections.sec_ndls_cnb.saturationStatus = 'CRITICAL';
      base.sections.sec_cnb_pryj.saturationRatio = 0.95;
      base.sections.sec_cnb_pryj.saturationStatus = 'CRITICAL';
      base.metrics.saturatedSectionCount = 2;
      base.metrics.criticalBottleneckCount = 2;
      base.metrics.corridorCapacityUtilization = 78.5;
      base.metrics.networkHealthIndex = 72;
      this.state = overrides ? { ...base, ...overrides } : base;
      this.state.metadata.lastUpdated = Date.now();
      return this.getState();
    }

    if (scenarioId === 'TRACK_FAILURE_KANPUR') {
      const base = createInitialState();
      base.activeScenarioId = 'TRACK_FAILURE_KANPUR';
      base.sections.sec_cnb_pryj.isDisrupted = true;
      base.sections.sec_cnb_pryj.disruptionReason = 'Track Circuit & Point Failure at Kanpur Yard';
      base.sections.sec_cnb_pryj.saturationRatio = 0.98;
      base.sections.sec_cnb_pryj.saturationStatus = 'CRITICAL';
      base.trains.trn_12801.delayMinutes = 45;
      base.trains.trn_12801.status = 'DELAYED';
      base.trains.trn_freight_4021.delayMinutes = 60;
      base.trains.trn_freight_4021.status = 'DELAYED';
      base.metrics.delayedTrainCount = 2;
      base.metrics.onTimePercentage = 66.7;
      base.metrics.saturatedSectionCount = 1;
      base.metrics.criticalBottleneckCount = 1;
      base.metrics.networkHealthIndex = 58;
      this.state = overrides ? { ...base, ...overrides } : base;
      this.state.metadata.lastUpdated = Date.now();
      return this.getState();
    }

    this.state.activeScenarioId = scenarioId;
    if (overrides) {
      this.state = {
        ...this.state,
        ...overrides,
        metadata: {
          ...this.state.metadata,
          lastUpdated: Date.now(),
        },
      };
    }

    return this.getState();
  }
}

// Global Singleton registration across Next.js API route calls
declare global {
  // eslint-disable-next-line no-var
  var __railsutra_simulation_engine: SimulationEngine | undefined;
}

export function getSimulationEngine(): SimulationEngine {
  if (!globalThis.__railsutra_simulation_engine) {
    globalThis.__railsutra_simulation_engine = new SimulationEngine();
  }
  return globalThis.__railsutra_simulation_engine;
}
