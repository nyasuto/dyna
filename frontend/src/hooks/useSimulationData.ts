import { useState, useCallback } from 'react';
import type { SimulationResult, SimulationParams } from '../types/simulation';

interface UseSimulationDataReturn {
  data: SimulationResult | null;
  loading: boolean;
  error: string | null;
  runSimulation: (params: SimulationParams) => Promise<void>;
}

export const useSimulationData = (): UseSimulationDataReturn => {
  const [data, setData] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = useCallback(async (params: SimulationParams) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with your actual backend URL
      const response = await fetch('http://localhost:8000/api/simulate/gbm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SimulationResult = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    runSimulation,
  };
};