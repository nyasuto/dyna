import { useEffect, useState } from 'react';
import { Clock, RefreshCcw } from 'lucide-react';

interface HistoryItem {
  id: number;
  created_at: string;
  scenario: string;
  config: string; // JSON string
  summary: string; // JSON string
}

interface Props {
  onLoadConfig: (config: any) => void;
}

export const HistoryPanel = ({ onLoadConfig }: Props) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/history');
      const json = await res.json();
      if (json.history) {
        setHistory(json.history);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          History
        </h2>
        <button onClick={fetchHistory} className="text-gray-400 hover:text-white transition-colors">
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-auto space-y-3">
        {history.map((item) => {
          let config: any = {};
          let summary: any = {};
          try {
            config = JSON.parse(item.config);
            summary = JSON.parse(item.summary);
          } catch (e) {}

          return (
            <div key={item.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer group"
                onClick={() => onLoadConfig(config)}
            >
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{new Date(item.created_at).toLocaleString()}</span>
                <span>#{item.id}</span>
              </div>
              <div className="text-sm font-medium text-white mb-2 truncate">
                {item.scenario || "Manual Simulation"}
              </div>
              <div className="flex justify-between text-xs text-gray-300">
                <span>Paths: {summary.paths_count || config.num_paths}</span>
                <span>Vol: {(config.volatility * 100).toFixed(1)}%</span>
              </div>
              <div className="mt-2 text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Click to Load Config
              </div>
            </div>
          );
        })}
        {history.length === 0 && (
            <div className="text-gray-500 text-center py-4">No history found.</div>
        )}
      </div>
    </div>
  );
};
