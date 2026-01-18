package analytics

import (
	"math"
	"sort"
)

type RiskMetrics struct {
	VaR95  float64 `json:"var_95"`
	VaR99  float64 `json:"var_99"`
	CVaR95 float64 `json:"cvar_95"`
	CVaR99 float64 `json:"cvar_99"`
}

// CalculateRiskMetrics computes VaR and CVaR from final asset prices.
// Note: simulationResults should be the FINAL value of each path (not the whole path).
func CalculateRiskMetrics(finalValues []float64) RiskMetrics {
	if len(finalValues) == 0 {
		return RiskMetrics{}
	}

	// Make a copy to sort
	sorted := make([]float64, len(finalValues))
	copy(sorted, finalValues)
	sort.Float64s(sorted)

	n := len(sorted)

	// VaR Indices (5th percentile = index for 95% confidence)
	idx95 := int(math.Floor(0.05 * float64(n)))
	idx99 := int(math.Floor(0.01 * float64(n)))

	// Ensure indices are within bounds
	if idx95 < 0 {
		idx95 = 0
	}
	if idx99 < 0 {
		idx99 = 0
	}

	var95 := sorted[idx95]
	var99 := sorted[idx99]

	// CVaR (Expected Shortfall) - Mean of values below VaR index
	// CVaR (Expected Shortfall) - Mean of values below VaR index
	cvar95_slice_end := int(math.Max(1, float64(idx95+1)))
	cvar99_slice_end := int(math.Max(1, float64(idx99+1)))

	return RiskMetrics{
		VaR95:  var95,
		VaR99:  var99,
		CVaR95: calculateMean(sorted[:cvar95_slice_end]),
		CVaR99: calculateMean(sorted[:cvar99_slice_end]),
	}
}

func calculateMean(values []float64) float64 {
	if len(values) == 0 {
		return 0
	}
	sum := 0.0
	for _, v := range values {
		sum += v
	}
	return sum / float64(len(values))
}
