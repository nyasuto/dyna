package main

import (
	"dynasty/db"
	"dynasty/oracle"
	"dynasty/simulation"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Initialize Database
	db.Init("dynasty.db")

	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

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
		var cfg simulation.Config
		// Bind JSON if sent, otherwise use defaults
		if err := c.ShouldBindJSON(&cfg); err != nil {
			// If invalid JSON, return error
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Fill defaults if missing
		if cfg.NumPaths == 0 {
			cfg.NumPaths = 1000
		}
		if cfg.Years == 0 {
			cfg.Years = 30
		}
		if cfg.StartPrice == 0 {
			cfg.StartPrice = 1000000
		}
		if cfg.Volatility == 0 {
			cfg.Volatility = 0.20
		}
		if cfg.Drift == 0 {
			cfg.Drift = 0.05
		}

		// Run simulation
		result := simulation.Run(cfg)

		c.JSON(http.StatusOK, gin.H{
			"message":         "Simulation completed",
			"status":          "completed",
			"config":          cfg,
			"results_preview": result.Paths[0][len(result.Paths[0])-1],
			"paths_count":     len(result.Paths),
			"paths":           result.Paths,
		})

		// Save to DB (Async to not block response? Or sync is fine for SQLite)
		// Summary: just saving paths_count and last value for now, or maybe full Result if we want.
		// Let's save a summary map.
		summary := map[string]interface{}{
			"paths_count":        len(result.Paths),
			"last_value_preview": result.Paths[0][len(result.Paths[0])-1],
		}
		// Scenario is not in Config currently... user passed scenario to /analyze, but /start just gets params.
		// We could pass scenario text in Config if we want to track it?
		// For now, save "" if not provided.
		go func() {
			if err := db.SaveSimulation("", cfg, summary); err != nil {
				log.Printf("Failed to save simulation: %v", err)
			}
		}()
	})

	r.GET("/api/history", func(c *gin.Context) {
		history, err := db.GetHistory()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"history": history})
	})

	r.POST("/api/oracle/analyze", func(c *gin.Context) {
		type Request struct {
			Scenario string `json:"scenario"`
		}
		var req Request
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		mods, err := oracle.AnalyzeScenario(c.Request.Context(), req.Scenario)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"modifiers": mods,
		})
	})

	r.Run(":8080")
}
