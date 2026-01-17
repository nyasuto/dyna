import type { SimulationPath, ChartDataPoint, HistogramBin } from '../types/simulation';

/**
 * Transform simulation paths into Recharts line chart format
 */
export const transformPathsToChartData = (paths: SimulationPath[]): ChartDataPoint[] => {
  if (!paths || paths.length === 0) return [];

  const firstPath = paths[0];
  const chartData: ChartDataPoint[] = [];

  // For each time point
  for (let i = 0; i < firstPath.times.length; i++) {
    const dataPoint: ChartDataPoint = {
      time: firstPath.times[i],
    };

    // Add price for each path
    paths.forEach((path) => {
      dataPoint[`path_${path.path_id}`] = path.prices[i];
    });

    chartData.push(dataPoint);
  }

  return chartData;
};

/**
 * Create histogram bins from final prices
 */
export const createHistogramData = (
  finalPrices: number[],
  numBins: number = 30
): HistogramBin[] => {
  if (!finalPrices || finalPrices.length === 0) return [];

  const min = Math.min(...finalPrices);
  const max = Math.max(...finalPrices);
  const binWidth = (max - min) / numBins;

  const bins: HistogramBin[] = [];

  for (let i = 0; i < numBins; i++) {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    const count = finalPrices.filter(
      (price) => price >= binStart && price < binEnd
    ).length;

    bins.push({
      bin: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
      count,
      range: [binStart, binEnd],
    });
  }

  return bins;
};

/**
 * Generate random colors for paths
 */
export const generatePathColors = (numPaths: number): string[] => {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];

  const pathColors: string[] = [];
  for (let i = 0; i < numPaths; i++) {
    pathColors.push(colors[i % colors.length]);
  }

  return pathColors;
};

/**
 * Format number for display
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};