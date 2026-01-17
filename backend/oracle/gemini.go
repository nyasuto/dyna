package oracle

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"google.golang.org/genai"
)

// YearlyModifier represents the adjustment for a specific year.
type YearlyModifier struct {
	Year          int     `json:"year"`
	DriftMod      float64 `json:"drift_mod"`      // Additive modifier to drift (e.g. +0.02)
	VolatilityMod float64 `json:"volatility_mod"` // Multiplier or additive? Let's say additive for simplicity or multiplier?
	// Plan said "modifiers". Let's assume Drift is additive (+%), Volatility is Multiplier (*%) or Additive.
	// Let's use Additive for Drift (e.g. -0.05 for recession) and Multiplier for Volatility (e.g. 1.5x).
	// But to be safe and simple, let's use Additive for both for now, or stick to the prompt description.
	// "Drift/Volatility modifiers".
}

// AnalyzeScenario calls Gemini to generate parameters based on the scenario.
func AnalyzeScenario(ctx context.Context, scenario string) ([]YearlyModifier, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY not set")
	}

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: apiKey,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %w", err)
	}

	model := "gemini-2.0-flash-exp" // Or just "gemini-2.0-flash" if available
	// Using "gemini-2.0-flash-exp" as safe bet for latest, or "gemini-1.5-flash" if 2.0 is strict.
	// The prompt said "Google Gemini 2.0 Flash". I'll use "gemini-2.0-flash-exp".

	prompt := fmt.Sprintf(`
You are an economic scenario simulator.
Analyze the following scenario and predict the economic impact for the next 30 years.
Scenario: "%s"

Output ONLY a JSON array of objects with fields: "year" (1 to 30), "drift_mod" (float, additive change to annual growth, e.g., -0.02 for -2%%), "volatility_mod" (float, additive change to volatility, e.g., +0.10 for +10%% volatility).
Base Drift is 0.05 (5%%), Base Volatility is 0.20 (20%%).
Example: [{"year":1, "drift_mod":-0.10, "volatility_mod":0.20}, ...]
Do not include any markdown formatting or explanation. Just the JSON.
`, scenario)

	resp, err := client.Models.GenerateContent(ctx, model, genai.Text(prompt), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	if resp == nil || len(resp.Candidates) == 0 {
		return nil, fmt.Errorf("no response from Gemini")
	}

	// Extract text. The structure depends on the new SDK.
	// Usually resp.Candidates[0].Content.Parts[0].Text
	var rawJSON string
	for _, part := range resp.Candidates[0].Content.Parts {
		if part.Text != "" {
			rawJSON += part.Text
		}
	}

	// Cleanup markdown code blocks if present
	rawJSON = strings.TrimSpace(rawJSON)
	rawJSON = strings.TrimPrefix(rawJSON, "```json")
	rawJSON = strings.TrimPrefix(rawJSON, "```")
	rawJSON = strings.TrimSuffix(rawJSON, "```")

	var modifiers []YearlyModifier
	if err := json.Unmarshal([]byte(rawJSON), &modifiers); err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %w, raw: %s", err, rawJSON)
	}

	return modifiers, nil
}
