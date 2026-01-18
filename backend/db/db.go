package db

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func Init(dbName string) {
	if dbName == "" {
		dbName = "dynasty.db"
	}

	var err error
	DB, err = sql.Open("sqlite3", dbName)
	if err != nil {
		log.Fatal(err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal(err)
	}

	createTables()
}

func createTables() {
	query := `
	CREATE TABLE IF NOT EXISTS simulations (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		scenario TEXT,
		config_json TEXT,
		result_summary_json TEXT
	);
	`
	_, err := DB.Exec(query)
	if err != nil {
		log.Fatalf("Failed to create tables: %v", err)
	}
}

type SimulationRecord struct {
	ID        int       `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Scenario  string    `json:"scenario"`
	Config    string    `json:"config"`  // JSON string
	Summary   string    `json:"summary"` // JSON string
}

func SaveSimulation(scenario string, config interface{}, summary interface{}) error {
	configJSON, err := json.Marshal(config)
	if err != nil {
		return fmt.Errorf("failed to marshal config: %w", err)
	}

	summaryJSON, err := json.Marshal(summary)
	if err != nil {
		return fmt.Errorf("failed to marshal summary: %w", err)
	}

	query := `INSERT INTO simulations (scenario, config_json, result_summary_json) VALUES (?, ?, ?)`
	_, err = DB.Exec(query, scenario, string(configJSON), string(summaryJSON))
	if err != nil {
		return fmt.Errorf("failed to insert simulation: %w", err)
	}
	return nil
}

func GetHistory() ([]SimulationRecord, error) {
	query := `SELECT id, created_at, scenario, config_json, result_summary_json FROM simulations ORDER BY created_at DESC LIMIT 50`
	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var records []SimulationRecord
	for rows.Next() {
		var r SimulationRecord
		if err := rows.Scan(&r.ID, &r.CreatedAt, &r.Scenario, &r.Config, &r.Summary); err != nil {
			return nil, err
		}
		records = append(records, r)
	}
	return records, nil
}
