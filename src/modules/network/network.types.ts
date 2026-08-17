import { SaturationStatus } from '@/modules/simulation/simulation.types';

export interface SectionAnalytics {
  sectionId: string;
  name: string;
  corridorId: string;
  activeTrainCount: number;
  maxDailyCapacity: number;
  saturationRatio: number;
  status: SaturationStatus;
  isBottleneck: boolean;
  isDisrupted: boolean;
  disruptionReason?: string;
  activeTrainNumbers: string[];
  recommendation?: string;
}

export interface CorridorAnalytics {
  corridorId: string;
  name: string;
  sectionCount: number;
  totalActiveTrains: number;
  averageSaturationRatio: number;
  status: SaturationStatus;
  bottleneckSectionCount: number;
  congestedSectionIds: string[];
}

export interface NetworkAnalyticsSummary {
  networkHealthIndex: number; // 0 - 100
  totalActiveTrains: number;
  delayedTrainCount: number;
  onTimePercentage: number;
  corridorUtilizationPercent: number;
  bottlenecks: SectionAnalytics[];
  rankedCongestedSections: SectionAnalytics[];
  rankedCorridors: CorridorAnalytics[];
  simulatedTime: string;
  tick: number;
}
