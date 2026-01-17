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
		// Run the simulation logic
		go simulation.Run() // Run in background to answer request quickly, or blocking?
		// User asked for "Run Simulation button press -> hit backend -> hello dynasty".
		// Let's block for a moment to show work, or just return.
		// Since the sim is 3 seconds, let's just trigger it.
		// But re-reading: "Run Simulation" button -> "Run and show Hello Dynasty".
		// I will make it blocking for the 3 seconds so the user 'feels' the work, or just return immediately.
		// The requirement is "Sotsu kakunin" (Connection check) displaying "Hello Dynasty".
		// I'll return "Hello Dynasty" immediately and run the heavy task in background/parallel
		// so the UI feels responsive, OR block to show "Processing".
		// Given it's a "simulation", blocking might be more realistic for a simple test.
		// I'll make it blocking for now as it's simpler to verify "work done".
		simulation.Run()

		c.JSON(http.StatusOK, gin.H{
			"message": "Hello Dynasty",
			"status":  "completed",
		})
	})

	r.Run(":8080")
}
