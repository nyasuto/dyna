# Project Dynasty: AI-Driven High-Performance Asset Simulator

## 概要
Google Gemini 2.0 Flash が生成する「定性的な市場シナリオ（物語）」を、Go言語の強力な並列処理エンジンで「定量的な資産推移」に変換するハイブリッド・シミュレーター。
Mac mini M4 Pro (14 cores) のCPUリソースを100%活用し、数億回の試行を数秒で完了させることを目指す。

## アーキテクチャ

### 1. Simulation Engine (Go)
- **Parallelism**: `runtime.NumCPU()` を使用し、全コアでGoroutineを並列稼働させる。
- **Core Logic**: 幾何ブラウン運動 (GBM) をベースに、Geminiから注入された「年次バイアス（Drift/Volatilityの補正）」を適用する。
- **API Server**: シミュレーション結果をフロントエンドに配信するRESTまたはWebSocketサーバー。

### 2. Scenario Oracle (Go + Gemini API)
- **Model**: `gemini-2.0-flash`
- **Function**: ユーザーの自然言語入力（例：「第三次世界大戦が起きた場合」「AIが労働を代替した場合」）を解析し、30年分の経済パラメータ変動係数をJSONで生成する。

### 3. Dashboard (React + Vite)
- **Real-time Visualization**: バックエンドの計算状況と結果分布（ヒストグラム/ヒートマップ）を可視化。
- **Control Panel**: シナリオ入力と実行ボタン。

## 技術スタック
- **Backend**: Go 1.23, Gin, Gonum
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts
- **AI**: Google Generative AI SDK for Go (`gemini-2.0-flash`)

## 開発ルール (For Antigravity Agents)
- **Performance First**: Goのコードはアロケーションを最小限に抑え、CPUキャッシュ効率を意識すること。
- **Interactive**: シミュレーションはブラウザ（Antigravity Preview）から制御可能にすること。