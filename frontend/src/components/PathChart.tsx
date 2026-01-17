import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SimulationPath } from '../types/simulation';
import { transformPathsToChartData, generatePathColors } from '../utils/chartHelpers';

interface PathChartProps {
  paths: SimulationPath[];
  title?: string;
}

export const PathChart: React.FC<PathChartProps> = ({ paths, title = 'Asset Price Paths' }) => {
  if (!paths || paths.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-xl border border-gray-700">
        <p className="text-gray-400">No simulation data available</p>
      </div>
    );
  }

  const chartData = transformPathsToChartData(paths);
  const pathColors = generatePathColors(paths.length);

  return (
    <div className="w-full bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            label={{ value: 'Time (years)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
            stroke="#6b7280"
            tick={{ fill: '#9ca3af' }}
          />
          <YAxis
            label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            stroke="#6b7280"
            tick={{ fill: '#9ca3af' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
          />
          <Legend 
            wrapperStyle={{ color: '#9ca3af' }}
            iconType="line"
          />
          {paths.map((path, index) => (
            <Line
              key={path.path_id}
              type="monotone"
              dataKey={`path_${path.path_id}`}
              stroke={pathColors[index]}
              dot={false}
              strokeWidth={2}
              name={`Path ${path.path_id}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};