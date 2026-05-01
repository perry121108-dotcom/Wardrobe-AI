# 手機隨身展示檢查表

正式展示網址：

`https://wardrobe-ai-backend-a3fl.onrender.com/`

API base URL：

`https://wardrobe-ai-backend-a3fl.onrender.com/api`

## 上線前必過檢查

1. Render dashboard 使用最新 GitHub commit 重新部署。
2. Render 環境變數已設定：
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NODE_ENV=production`
3. Render shell 或 Supabase SQL editor 已套用 `db/schema_final.sql`。
4. 如使用 Supabase RLS，已套用 `db/rls_supabase_fix.sql`。
5. 以下網址皆回 `200`：
   - `https://wardrobe-ai-backend-a3fl.onrender.com/api/test`
   - `https://wardrobe-ai-backend-a3fl.onrender.com/api/health/db`
   - `https://wardrobe-ai-backend-a3fl.onrender.com/api/meta/seasons`
6. 手機外部網路可開啟正式網址，不依賴本機 Wi-Fi 或 localhost。

## 手機展示流程

1. 開啟正式網址。
2. 進入推薦頁，展示場合與季節選擇。
3. 切到冷啟動推薦，說明沒有衣櫥資料也能產生色彩引導。
4. 切到個人設定，展示色彩季型、膚色底調、體型如何影響推薦。
5. 切到我的衣櫥，展示上傳衣物後會進入個人化推薦。

## 若 `/api/meta/seasons` 仍回 500

優先檢查：

1. Render 的 `DATABASE_URL` 是否指到正確資料庫。
2. `color_seasons` table 是否存在。
3. `color_seasons` 是否有 `season_key, season_name, family, undertone, clarity, keywords` 欄位。
4. 線上部署是否已經使用目前 repo 的最新 `server.js` 和 `api/routes.js`。
5. Supabase RLS 是否阻擋 anonymous / service connection 讀取參考資料表。
