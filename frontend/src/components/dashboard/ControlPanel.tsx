import { useState } from 'react';
import { Loader2, Sparkles, Play } from 'lucide-react';
import { clsx } from 'clsx';

interface Modifier {
  year: number;
  drift_mod: number;
  volatility_mod: number;
}

// Define types
interface JumpParams {
  jump_intensity: number;
  jump_mean: number;
  jump_std_dev: number;
}

export const ControlPanel = ({ onAnalyze, onRun, isAnalyzing, isRunning, modifiers }: {
    onAnalyze: (scenario: string) => void,
    onRun: (jumpParams: JumpParams) => void,
    isAnalyzing: boolean,
    isRunning: boolean,
    modifiers: Modifier[]
}) => {
    const [scenario, setScenario] = useState('');
    
    // Jump Diffusion State
    const [jumpIntensity, setJumpIntensity] = useState(0.0); // Lambda
    const [jumpMean, setJumpMean] = useState(-0.1);          // Mean (negative usually implies crash)
    const [jumpStdDev, setJumpStdDev] = useState(0.1);       // Volatility of jump

    const handleRunClick = () => {
        onRun({
            jump_intensity: jumpIntensity,
            jump_mean: jumpMean,
            jump_std_dev: jumpStdDev
        });
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg h-full flex flex-col overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Scenario Oracle
            </h2>
            
            <textarea
                className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
                placeholder="Describe a future scenario..."
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
            />
            
            <button
                onClick={() => onAnalyze(scenario)}
                disabled={isAnalyzing || !scenario}
                className={clsx(
                    "w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all mb-6",
                    isAnalyzing ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
                )}
            >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Analyze Impact
            </button>

            {/* Jump Diffusion Controls */}
            <div className="mb-6 border-t border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Merton Jump Diffusion (Optional)</h3>
                
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Jump Intensity (Lambda) - Jumps/Year</label>
                        <input 
                            type="number" 
                            step="0.1"
                            value={jumpIntensity} 
                            onChange={e => setJumpIntensity(parseFloat(e.target.value))}
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Jump Mean</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={jumpMean} 
                                onChange={e => setJumpMean(parseFloat(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Jump StdDev</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={jumpStdDev} 
                                onChange={e => setJumpStdDev(parseFloat(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleRunClick}
                disabled={isRunning}
                className={clsx(
                    "w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all mb-4",
                    isRunning ? "bg-gray-600 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
                )}
            >
                {isRunning ? <Loader2 className="animate-spin" /> : <Play className="w-4 h-4" />}
                Run Simulation
            </button>

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
                                        {m.drift_mod > 0 ? '+' : ''}{(m.drift_mod * 100).toFixed(1)}%
                                    </span>
                                    <span className={m.volatility_mod <= 0 ? "text-green-400" : "text-orange-400"}>
                                        Vol {m.volatility_mod > 0 ? '+' : ''}{(m.volatility_mod * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm italic text-center py-4">
                        No active modifiers. Standard GBM used.
                    </div>
                )}
            </div>
        </div>
    );
};
