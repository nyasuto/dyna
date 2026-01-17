export interface SimulationParams {
    S0: number;           // Initial stock price
    mu: number;           // Drift (expected return)
    sigma: number;        // Volatility
    T: number;            // Time horizon (years)
    dt: number;           // Time step
    num_paths: number;    // Number of simulation paths
  }
  
  export interface SimulationPath {
    path_id: number;
    times: number[];
    prices: number[];
  }
  
  export interface SimulationResult {
    params: SimulationParams;
    paths: SimulationPath[];
    final_prices: number[];
    statistics: {
      mean: number;
      median: number;
      std: number;
      min: number;
      max: number;
    };
  }
  
  export interface ChartDataPoint {
    time: number;
    [key: string]: number; // Dynamic keys for multiple paths (path_0, path_1, etc.)
  }
  
  export interface HistogramBin {
    bin: string;
    count: number;
    range: [number, number];
  }