VietNam Food デモ
=================

ベトナム料理を紹介するシンプルな静的デモページです。HTML/CSS/JSの学習に適しています。

ファイル
- `index.html` — メインページ
- `styles.css` — 基本スタイル
- `script.js` — サンプルデータ（`dishes` 配列）と表示ロジック

ローカルで実行する
---------

`vietnam-food` フォルダで簡単な静的サーバを立てます（Pythonを使用）：

```zsh
cd /path/to/webui-grade2/vietnam-food
python3 -m http.server 8000
```

ブラウザで開く: http://localhost:8000

注意
- 画像は Unsplash のリンクを使用しています（プレースホルダ）。オフラインで使いたい場合は `assets` フォルダの画像に差し替えてください。
- コードは簡単で、授業で変更しながら使えます。
