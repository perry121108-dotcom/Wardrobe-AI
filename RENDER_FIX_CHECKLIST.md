# WARDROBE AI Render 修復清單

## 目前診斷結果

- 本機程式正常
- 本機 `.env` 正常
- 本機 `/api/meta/seasons` 正常
- 本機 `/api/health/db` 正常
- Render 線上 `/api/test` 正常
- Render 線上 `/api/meta/seasons` 仍然回 `500`

這代表目前剩下的問題高度可能在 Render 端：

- `DATABASE_URL` 錯誤
- 線上部署版本不是目前本機這版
- Render 環境變數不完整
- Render 服務尚未重新部署到最新 backend 狀態

## 修復步驟

1. 使用目前 `D:\WARDROBE AI` 的程式碼重新部署 Render backend
2. 確認 Render 環境變數存在且正確：
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `PORT`
3. 部署後驗證：
   - `/api/test`
   - `/api/health/db`
   - `/api/meta/seasons`
4. 以上三個都正常後，再測試：
   - register
   - login
   - wardrobe fetch

## 預期結果

- `/api/test` => `200`
- `/api/health/db` => `200`
- `/api/meta/seasons` => `200`
- 登入畫面不再只顯示籠統的伺服器失敗
- 手機使用外部網路開啟正式 PWA URL 時，推薦頁、冷啟動畫面、個人設定與衣櫥頁可正常瀏覽

## 與第 1 週計畫的關係

這個修復工作屬於你 30 天計畫第 1 週的核心，因為 `WARDROBE AI` 是你最主要的展示專案。

## 手機隨身展示驗收標準

這個 Render 修復不只是為了讓 API 不報錯，而是為了讓 WARDROBE AI 成為可隨身展示的作品：

1. 手機瀏覽器可直接開啟正式網址，不需要開本機 server。
2. 首頁 / PWA 靜態檔可正常載入。
3. `/api/test`、`/api/health/db`、`/api/meta/seasons` 都回 `200`。
4. 展示模式或登入後流程可進入核心畫面。
5. 在外部網路測試通過後，才把 GitHub README 的 Demo URL 標成正式可展示。
