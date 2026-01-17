package main

import (
	"dynasty/simulation"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/api/simulation/start", func(c *gin.Context) {
		// Default config for now
		cfg := simulation.Config{
			StartPrice: 1000000,
			Years:      30,
			Drift:      0.05, // 5% growth
			Volatility: 0.20, // 20% volatility
			NumPaths:   1000,
		}

		// Run simulation (blocking for now to return results)
		result := simulation.Run(cfg)

		c.JSON(http.StatusOK, gin.H{
			"message":         "Simulation completed",
			"status":          "completed",
			"config":          cfg,
			"results_preview": result.Paths[0][len(result.Paths[0])-1], // Last value of first path
			"paths_count":     len(result.Paths),
		})
	})

	r.Run(":8080")
}
