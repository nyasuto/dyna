## 概要
シミュレーション結果の分布から、金融リスク管理で用いられる **VaR (Value at Risk)** と **CVaR (Conditional Value at Risk / Expected Shortfall)** を計算・表示する機能を実装しました。

## 変更点
### Backend
- **Analytics**: `backend/analytics` パッケージを新規作成。
  - `CalculateRiskMetrics`: ソートされた最終資産額の分布から、95%および99%信頼区間のVaR/CVaRを計算。
- **Engine**: シミュレーション終了時にリスク指標を計算し、`SimulationResult` に含めるように変更。
- **API**: `/api/simulation/start` のレスポンスに `risk_metrics` を追加。

### Frontend
- **RiskStats**: 新しいコンポーネントを作成し、VaR/CVaR をカード形式で表示。
- **Layout**: チャートの下部にリスク指標パネルを配置。

## 関連Issue
- Phase 4 Task #10: Risk Metrics
