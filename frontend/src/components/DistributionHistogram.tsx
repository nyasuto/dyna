import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { createHistogramData } from '../utils/chartHelpers';

interface DistributionHistogramProps {
  finalPrices: number[];
  numBins?: number;
  title?: string;
}

export const DistributionHistogram: React.FC<DistributionHistogramProps> = ({
  finalPrices,
  numBins = 30,
  title = 'Final Price Distribution',
}) => {
  if (!finalPrices || finalPrices.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-xl border border-gray-700">
        <p className="text-gray-400">No distribution data available</p>
      </div>
    );
  }

  const histogramData = createHistogramData(finalPrices, numBins);

  // Find the bin with max count for highlighting
  const maxCount = Math.max(...histogramData.map((bin) => bin.count));

  return (
    <div className="w-full bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={histogramData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="bin"
            label={{ value: 'Price Range ($)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
            stroke="#6b7280"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={Math.floor(histogramData.length / 10)}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
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
            formatter={(value: number) => [`Count: ${value}`, 'Frequency']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {histogramData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.count === maxCount ? '#10b981' : '#3b82f6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};