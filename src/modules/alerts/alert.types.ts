export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertCategory = 'CONGESTION' | 'DISRUPTION' | 'DEMAND' | 'WEATHER';

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  sectionCode?: string;
  timestamp: string;
  isAcknowledged: boolean;
}
