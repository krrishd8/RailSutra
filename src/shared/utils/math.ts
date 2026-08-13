/**
 * Calculate Volume-to-Capacity (V/C) Saturation Ratio
 */
export function calculateVcRatio(activeTrains: number, maxCapacity: number): number {
  if (maxCapacity <= 0) return 0;
  return Number((activeTrains / maxCapacity).toFixed(2));
}

/**
 * Format saturation status color code
 */
export function getVcStatus(vcRatio: number): 'NORMAL' | 'WARNING' | 'CRITICAL' {
  if (vcRatio >= 0.9) return 'CRITICAL';
  if (vcRatio >= 0.7) return 'WARNING';
  return 'NORMAL';
}

/**
 * Calculate Network Health Index (0 - 100)
 */
export function calculateNetworkHealth(
  delayedTrains: number,
  totalTrains: number,
  saturatedSections: number,
  totalSections: number
): number {
  if (totalTrains <= 0 || totalSections <= 0) return 100;

  const delayRatio = delayedTrains / totalTrains;
  const saturationRatio = saturatedSections / totalSections;

  const health = 100 - delayRatio * 40 - saturationRatio * 40;
  return Math.max(0, Math.min(100, Math.round(health)));
}
