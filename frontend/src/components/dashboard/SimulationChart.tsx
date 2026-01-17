import { useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';

export const SimulationChart = ({ data }: { data: number[][] }) => {
  // Transform data for Recharts
  // Recharts expects array of objects: [{year: 0, path0: 100, path1: 100, ...}, ...]
  
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const steps = data[0].length;
    // Downsample if needed? For now we assume yearly or just take all steps.
    // If simulation step is 1 year, steps = years + 1 (including year 0)
    
    const formatted = [];
    for (let t = 0; t < steps; t++) {
      const point: any = { year: t };
      
      // Calculate stats for CI
      let sum = 0;
      let sqSum = 0;
      const count = data.length;
      
      data.forEach((path, idx) => {
        // Draw first 50 paths only to save performance
        if (idx < 50) {
           point[`path${idx}`] = path[t];
        }
        sum += path[t];
        sqSum += path[t] * path[t];
      });
      
      const mean = sum / count;
      const variance = (sqSum / count) - (mean * mean);
      const stdDev = Math.sqrt(variance);
      
      point.mean = mean;
      point.upper = mean + 2 * stdDev;
      point.lower = Math.max(0, mean - 2 * stdDev);
      
      formatted.push(point);
    }
    
    return formatted;
  }, [data]);

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4">Asset Projection (30 Years)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="year" 
            stroke="#9CA3AF" 
            label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            width={80}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
            formatter={(value: any) => [`$${Number(value).toFixed(0)}`, 'Value'] as [string, string]}
            labelFormatter={(label) => `Year ${label}`}
          />
          
          {/* Confidence Interval Area */}
           <defs>
            <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="upper" 
            stroke="none" 
            fill="url(#ciGradient)" 
          />
          <Area 
             type="monotone" 
             dataKey="lower" 
             stroke="none" 
             fill="transparent" 
             // We overlap upper area over lower to create band? No, Area chart stacks or not.
             // Recharts Area doesn't support 'range' easily in one component unless stacked.
             // Trick: Draw 'upper' with fill, then draw 'lower' with background color fill to mask? 
             // Or better: Use 'mean' line and error bars?
             // Let's keep it simple: Draw Mean line + Individual paths.
             // Area is tricky without 'RangeArea'.
          />
          
          {/* Render individual paths */}
          {Array.from({ length: Math.min(data.length, 50) }).map((_, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={`path${idx}`}
              stroke="#60A5FA"
              strokeWidth={1}
              strokeOpacity={0.15}
              dot={false}
              activeDot={false}
              isAnimationActive={false} // Performance
            />
          ))}

          {/* Mean Line */}
          <Line
            type="monotone"
            dataKey="mean"
            stroke="#34D399"
            strokeWidth={3}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
