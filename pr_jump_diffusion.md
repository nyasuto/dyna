## 概要
シミュレーションエンジンに「ジャンプ拡散過程 (Merton Jump Diffusion Model)」を導入し、市場の暴落（Flash Crash）や急騰を再現できるようにしました。

## 変更点
### Backend
- **Config**: `JumpIntensity` (発生頻度), `JumpMean` (平均ジャンプ幅), `JumpStdDev` (分散) を追加。
- **Engine**: ポアソン過程を用いて、通常のGBMにジャンプ項を加算するロジックを実装。
    - Knuth's algorithm を使用して `Delta t` (1年) 間のジャンプ回数をシミュレート。

### Frontend
- **ControlPanel**: ジャンプ拡散過程のパラメータ入力欄を追加。
- **App**: 新しいパラメータをバックエンドAPIに送信するように更新。

## 関連Issue
- Closes #9
