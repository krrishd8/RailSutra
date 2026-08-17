import { OperationalState } from '@/modules/simulation/simulation.types';
import { AiQueryResponse, AiActionRecommendation } from './ai.types';

/**
 * Deterministic local fallback provider for RailSutra AI Assistant.
 * Generates operational, structured responses directly from live OperationalState.
 */
export function generateFallbackResponse(
  query: string,
  state: OperationalState
): AiQueryResponse {
  const q = query.toLowerCase();
  const timestamp = state.simulatedTime || '08:30 IST';

  const delayedTrains = Object.values(state.trains).filter((t) => t.status === 'DELAYED');
  const congestedSections = Object.values(state.sections).filter(
    (s) => s.saturationRatio >= 0.7 || s.isDisrupted
  );
  const disruptedSections = Object.values(state.sections).filter((s) => s.isDisrupted);

  let answer = '';
  const recommendations: AiActionRecommendation[] = [];

  if (q.includes('kanpur') || q.includes('bottleneck') || q.includes('congestion') || q.includes('traffic')) {
    const topSection = congestedSections[0] || state.sections['sec_cnb_pryj'] || Object.values(state.sections)[0];
    answer = `**Operational Bottleneck Brief (${timestamp})**:
- **Critical Section**: ${topSection?.name || 'Kanpur–Prayagraj'} (Section ID: \`${topSection?.id}\`)
- **Current Saturation**: Volume-to-Capacity ratio is **${topSection?.saturationRatio || '0.88'}** with ${topSection?.activeTrainCount || 2} active trains in section.
- **Active Trains**: ${topSection?.activeTrainIds.join(', ') || 'Purushottam Express (12801), Coal Freight Rake (4021)'}.
- **Traffic Impact**: Moderate congestion may propagate downstream toward Pt. Deen Dayal Upadhyaya Junction if headway spacing is not regulated.`;

    recommendations.push(
      {
        type: 'SPEED_REGULATION',
        title: 'Regulate Section Entry Speed',
        description: 'Impose temporary caution order (90 km/h) on trailing rakes entering Kanpur Central to equalize headway.',
        sectionOrRouteId: topSection?.id,
      },
      {
        type: 'DISPATCH_TIMING',
        title: 'Stage Freight at Loop Line',
        description: 'Divert Coal Freight #4021 into Kanpur goods loop to clear mainline path for Superfast 12301.',
        sectionOrRouteId: 'trn_freight_4021',
      }
    );
  } else if (q.includes('demand') || q.includes('festival') || q.includes('chhath') || q.includes('puja') || q.includes('special')) {
    answer = `**Festival Passenger Demand Intelligence Brief (${timestamp})**:
- **Peak Corridors**: Delhi–Howrah Main Trunk (\`cor_ndls_hwh\`) experiencing **+280%** to **+350%** seasonal waitlist surge for upcoming Durga Puja / Chhath festival window.
- **Capacity Gap**: Estimated corridor seat shortage is **~4,600 passengers/day** across New Delhi $\\rightarrow$ Howrah and New Delhi $\\rightarrow$ Prayagraj/Patna routes.
- **Recommended Action**: Deploy 4 additional special train services (2 Superfast, 2 Express rakes) to eliminate platform overcrowding.`;

    recommendations.push(
      {
        type: 'SPECIAL_TRAIN',
        title: 'Deploy NDLS–HWH Superfast Special #02301',
        description: 'Schedule 22-coach clone rake departing NDLS at 22:00 IST to absorb peak Purvanchal passenger traffic.',
        sectionOrRouteId: 'cor_ndls_hwh',
      },
      {
        type: 'SPECIAL_TRAIN',
        title: 'Augment Coach Capacity on Purushottam Express',
        description: 'Attach 2 additional Sleeper and 1 3-Tier AC coach on Train #12801.',
        sectionOrRouteId: 'trn_12801',
      }
    );
  } else if (q.includes('delay') || q.includes('delayed') || q.includes('punctual') || q.includes('time')) {
    answer = `**Train Punctuality & Delay Analysis (${timestamp})**:
- **On-Time Performance**: **${state.metrics.onTimePercentage}%** across all running trunk services.
- **Delayed Trains (${delayedTrains.length})**:
${
  delayedTrains.length > 0
    ? delayedTrains
        .map(
          (t) =>
            `  - **#${t.number} (${t.name})**: +${t.delayMinutes}m delay on section \`${t.currentSectionId}\` (Speed: ${t.speedKmh} km/h)`
        )
        .join('\n')
    : '  - No severe delays (>15m) currently active. All trains running within green signal parameters.'
}`;

    if (delayedTrains.length > 0) {
      recommendations.push({
        type: 'DISPATCH_TIMING',
        title: `Priority Green Wave for Train #${delayedTrains[0].number}`,
        description: `Grant priority signal clearing across upcoming junction blocks to recover lost schedule time.`,
        sectionOrRouteId: delayedTrains[0].id,
      });
    }
  } else if (q.includes('reroute') || q.includes('failure') || q.includes('disruption')) {
    const isDisrupted = disruptedSections.length > 0;
    answer = `**Disruption & Re-routing Protocol (${timestamp})**:
- **Disruption Status**: ${
      isDisrupted
        ? `⚠️ **Active Disruption** on \`${disruptedSections[0].name}\` (${disruptedSections[0].disruptionReason || 'Signal/Track fault'}).`
        : '✅ All primary corridors operating with normal signaling & track availability.'
    }
- **Alternative Routing**: Lucknow loop corridor (\`SEC_LKO_SLN\`) and Grand Chord bypass available with +22m travel delta.`;

    recommendations.push({
      type: 'REROUTE',
      title: 'Initiate Dynamic Freight Diversion',
      description: 'Route non-priority freight traffic via Lucknow bypass to preserve main line express slots.',
      sectionOrRouteId: 'cor_ndls_hwh',
    });
  } else {
    // Default comprehensive overview
    answer = `**RailSutra Operational Brief (${timestamp})**:
- **Network Health Index**: **${state.metrics.networkHealthIndex} / 100** (Status: ${
      state.metrics.networkHealthIndex >= 80 ? 'Nominal' : 'Warning'
    })
- **Active Trains**: ${state.metrics.totalActiveTrains} services (${state.metrics.delayedTrainCount} delayed >15m)
- **Track Saturation**: ${state.metrics.saturatedSectionCount} sections approaching or above 70% capacity utilization.
- **Top Priority**: Monitor ${congestedSections[0]?.name || 'Kanpur–Prayagraj'} for potential bottleneck development.`;

    recommendations.push({
      type: 'SPEED_REGULATION',
      title: 'Maintain Standard Headway Controls',
      description: 'Ensure automated block signaling spacing is adhered to across Northern & Eastern corridors.',
    });
  }

  return {
    answer,
    provider: 'FALLBACK_LOCAL',
    recommendations,
    contextSummary: {
      networkHealth: state.metrics.networkHealthIndex,
      activeBottlenecks: state.metrics.criticalBottleneckCount + state.metrics.saturatedSectionCount,
      delayedTrains: state.metrics.delayedTrainCount,
      simulatedTime: timestamp,
    },
    timestamp,
  };
}
