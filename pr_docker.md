## 概要
アプリケーションのコンテナ化 (Docker化) を行い、ローカルおよびクラウド環境でのデプロイを容易にしました。

## 変更点
- **Backend Dockerfile**: Go 1.25 (Alpine) を使用したマルチステージビルド。`sqlite-libs` を含めた軽量イメージ (Alpine) を生成。
- **Frontend Dockerfile**: Vite ビルドを行い、Nginx (Alpine) で静的配信。
    - SPAルーティング対応の `nginx.conf` を追加。
- **docker-compose.yml**:
    - Backend (8080), Frontend (5173->80) を定義。
    - `dynasty-data` ボリュームで SQLite データを永続化。
- **Config**: 環境変数 `DB_PATH` に対応し、コンテナ内でボリューム上のDBを使用可能に変更。

## 動作確認 (想定)
```bash
docker compose up --build
```
で `http://localhost:5173` にアクセス可能になります。

## 関連Issue
- Closes #11
