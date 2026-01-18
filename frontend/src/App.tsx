import { useState } from 'react'
import { SimulationChart } from './components/dashboard/SimulationChart'
import { ControlPanel } from './components/dashboard/ControlPanel'
import { HistoryPanel } from './components/dashboard/HistoryPanel'
import { RiskStats } from './components/dashboard/RiskStats'

interface YearlyModifier {
  year: number;
  drift_mod: number;
  volatility_mod: number;
}

function App() {
  const [data, setData] = useState<number[][]>([])
  const [modifiers, setModifiers] = useState<YearlyModifier[]>([])
  const [riskMetrics, setRiskMetrics] = useState<any>(null)
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const handleAnalyze = async (scenario: string) => {
    setIsAnalyzing(true)
    try {
      const res = await fetch('http://localhost:8080/api/oracle/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      })
      const json = await res.json()
      if (json.modifiers) {
        setModifiers(json.modifiers)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRun = async (jumpParams: { jump_intensity: number; jump_mean: number; jump_std_dev: number }) => {
    setIsRunning(true)
    try {
      const res = await fetch('http://localhost:8080/api/simulation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_price: 1000000,
          years: 30,
          num_paths: 200, 
          modifiers: modifiers,
          ...jumpParams
        }),
      })
      const json = await res.json()
      
      if (json.paths) {
          setData(json.paths)
      } else {
          console.warn("No paths returned from backend.")
      }

      if (json.risk_metrics) {
        setRiskMetrics(json.risk_metrics)
      }
    } catch (e) {
        console.error(e)
    } finally {
      setIsRunning(false)
    }
  }

  const handleLoadConfig = (config: any) => {
    if (config.modifiers) {
        setModifiers(config.modifiers);
    }
    console.log("Loaded config:", config);
    alert("Modifiers loaded!");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          Project Dynasty
        </h1>
        <p className="text-gray-400">High-Performance Asset Simulation</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
        <div className="lg:col-span-1 flex flex-col gap-6 h-full overflow-hidden">
          <div className="flex-1 min-h-0">
             <ControlPanel 
                onAnalyze={handleAnalyze} 
                onRun={handleRun}
                isAnalyzing={isAnalyzing}
                isRunning={isRunning}
                modifiers={modifiers}
              />
          </div>
          <div className="flex-1 min-h-0">
             <HistoryPanel onLoadConfig={handleLoadConfig} />
          </div>
        </div>
        
        <div className="lg:col-span-3 h-full flex flex-col gap-6">
          <div className="flex-1 min-h-0 bg-gray-800 rounded-xl p-4 border border-gray-700">
             <SimulationChart data={data} />
          </div>
          <div>
            <RiskStats metrics={riskMetrics} initialValue={1000000} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
