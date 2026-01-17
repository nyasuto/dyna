import { useState } from 'react';
import { useSimulationData } from '../hooks/useSimulationData';
import { PathChart } from './PathChart';
import { DistributionHistogram } from './DistributionHistogram';
import type { SimulationParams } from '../types/simulation';

export const AssetDashboard: React.FC = () => {
  const { data, loading, error, runSimulation } = useSimulationData();

  const [params, setParams] = useState<SimulationParams>({
    S0: 100,
    mu: 0.1,
    sigma: 0.2,
    T: 1,
    dt: 0.01,
    num_paths: 10,
  });

  const handleInputChange = (field: keyof SimulationParams, value: string) => {
    setParams((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleRunSimulation = () => {
    runSimulation(params);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
            Project Dynasty
          </h1>
          <p className="text-gray-400">Asset Price Simulation Dashboard</p>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Simulation Parameters
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Initial Price (S₀)
              </label>
              <input
                type="number"
                value={params.S0}
                onChange={(e) => handleInputChange('S0', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Drift (μ)
              </label>
              <input
                type="number"
                step="0.01"
                value={params.mu}
                onChange={(e) => handleInputChange('mu', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Volatility (σ)
              </label>
              <input
                type="number"
                step="0.01"
                value={params.sigma}
                onChange={(e) => handleInputChange('sigma', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Horizon (T)
              </label>
              <input
                type="number"
                step="0.1"
                value={params.T}
                onChange={(e) => handleInputChange('T', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Step (dt)
              </label>
              <input
                type="number"
                step="0.001"
                value={params.dt}
                onChange={(e) => handleInputChange('dt', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paths
              </label>
              <input
                type="number"
                value={params.num_paths}
                onChange={(e) => handleInputChange('num_paths', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className={`mt-6 w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
              loading
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg shadow-blue-500/20'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Asset Model...
              </span>
            ) : (
              'Run Simulation'
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl backdrop-blur-sm">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {/* Statistics Panel */}
        {data && (
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
                <p className="text-sm text-gray-400 mb-1">Mean</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ${data.statistics.mean.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
                <p className="text-sm text-gray-400 mb-1">Median</p>
                <p className="text-2xl font-bold text-blue-400">
                  ${data.statistics.median.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
                <p className="text-sm text-gray-400 mb-1">Std Dev</p>
                <p className="text-2xl font-bold text-purple-400">
                  ${data.statistics.std.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
                <p className="text-sm text-gray-400 mb-1">Min</p>
                <p className="text-2xl font-bold text-red-400">
                  ${data.statistics.min.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
                <p className="text-sm text-gray-400 mb-1">Max</p>
                <p className="text-2xl font-bold text-amber-400">
                  ${data.statistics.max.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {data && (
          <div className="space-y-6">
            <PathChart paths={data.paths} />
            <DistributionHistogram finalPrices={data.final_prices} />
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="flex items-center justify-center h-96 bg-gray-800 rounded-xl border border-gray-700">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Running simulation...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="flex items-center justify-center h-96 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg">
              Set parameters and click "Run Simulation" to get started
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 pt-4">
          Powered by Mac mini M4 Pro & Gemini 2.0 Flash
        </p>
      </div>
    </div>
  );
};