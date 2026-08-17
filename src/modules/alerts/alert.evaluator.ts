import { OperationalState } from '@/modules/simulation/simulation.types';
import { AlertItem, AlertSeverity } from './alert.types';

// Global singleton set for acknowledged alert IDs across Next.js process
declare global {
  // eslint-disable-next-line no-var
  var __railsutra_acknowledged_alerts: Set<string> | undefined;
}

function getAcknowledgedSet(): Set<string> {
  if (!globalThis.__railsutra_acknowledged_alerts) {
    globalThis.__railsutra_acknowledged_alerts = new Set<string>();
  }
  return globalThis.__railsutra_acknowledged_alerts;
}

/**
 * Acknowledge an alert by ID
 */
export function acknowledgeAlert(alertId: string): boolean {
  const ackSet = getAcknowledgedSet();
  ackSet.add(alertId);
  return true;
}

/**
 * Get all acknowledged alert IDs
 */
export function getAcknowledgedAlerts(): string[] {
  return Array.from(getAcknowledgedSet());
}

/**
 * Reset all acknowledgements (used in scenario resets)
 */
export function resetAlertAcknowledgements(): void {
  const ackSet = getAcknowledgedSet();
  ackSet.clear();
}

const SEVERITY_WEIGHT: Record<AlertSeverity, number> = {
  CRITICAL: 3,
  WARNING: 2,
  INFO: 1,
};

/**
 * Evaluates active alerts deterministically from OperationalState.
 * PURE with respect to OperationalState.
 */
export function evaluateAlerts(
  state: OperationalState,
  ackSet: Set<string> = getAcknowledgedSet()
): AlertItem[] {
  const alerts: AlertItem[] = [];
  const timestamp = state.simulatedTime || '08:30 IST';

  // 1. Evaluate Section Disruptions and Congestion Thresholds
  for (const section of Object.values(state.sections)) {
    if (section.isDisrupted) {
      alerts.push({
        id: `alert_disruption_${section.id}`,
        severity: 'CRITICAL',
        category: 'DISRUPTION',
        title: `Disruption on ${section.name}`,
        message: `Track/Signal failure reported: ${section.disruptionReason || 'Disruption active'}. Section capacity severely degraded.`,
        sectionCode: section.id,
        timestamp,
        isAcknowledged: ackSet.has(`alert_disruption_${section.id}`),
      });
    } else if (section.saturationRatio >= 0.9) {
      alerts.push({
        id: `alert_saturation_crit_${section.id}`,
        severity: 'CRITICAL',
        category: 'CONGESTION',
        title: `Severe Track Saturation on ${section.name}`,
        message: `V/C ratio reached ${section.saturationRatio} with ${section.activeTrainCount} trains in section. Immediate spacing required.`,
        sectionCode: section.id,
        timestamp,
        isAcknowledged: ackSet.has(`alert_saturation_crit_${section.id}`),
      });
    } else if (section.saturationRatio >= 0.7) {
      alerts.push({
        id: `alert_saturation_warn_${section.id}`,
        severity: 'WARNING',
        category: 'CONGESTION',
        title: `Moderate Saturation on ${section.name}`,
        message: `V/C ratio elevated at ${section.saturationRatio} with ${section.activeTrainCount} active trains.`,
        sectionCode: section.id,
        timestamp,
        isAcknowledged: ackSet.has(`alert_saturation_warn_${section.id}`),
      });
    }
  }

  // 2. Evaluate Train Delays
  for (const train of Object.values(state.trains)) {
    if (train.delayMinutes >= 30) {
      alerts.push({
        id: `alert_delay_crit_${train.id}`,
        severity: 'CRITICAL',
        category: 'DISRUPTION',
        title: `Severe Delay: Train #${train.number} (${train.name})`,
        message: `Running ${train.delayMinutes} mins behind schedule on section ${train.currentSectionId}.`,
        sectionCode: train.currentSectionId,
        timestamp,
        isAcknowledged: ackSet.has(`alert_delay_crit_${train.id}`),
      });
    } else if (train.delayMinutes >= 15) {
      alerts.push({
        id: `alert_delay_warn_${train.id}`,
        severity: 'WARNING',
        category: 'CONGESTION',
        title: `Moderate Delay: Train #${train.number} (${train.name})`,
        message: `Delay of ${train.delayMinutes} mins recorded on section ${train.currentSectionId}.`,
        sectionCode: train.currentSectionId,
        timestamp,
        isAcknowledged: ackSet.has(`alert_delay_warn_${train.id}`),
      });
    }
  }

  // 3. Evaluate Network Health Index
  if (state.metrics.networkHealthIndex < 75) {
    alerts.push({
      id: 'alert_nhi_degraded',
      severity: 'WARNING',
      category: 'CONGESTION',
      title: `Network Health Degraded (${state.metrics.networkHealthIndex}/100)`,
      message: `System-wide on-time punctuality is ${state.metrics.onTimePercentage}% with ${state.metrics.saturatedSectionCount} congested sections.`,
      timestamp,
      isAcknowledged: ackSet.has('alert_nhi_degraded'),
    });
  }

  // 4. Informational Weather / Sensor Monitoring Alert
  alerts.push({
    id: 'alert_weather_thermal_monitoring',
    severity: 'INFO',
    category: 'WEATHER',
    title: 'Northern Plains Thermal Risk Monitoring Active',
    message: 'Continuous track expansion telemetry active for New Delhi–Kanpur line.',
    sectionCode: 'sec_ndls_cnb',
    timestamp,
    isAcknowledged: ackSet.has('alert_weather_thermal_monitoring'),
  });

  // Sort descending by severity (CRITICAL -> WARNING -> INFO), unacknowledged first
  return alerts.sort((a, b) => {
    if (a.isAcknowledged !== b.isAcknowledged) {
      return a.isAcknowledged ? 1 : -1;
    }
    return SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
  });
}
