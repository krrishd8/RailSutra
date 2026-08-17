export type TrainType = 'SUPERFAST' | 'EXPRESS' | 'PASSENGER' | 'FREIGHT';
export type TrainStatus = 'RUNNING' | 'HALTED' | 'DELAYED';
export type SaturationStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface TrainRuntimeState {
  id: string;
  number: string;
  name: string;
  type: TrainType;
  currentSectionId: string;
  progress: number; // 0.0 to 1.0 (representing position along section)
  speedKmh: number;
  maxSpeedKmh: number;
  status: TrainStatus;
  delayMinutes: number;
  routeSectionIds: string[];
  currentRouteIndex: number;
}

export interface SectionRuntimeState {
  id: string;
  name: string;
  corridorId: string;
  maxDailyCapacity: number;
  activeTrainIds: string[];
  activeTrainCount: number;
  saturationRatio: number;
  saturationStatus: SaturationStatus;
  isDisrupted: boolean;
  disruptionReason?: string;
}

export interface NetworkMetrics {
  networkHealthIndex: number; // 0 - 100
  totalActiveTrains: number;
  delayedTrainCount: number;
  onTimePercentage: number;
  saturatedSectionCount: number;
  criticalBottleneckCount: number;
  corridorCapacityUtilization: number;
}

export interface OperationalState {
  tick: number;
  simulatedTime: string;
  activeScenarioId: string;
  metrics: NetworkMetrics;
  trains: Record<string, TrainRuntimeState>;
  sections: Record<string, SectionRuntimeState>;
  metadata: {
    version: string;
    lastUpdated: number;
    mode: 'SIMULATION' | 'DEMO';
  };
}
