import { describe, it, expect, beforeEach } from 'vitest';
import {
  evaluateAlerts,
  acknowledgeAlert,
  getAcknowledgedAlerts,
  resetAlertAcknowledgements,
} from '../src/modules/alerts/alert.evaluator';
import { SimulationEngine } from '../src/modules/simulation/simulation.engine';
import { OperationalState } from '../src/modules/simulation/simulation.types';

describe('Smart Alert Evaluator', () => {
  beforeEach(() => {
    resetAlertAcknowledgements();
  });

  it('should generate alerts deterministically from initial operational state', () => {
    const engine = new SimulationEngine();
    const state = engine.getState();
    const alerts = evaluateAlerts(state);

    expect(alerts.length).toBeGreaterThan(0);
    // Should contain at least 1 weather info alert and 1 congestion warning from seed
    expect(alerts.some((a) => a.severity === 'INFO' && a.category === 'WEATHER')).toBe(true);
    expect(alerts.some((a) => a.severity === 'WARNING')).toBe(true);
  });

  it('should generate CRITICAL alert when a section is disrupted', () => {
    const engine = new SimulationEngine();
    const state = engine.getState();

    // Introduce disruption in memory copy
    const modifiedState: OperationalState = {
      ...state,
      sections: {
        ...state.sections,
        sec_cnb_pryj: {
          ...state.sections.sec_cnb_pryj,
          isDisrupted: true,
          disruptionReason: 'Signal Failure at Substation',
        },
      },
    };

    const alerts = evaluateAlerts(modifiedState);
    const disruptionAlert = alerts.find((a) => a.id === 'alert_disruption_sec_cnb_pryj');

    expect(disruptionAlert).toBeDefined();
    expect(disruptionAlert?.severity).toBe('CRITICAL');
    expect(disruptionAlert?.category).toBe('DISRUPTION');
    expect(disruptionAlert?.message).toContain('Signal Failure at Substation');
  });

  it('should generate CRITICAL alert when section saturation exceeds 0.90', () => {
    const engine = new SimulationEngine();
    const state = engine.getState();

    const saturatedState: OperationalState = {
      ...state,
      sections: {
        ...state.sections,
        sec_ndls_cnb: {
          ...state.sections.sec_ndls_cnb,
          saturationRatio: 0.94,
          activeTrainCount: 4,
        },
      },
    };

    const alerts = evaluateAlerts(saturatedState);
    const critSaturationAlert = alerts.find((a) => a.id === 'alert_saturation_crit_sec_ndls_cnb');

    expect(critSaturationAlert).toBeDefined();
    expect(critSaturationAlert?.severity).toBe('CRITICAL');
    expect(critSaturationAlert?.message).toContain('0.94');
  });

  it('should generate delay alerts for delayed trains', () => {
    const engine = new SimulationEngine();
    const state = engine.getState();

    const delayedState: OperationalState = {
      ...state,
      trains: {
        ...state.trains,
        trn_12301: {
          ...state.trains.trn_12301,
          delayMinutes: 45,
          status: 'DELAYED',
        },
      },
    };

    const alerts = evaluateAlerts(delayedState);
    const trainDelayAlert = alerts.find((a) => a.id === 'alert_delay_crit_trn_12301');

    expect(trainDelayAlert).toBeDefined();
    expect(trainDelayAlert?.severity).toBe('CRITICAL');
    expect(trainDelayAlert?.title).toContain('12301');
    expect(trainDelayAlert?.message).toContain('45 mins');
  });

  it('should handle alert acknowledgement correctly', () => {
    const engine = new SimulationEngine();
    const state = engine.getState();
    const targetAlertId = 'alert_weather_thermal_monitoring';

    acknowledgeAlert(targetAlertId);
    expect(getAcknowledgedAlerts()).toContain(targetAlertId);

    const alerts = evaluateAlerts(state);
    const ackedAlert = alerts.find((a) => a.id === targetAlertId);
    expect(ackedAlert?.isAcknowledged).toBe(true);
  });
});
