export interface NetworkKpis {
  networkHealthIndex: number; // 0 - 100
  totalActiveTrains: number;
  onTimePercentage: number;
  activeBottlenecks: number;
  criticalAlerts: number;
  corridorCapacityUtilization: number; // %
  simulatedTime: string;
}
