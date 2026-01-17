package simulation

import (
	"math"
	"math/rand/v2"
	"runtime"
	"sync"
)

// YearlyModifier represents the adjustment for a specific year.
type YearlyModifier struct {
	Year          int     `json:"year"`
	DriftMod      float64 `json:"drift_mod"`
	VolatilityMod float64 `json:"volatility_mod"`
}

// Config holds the parameters for the simulation.
type Config struct {
	StartPrice float64          `json:"start_price"`
	Years      int              `json:"years"`
	Drift      float64          `json:"drift"`      // Annual drift (mu)
	Volatility float64          `json:"volatility"` // Annual volatility (sigma)
	NumPaths   int              `json:"num_paths"`  // Number of simulation paths
	Modifiers  []YearlyModifier `json:"modifiers"`  // Optional yearly modifiers
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

	// Base constants
	baseDrift := cfg.Drift
	baseVol := cfg.Volatility

	numCPU := runtime.NumCPU()
	runtime.GOMAXPROCS(numCPU)

	// Prepare result container
	paths := make([][]float64, cfg.NumPaths)

	var wg sync.WaitGroup
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
					// Determine year (1-based)
					year := (t-1)/stepsPerYear + 1

					d := baseDrift
					v := baseVol

					// Apply modifiers
					for _, mod := range cfg.Modifiers {
						if mod.Year == year {
							d += mod.DriftMod
							v += mod.VolatilityMod
							break
						}
					}

					// Calculate GBM step
					term := (d - 0.5*v*v) * dt
					vol := v * math.Sqrt(dt)

					z := src.NormFloat64()
					change := term + vol*z
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
