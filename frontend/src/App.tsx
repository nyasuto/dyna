import { useState } from 'react'
import './index.css'

function App() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const runSimulation = async () => {
    setLoading(true)
    setStatus('Running simulation...')
    try {
      const response = await fetch('http://localhost:8080/api/simulation/start', {
        method: 'POST',
      })
      const data = await response.json()
      setStatus(data.message || 'Simulation complete')
    } catch (error) {
      console.error('Error:', error)
      setStatus('Error running simulation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          Project Dynasty
        </h1>
        
        <div className="space-y-6">
          <div className="bg-gray-900/50 rounded-lg p-4 h-32 flex items-center justify-center border border-gray-700 font-mono text-lg">
            {status || <span className="text-gray-500">Ready to simulate</span>}
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
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
          
          <p className="text-xs text-center text-gray-500">
            Powered by Mac mini M4 Pro & Gemini 2.0 Flash
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
