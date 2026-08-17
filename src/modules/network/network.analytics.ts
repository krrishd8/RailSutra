import { OperationalState, SectionRuntimeState, TrainRuntimeState } from '@/modules/simulation/simulation.types';
import { SectionAnalytics, CorridorAnalytics, NetworkAnalyticsSummary } from './network.types';
import { getVcStatus } from '@/shared/utils/math';

const CORRIDOR_NAMES: Record<string, string> = {
  cor_ndls_hwh: 'Delhi–Howrah Main Trunk Corridor',
  cor_mmct_ndls: 'Mumbai–Delhi Western Trunk Corridor',
};

/**
 * Analyze an individual section for saturation and bottlenecks
 */
export function analyzeSection(
  section: SectionRuntimeState,
  trains: Record<string, TrainRuntimeState>
): SectionAnalytics {
  const activeTrainNumbers = section.activeTrainIds
    .map((id) => trains[id]?.number || id)
    .filter(Boolean);

  const isBottleneck = section.saturationRatio >= 0.85 || section.isDisrupted;
  const status = getVcStatus(section.saturationRatio);

  let recommendation: string | undefined;
  if (section.isDisrupted) {
    recommendation = `CRITICAL: Disruption active on ${section.name}. Initiate dynamic freight re-routing and speed regulation.`;
  } else if (section.saturationRatio >= 0.9) {
    recommendation = `Severe track saturation (V/C ${section.saturationRatio}). Increase train headway spacing to prevent cascade halts.`;
  } else if (section.saturationRatio >= 0.7) {
    recommendation = `Moderate congestion (V/C ${section.saturationRatio}). Monitor station dwell times.`;
  }

  return {
    sectionId: section.id,
    name: section.name,
    corridorId: section.corridorId,
    activeTrainCount: section.activeTrainCount,
    maxDailyCapacity: section.maxDailyCapacity,
    saturationRatio: section.saturationRatio,
    status,
    isBottleneck,
    isDisrupted: section.isDisrupted,
    disruptionReason: section.disruptionReason,
    activeTrainNumbers,
    recommendation,
  };
}

/**
 * Group and aggregate sections into corridor-level capacity utilization metrics
 */
export function analyzeCorridors(sectionAnalytics: SectionAnalytics[]): CorridorAnalytics[] {
  const corridorGroups = new Map<string, SectionAnalytics[]>();

  for (const sec of sectionAnalytics) {
    const list = corridorGroups.get(sec.corridorId) || [];
    list.push(sec);
    corridorGroups.set(sec.corridorId, list);
  }

  const corridors: CorridorAnalytics[] = [];

  for (const [corridorId, sections] of corridorGroups.entries()) {
    const sectionCount = sections.length;
    const totalActiveTrains = sections.reduce((acc, s) => acc + s.activeTrainCount, 0);
    const sumSaturation = sections.reduce((acc, s) => acc + s.saturationRatio, 0);
    const averageSaturationRatio =
      sectionCount > 0 ? Number((sumSaturation / sectionCount).toFixed(2)) : 0;

    const bottleneckSectionCount = sections.filter((s) => s.isBottleneck).length;
    const congestedSectionIds = sections
      .filter((s) => s.status !== 'NORMAL')
      .map((s) => s.sectionId);

    corridors.push({
      corridorId,
      name: CORRIDOR_NAMES[corridorId] || corridorId,
      sectionCount,
      totalActiveTrains,
      averageSaturationRatio,
      status: getVcStatus(averageSaturationRatio),
      bottleneckSectionCount,
      congestedSectionIds,
    });
  }

  // Rank corridors descending by average saturation ratio
  return corridors.sort((a, b) => b.averageSaturationRatio - a.averageSaturationRatio);
}

/**
 * Generate full network bottleneck and capacity analytics summary from OperationalState.
 * PURE READ-ONLY function: Does not mutate state.
 */
export function analyzeNetwork(state: OperationalState): NetworkAnalyticsSummary {
  const sectionsList = Object.values(state.sections);
  const sectionAnalyticsList = sectionsList.map((sec) => analyzeSection(sec, state.trains));

  // Rank congested sections descending by saturation ratio
  const rankedCongestedSections = [...sectionAnalyticsList].sort(
    (a, b) => b.saturationRatio - a.saturationRatio
  );

  // Extract bottlenecks (V/C >= 0.85 or disrupted)
  const bottlenecks = rankedCongestedSections.filter((sec) => sec.isBottleneck);

  // Analyze corridor aggregations
  const rankedCorridors = analyzeCorridors(sectionAnalyticsList);

  return {
    networkHealthIndex: state.metrics.networkHealthIndex,
    totalActiveTrains: state.metrics.totalActiveTrains,
    delayedTrainCount: state.metrics.delayedTrainCount,
    onTimePercentage: state.metrics.onTimePercentage,
    corridorUtilizationPercent: state.metrics.corridorCapacityUtilization,
    bottlenecks,
    rankedCongestedSections,
    rankedCorridors,
    simulatedTime: state.simulatedTime,
    tick: state.tick,
  };
}
