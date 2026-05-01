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
   - `https://wardrobe-ai-backend-a3fl.onrender.com/api/health/config`
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

## 若 `/api/health/db` 回 `ENETUNREACH`

目前 Render 回傳：

```json
{
  "database": "unavailable",
  "code": "ENETUNREACH"
}
```

且 `/api/health/config` 顯示：

```json
{
  "hasDatabaseUrl": true,
  "databaseHost": "db.bnrlaxzkjvgmisadyzuw.supabase.co"
}
```

這代表 Render 已經有 `DATABASE_URL`，但目前使用的是 Supabase direct database host。Supabase direct connection 預設使用 IPv6；Render 不支援 IPv6 direct database connection 時，會出現網路不可達。

修法：

1. 到 Supabase Dashboard。
2. 打開 `Wardrobe AI` project。
3. 點 `Connect`。
4. 選 `Session pooler` connection string。
5. 複製 connection string，替換 `[YOUR-PASSWORD]`。
6. 到 Render service 的 Environment，把 `DATABASE_URL` 改成 Session pooler connection string。
7. Redeploy。

Session pooler 格式大致如下：

```text
postgres://postgres.bnrlaxzkjvgmisadyzuw:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
```

不要再使用 direct host：

```text
postgresql://postgres:[YOUR-PASSWORD]@db.bnrlaxzkjvgmisadyzuw.supabase.co:5432/postgres
```

## 既有 Render 服務設定

目前既有 Render service 的 build log 顯示 Build Command 仍是：

```bash
npm install
```

若不改 Build Command，Render 只會安裝 backend dependency，不會輸出 `mobile/dist`，手機 PWA 靜態檔可能不會跟著部署。

建議改成：

```bash
npm ci && cd mobile && npm ci && npm run build:web
```

Start Command 維持：

```bash
npm start
```
