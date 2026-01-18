# AGENT.md - Project Dynasty Development Directives

## 1. Project Identity & Mission
- **Name**: Project Dynasty
- **Goal**: Mac mini M4 Pro (14 Cores, 48GB RAM) の性能限界に挑む、ハイブリッド資産シミュレーターの構築。
- **Core Philosophy**: "Performance over Abstraction". 抽象化よりも「生の計算速度」と「並列性」を最優先する。

## 2. Tech Stack & Standards

### Backend (The Engine)
- **Language**: Go 1.23+
- **Framework**: Gin (Web Server), Gonum (Matrix/Statistics)
- **AI Client**: `google-generative-ai-go` (Model: `gemini-2.0-flash`)
- **Coding Rules**:
  - **Concurrency**: `runtime.NumCPU()` を基準にGoroutineプールを設計すること。
  - **Memory**: Hot Path（計算ループ内）でのメモリアロケーションは厳禁。`sync.Pool` を積極的に使用し、GC（ガベージコレクション）の発生を抑える。
  - **Error Handling**: `panic` は禁止。全てのエラーは適切にラップしてフロントエンドに返す。

### Frontend (The Viewer)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Dark Mode default)
- **Visualization**: Recharts (for heavy data plotting)
- **Communication**: 計算進捗の表示には Polling ではなく、可能な限り SSE (Server-Sent Events) または WebSocket を検討する。
- **UX**: エンジニア向けの「コックピット」のような高密度な情報表示を好む。

## 3. Architecture & File Structure
- `/backend`: Go module root.
  - `/cmd/server`: Entry point.
  - `/pkg/engine`: Monte Carlo simulation logic (Heavy calculation).
  - `/pkg/oracle`: Gemini API integration.
- `/frontend`: Vite project root.
  - `/src/components/dashboard`: Main visualization panels.

## 4. Development Workflow (Antigravity Specific)
1. **Plan First**: コードを書く前に、必ず変更内容の概要を提示する。
2. **Step-by-Step**: バックエンドとフロントエンドを同時に変更せず、片方ずつ確実に実装する。
3. **Validation**: 実装後は必ず「期待されるCPU負荷」や「画面の挙動」を確認する手順を含める。
4. **No Placeholders**: "To Do" や "Implement Later" を残さない。小さくても動くロジックを書く。
5. **Git Workflow**:
    - `gh pr create` を実行する前に、必ず `git push -u origin <branch>` でブランチをプッシュすること。対話モードによるハングアップを防ぐため。
    - **PR作成時のルール**: `gh pr create --body "..."` の使用は禁止（改行コードが正しく扱われないため）。必ず `--body-file <file>` を使用するか、エディタを立ち上げて記述すること。
    - **クリーンアップ**: PR作成に使用した一時ファイル（`pr_*.md` など）は、作成後に必ず削除すること。プロジェクトルートを汚さないため。

## 5. Specific Constraints
- **Gemini Usage**: API呼び出しは高価なため、シミュレーションループの内側（Inner Loop）で呼んではならない。ループの前処理（Pre-calculation）として呼ぶこと。
- **Performance Testing**: コードには必ずベンチマークテスト (`_test.go` with `Benchmark` prefix) を含め、アロケーション回数 (`-benchmem`) を計測できるようにする。