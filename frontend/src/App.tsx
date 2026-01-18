import { useState } from 'react'
import { SimulationChart } from './components/dashboard/SimulationChart'
import { ControlPanel } from './components/dashboard/ControlPanel'

interface YearlyModifier {
  year: number;
  drift_mod: number;
  volatility_mod: number;
}

function App() {
  const [data, setData] = useState<number[][]>([])
  const [modifiers, setModifiers] = useState<YearlyModifier[]>([])
  
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
      // result.Paths is in json.results_preview? No.
      // Wait, main.go only returned results_preview (single float) and paths_count.
      // It did NOT return the full paths to save bandwidth in the previous step verification!
      // I need to update backend/main.go to return full paths if I want to draw them.
      // Or at least return "paths" field.
      // Currently backend returns: result.Paths[0][last] as preview.
      // We need to FIX BACKEND to return data for chart.
      
      // Temporary check: If backend doesn't return paths, chart won't work.
      // I should assume I need to fix backend.
      if (json.paths) {
          setData(json.paths)
      } else {
          // Fallback or alert if backend isn't ready
          console.warn("No paths returned from backend. Check main.go")
      }
    } catch (e) {
        console.error(e)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          Project Dynasty
        </h1>
        <p className="text-gray-400">High-Performance Asset Simulation</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ControlPanel 
            onAnalyze={handleAnalyze} 
            onRun={handleRun}
            isAnalyzing={isAnalyzing}
            isRunning={isRunning}
            modifiers={modifiers}
          />
        </div>
        
        <div className="lg:col-span-2">
          <SimulationChart data={data} />
        </div>
      </div>
    </div>
  )
}

export default App
