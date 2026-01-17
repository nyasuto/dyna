import { useState } from 'react';
import { Loader2, Sparkles, Play } from 'lucide-react';
import { clsx } from 'clsx';

interface Modifier {
  year: number;
  drift_mod: number;
  volatility_mod: number;
}

export const ControlPanel = ({ onAnalyze, onRun, isAnalyzing, isRunning, modifiers }: {
    onAnalyze: (scenario: string) => void,
    onRun: () => void,
    isAnalyzing: boolean,
    isRunning: boolean,
    modifiers: Modifier[]
}) => {
    const [scenario, setScenario] = useState('');

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Scenario Oracle
            </h2>
            
            <textarea
                className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
                placeholder="Describe a future scenario (e.g., 'AI singularity occurs in 2030, boosting productivity but increasing market volatility')"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
            />
            
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => onAnalyze(scenario)}
                    disabled={isAnalyzing || !scenario}
                    className={clsx(
                        "flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
                        isAnalyzing ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
                    )}
                >
                    {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Analyze Impact
                </button>
                <button
                    onClick={onRun}
                    disabled={isRunning} // Can run even if no mods (default)
                    className={clsx(
                        "flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
                        isRunning ? "bg-gray-600 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
                    )}
                >
                    {isRunning ? <Loader2 className="animate-spin" /> : <Play className="w-4 h-4" />}
                    Run Simulation
                </button>
            </div>

            {/* Modifiers Preview */}
            <div className="flex-1 overflow-auto">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                    Predicted Economic Impact
                </h3>
                {modifiers.length > 0 ? (
                    <div className="space-y-2">
                        {modifiers.slice(0, 5).map((m) => (
                            <div key={m.year} className="flex justify-between text-sm bg-gray-700/50 p-2 rounded">
                                <span className="text-gray-300">Year {m.year}</span>
                                <div className="flex gap-4">
                                    <span className={m.drift_mod >= 0 ? "text-green-400" : "text-red-400"}>
                                        Growth: {m.drift_mod > 0 ? '+' : ''}{(m.drift_mod * 100).toFixed(1)}%
                                    </span>
                                    <span className={m.volatility_mod <= 0 ? "text-green-400" : "text-orange-400"}>
                                        Vol: {m.volatility_mod > 0 ? '+' : ''}{(m.volatility_mod * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                        {modifiers.length > 5 && (
                            <div className="text-center text-xs text-gray-500 mt-2">
                                ...and {modifiers.length - 5} more years
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm italic text-center py-4">
                        No active modifiers. Standard GBM parameters will be used.
                    </div>
                )}
            </div>
        </div>
    );
};
