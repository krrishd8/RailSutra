'use client';

import { create } from 'zustand';
import useSWR from 'swr';
import { OperationalState } from './simulation.types';

interface SimulationStoreState {
  state: OperationalState | null;
  isLoading: boolean;
  error: Error | null;
  setState: (state: OperationalState) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useSimulationStore = create<SimulationStoreState>((set) => ({
  state: null,
  isLoading: true,
  error: null,
  setState: (state) => set({ state, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));

const fetcher = async (url: string): Promise<OperationalState> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch simulation state: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
};

/**
 * Hook to poll simulation state periodically and synchronize with the client Zustand store.
 * @param pollIntervalMs Interval in milliseconds (default 2000ms)
 */
export function useSimulationPoller(pollIntervalMs: number = 2000) {
  const { setState, setError, state: storedState } = useSimulationStore();

  const { data, error, isLoading, mutate } = useSWR<OperationalState>(
    '/api/simulation/state',
    fetcher,
    {
      refreshInterval: pollIntervalMs,
      revalidateOnFocus: true,
      dedupingInterval: 1000,
      onSuccess: (fetchedState) => {
        setState(fetchedState);
      },
      onError: (err) => {
        setError(err);
      },
    }
  );

  const triggerTick = async () => {
    try {
      const res = await fetch('/api/simulation/tick', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setState(json.data);
        mutate(json.data, false);
      }
    } catch (err) {
      console.error('Error triggering simulation tick:', err);
    }
  };

  const applyScenario = async (scenarioId: string, overrides?: Partial<OperationalState>) => {
    try {
      const res = await fetch('/api/simulation/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId, overrides }),
      });
      if (res.ok) {
        const json = await res.json();
        setState(json.data);
        mutate(json.data, false);
      }
    } catch (err) {
      console.error('Error applying scenario:', err);
    }
  };

  return {
    state: data || storedState,
    error,
    isLoading: isLoading && !storedState,
    triggerTick,
    applyScenario,
    refresh: mutate,
  };
}
