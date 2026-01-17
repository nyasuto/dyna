## 概要
シミュレーション結果を可視化するダッシュボード機能（Frontend）を実装しました。
また、可視化に必要なデータを返すようバックエンドAPIも拡張しました。

## 変更点
### Frontend
- **ライブラリ追加**: `recharts` (グラフ描画), `lucide-react` (アイコン), `@tailwindcss/postcss` (ビルド修正).
- **コンポーネント実装**:
    - `SimulationChart`: GBMのパス（最初の50本）と平均値を描画。
    - `ControlPanel`: シナリオ入力とパラメータ分析（Oracle）、実行ボタンを集約。
- **UI更新**: `App.tsx` を3カラムレイアウトに刷新。

### Backend
- **API拡張**: `/api/simulation/start` のレスポンスに `paths` (全シミュレーションパス) を追加。

## 動作確認
- `npm run build` が正常に完了することを確認。
- ローカル環境で「Analyze」→「Run」のフローが動作し、グラフが描画されることを想定。

## 関連Issue
- Closes #4 (Frontend Visualization)
