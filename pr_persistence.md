## 概要
SQLite を導入し、シミュレーション結果の保存機能 (Persistence) を実装しました。

## 変更点
### Backend
- **DB**: `backend/db` パッケージを作成し、SQLite (`dynasty.db`) を初期化。
- **Schema**: `simulations` テーブルを作成 (id, created_at, scenario, config, results)。
- **API**:
    - `POST /api/simulation/start` 成功時に結果を自動保存。
    - `GET /api/history` で過去50件のシミュレーション履歴を取得。

### Frontend
- **HistoryPanel**: 左サイドバー下部に履歴パネルを追加。
- **Integration**: 履歴をクリックすると、その時のシナリオ（Modifiers）をロード可能。

## 関連Issue
- Closes #10
