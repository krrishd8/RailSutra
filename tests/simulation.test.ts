import { describe, it, expect, beforeEach } from 'vitest';
import { SimulationEngine, getSimulationEngine } from '../src/modules/simulation/simulation.engine';

describe('SimulationEngine & Shared Operational State', () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    engine = new SimulationEngine();
  });

  it('should initialize with correct initial operational state', () => {
    const state = engine.getState();
    expect(state.tick).toBe(0);
    expect(state.simulatedTime).toBe('08:30 IST');
    expect(state.activeScenarioId).toBe('NORMAL_OPERATIONS');
    expect(state.metrics.networkHealthIndex).toBeGreaterThanOrEqual(0);
    expect(state.metrics.networkHealthIndex).toBeLessThanOrEqual(100);
    expect(Object.keys(state.trains).length).toBe(6);
    expect(Object.keys(state.sections).length).toBe(6);
  });

  it('should progress deterministically on each tick', () => {
    const initialState = engine.getState();
    const tick1 = engine.tick();

    expect(tick1.tick).toBe(1);
    expect(tick1.simulatedTime).toBe('08:33 IST');
    expect(tick1.metadata.lastUpdated).toBeGreaterThanOrEqual(initialState.metadata.lastUpdated);

    const tick2 = engine.tick();
    expect(tick2.tick).toBe(2);
    expect(tick2.simulatedTime).toBe('08:36 IST');
  });

  it('should update train progress along sections and transition across routes', () => {
    const trainId = 'trn_12301';
    const initialTrain = engine.getState().trains[trainId];
    const initialProgress = initialTrain.progress;

    const nextState = engine.tick();
    const progressedTrain = nextState.trains[trainId];

    expect(progressedTrain.progress).toBeCloseTo(initialProgress + 0.1, 2);

    // Advance multiple ticks to test section route transition
    for (let i = 0; i < 10; i++) {
      engine.tick();
    }

    const futureState = engine.getState();
    const futureTrain = futureState.trains[trainId];
    expect(futureTrain.progress).toBeGreaterThanOrEqual(0.0);
    expect(futureTrain.progress).toBeLessThan(1.0);
    expect(futureTrain.routeSectionIds).toContain(futureTrain.currentSectionId);
  });

  it('should recalculate section occupancy and metrics correctly', () => {
    const state = engine.tick();
    
    // Check that section activeTrainCount matches activeTrainIds length
    for (const section of Object.values(state.sections)) {
      expect(section.activeTrainCount).toBe(section.activeTrainIds.length);
      expect(section.saturationRatio).toBeGreaterThanOrEqual(0);
      expect(['NORMAL', 'WARNING', 'CRITICAL']).toContain(section.saturationStatus);
    }

    // Network metrics validation
    expect(state.metrics.totalActiveTrains).toBe(Object.keys(state.trains).length);
    expect(state.metrics.delayedTrainCount).toBeGreaterThanOrEqual(0);
    expect(state.metrics.networkHealthIndex).toBeGreaterThanOrEqual(0);
    expect(state.metrics.networkHealthIndex).toBeLessThanOrEqual(100);
  });

  it('should maintain singleton instance identity across invocations', () => {
    const singleton1 = getSimulationEngine();
    const singleton2 = getSimulationEngine();
    expect(singleton1).toBe(singleton2);

    const initialTick = singleton1.getState().tick;
    singleton2.tick();
    expect(singleton1.getState().tick).toBe(initialTick + 1);
  });

  it('should reset state cleanly', () => {
    engine.tick();
    engine.tick();
    expect(engine.getState().tick).toBe(2);

    const resetState = engine.reset();
    expect(resetState.tick).toBe(0);
    expect(resetState.simulatedTime).toBe('08:30 IST');
  });

  it('should apply FESTIVAL_SURGE scenario correctly', () => {
    const surgeState = engine.applyScenario('FESTIVAL_SURGE');
    expect(surgeState.activeScenarioId).toBe('FESTIVAL_SURGE');
    expect(surgeState.sections.sec_ndls_cnb.saturationRatio).toBeGreaterThanOrEqual(0.9);
    expect(surgeState.sections.sec_cnb_pryj.saturationRatio).toBeGreaterThanOrEqual(0.9);
    expect(surgeState.metrics.criticalBottleneckCount).toBeGreaterThanOrEqual(1);
  });

  it('should apply TRACK_FAILURE_KANPUR scenario correctly', () => {
    const failureState = engine.applyScenario('TRACK_FAILURE_KANPUR');
    expect(failureState.activeScenarioId).toBe('TRACK_FAILURE_KANPUR');
    expect(failureState.sections.sec_cnb_pryj.isDisrupted).toBe(true);
    expect(failureState.sections.sec_cnb_pryj.saturationRatio).toBeGreaterThanOrEqual(0.95);
    expect(failureState.trains.trn_12801.status).toBe('DELAYED');
    expect(failureState.metrics.networkHealthIndex).toBeLessThan(75);
  });
});
