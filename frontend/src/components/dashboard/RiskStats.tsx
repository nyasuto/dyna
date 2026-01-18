import { AlertTriangle } from 'lucide-react';

interface RiskMetrics {
  var_95: number;
  var_99: number;
  cvar_95: number;
  cvar_99: number;
}

interface Props {
  metrics: RiskMetrics | null;
  initialValue: number;
}

export const RiskStats = ({ metrics, initialValue }: Props) => {
  if (!metrics) return null;

  // Helpers to format percentage loss relative to initial value
  // VaR is an absolute price value in the backend logic?
  // backend/analytics/risk.go: CalculateRiskMetrics takes finalValues (prices).
  // So VaR95 is the PRICE at the 5th percentile.
  // We usually want to show Risk as "Potential Loss" amount or %.
  // Loss = InitialPrice - VaRPrice.
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  }

  const calculateLoss = (metricPrice: number) => {
    const loss = initialValue - metricPrice;
    const lossPct = (loss / initialValue) * 100;
    return { loss, lossPct };
  }

  const renderCard = (title: string, price: number, color: string) => {
    const { loss, lossPct } = calculateLoss(price);
    // If price > initial, it's actually a gain (negative risk?), but VaR focuses on the tail.
    // If even the 5th percentile is a gain, then risk is 0 (or "Gain").
    const isGain = loss < 0;

    return (
      <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${color} shadow-lg`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <AlertTriangle className={`w-4 h-4 ${isGain ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          {formatCurrency(price)}
        </div>
        <div className={`text-sm flex items-center gap-1 ${isGain ? 'text-green-400' : 'text-red-400'}`}>
           {isGain ? '+' : '-'}{Math.abs(lossPct).toFixed(2)}% ({formatCurrency(Math.abs(loss))})
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {renderCard("VaR 95% (Confidence)", metrics.var_95, "border-l-4 border-l-orange-500")}
      {renderCard("CVaR 95% (Exp. Shortfall)", metrics.cvar_95, "border-l-4 border-l-red-500")}
      {renderCard("VaR 99% (High Confidence)", metrics.var_99, "border-l-4 border-l-orange-600")}
      {renderCard("CVaR 99% (Extreme Tail)", metrics.cvar_99, "border-l-4 border-l-red-600")}
    </div>
  );
};
