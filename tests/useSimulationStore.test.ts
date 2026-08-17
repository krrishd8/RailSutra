import { describe, it, expect, beforeEach } from 'vitest';
import { useSimulationStore } from '../src/modules/simulation/useSimulationStore';
import { SimulationEngine } from '../src/modules/simulation/simulation.engine';

describe('useSimulationStore Client State', () => {
  beforeEach(() => {
    useSimulationStore.setState({ state: null, isLoading: true, error: null });
  });

  it('should initialize with null state and loading true', () => {
    const { state, isLoading, error } = useSimulationStore.getState();
    expect(state).toBeNull();
    expect(isLoading).toBe(true);
    expect(error).toBeNull();
  });

  it('should update operational state when setState is called', () => {
    const engine = new SimulationEngine();
    const mockState = engine.getState();

    useSimulationStore.getState().setState(mockState);

    const { state, isLoading, error } = useSimulationStore.getState();
    expect(state).not.toBeNull();
    expect(state?.tick).toBe(0);
    expect(state?.metrics.networkHealthIndex).toBe(mockState.metrics.networkHealthIndex);
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });

  it('should update error state correctly', () => {
    const testError = new Error('Network timeout');
    useSimulationStore.getState().setError(testError);

    const { error, isLoading } = useSimulationStore.getState();
    expect(error).toEqual(testError);
    expect(isLoading).toBe(false);
  });
});
