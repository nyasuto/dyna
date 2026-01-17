package simulation

import (
	"math"
	"math/rand/v2"
	"runtime"
	"sync"
)

// Config holds the parameters for the simulation.
type Config struct {
	StartPrice float64 `json:"start_price"`
	Years      int     `json:"years"`
	Drift      float64 `json:"drift"`      // Annual drift (mu)
	Volatility float64 `json:"volatility"` // Annual volatility (sigma)
	NumPaths   int     `json:"num_paths"`  // Number of simulation paths
}

// Result holds the output of the simulation.
type Result struct {
	Paths [][]float64 `json:"paths"` // [PathIndex][TimeStep]
}

// Run executes the GBM simulation.
func Run(cfg Config) Result {
	// Defaults
	if cfg.NumPaths == 0 {
		cfg.NumPaths = 1000
	}
	if cfg.Years == 0 {
		cfg.Years = 30
	}

	// Simulation parameters
	stepsPerYear := 1 // Yearly steps for now
	totalSteps := cfg.Years * stepsPerYear
	dt := 1.0 / float64(stepsPerYear)

	// Pre-calculate constants
	driftTerm := (cfg.Drift - 0.5*cfg.Volatility*cfg.Volatility) * dt
	volBlob := cfg.Volatility * math.Sqrt(dt)

	numCPU := runtime.NumCPU()
	runtime.GOMAXPROCS(numCPU)

	// Prepare result container
	// Note: For very large NumPaths, we might want to aggregate stats instead of storing all paths
	// to save memory. For now, we store all.
	paths := make([][]float64, cfg.NumPaths)

	var wg sync.WaitGroup
	// Chunk processing
	chunkSize := (cfg.NumPaths + numCPU - 1) / numCPU

	for i := 0; i < numCPU; i++ {
		start := i * chunkSize
		end := start + chunkSize
		if end > cfg.NumPaths {
			end = cfg.NumPaths
		}
		if start >= end {
			break
		}

		wg.Add(1)
		go func(s, e int) {
			defer wg.Done()

			// Per-goroutine random source for v2
			src := rand.New(rand.NewPCG(rand.Uint64(), rand.Uint64()))

			for idx := s; idx < e; idx++ {
				path := make([]float64, totalSteps+1)
				path[0] = cfg.StartPrice
				current := cfg.StartPrice

				for t := 1; t <= totalSteps; t++ {
					// GBM Geometric Brownian Motion
					// S_t = S_{t-1} * exp( (mu - 0.5*sigma^2)*dt + sigma*sqrt(dt)*Z )
					z := src.NormFloat64()
					change := driftTerm + volBlob*z
					current *= math.Exp(change)
					path[t] = current
				}
				paths[idx] = path
			}
		}(start, end)
	}

	wg.Wait()

	return Result{Paths: paths}
}
