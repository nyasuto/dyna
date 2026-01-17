package simulation

import (
	"fmt"
	"math"
	"runtime"
	"sync"
	"time"
)

// Run executes a dummy simulation to stress the CPU.
func Run() {
	// Ensure we use all available cores
	numCPU := runtime.NumCPU()
	runtime.GOMAXPROCS(numCPU)

	fmt.Printf("Starting simulation engine on %d cores...\n", numCPU)

	var wg sync.WaitGroup
	wg.Add(numCPU)

	// Launch goroutines to create CPU load
	for i := 0; i < numCPU; i++ {
		go func(id int) {
			defer wg.Done()
			
			// Busy loop for 3 seconds to simulate heavy calculation
			start := time.Now()
			for time.Since(start) < 3*time.Second {
				// Perform some floating point math to keep ALUs busy
				_ = math.Sqrt(float64(id) * 3.14159)
			}
		}(i)
	}

	wg.Wait()
	fmt.Println("Simulation burst complete.")
}
