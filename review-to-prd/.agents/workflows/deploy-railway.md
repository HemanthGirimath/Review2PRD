---
description: how to deploy the Review2PRD monolith to Railway
---

# Deploying Review2PRD to Railway

Follow these steps to deploy your persistent monolith to Railway.app.

### 1. Preparation
1.  **Commit Changes**: Ensure you have merged the `feature/railway-monolith` branch into `main`.
2.  **Push to GitHub**: Connect your GitHub repository to Railway.

### 2. Railway Project Setup
1.  **Create New Project**: Select "Deploy from GitHub repo".
2.  **CRITICAL: Set Root Directory**:
    - Go to **Settings** -> **General** -> **Root Directory**.
    - Set this to `review-to-prd`.
    - This tells Railway where your `package.json` is located.
3.  **Add Database**: 
    - Click "Add Service" -> "Database" -> "Add Postgres".
    - Once created, Railway automatically provides a `DATABASE_URL`.
3.  **Run SQL Migration**:
    - Connect to your Railway Postgres (via the "Data" tab or a GUI like TablePlus).
    - Execute the contents of [init-db.sql](file:///D:/GravityAgent/review-to-prd/backend/scripts/init-db.sql).

### 3. Environment Variables
Add these to your Railway Service (Variables tab):
- `DATABASE_URL`: (Auto-filled by Railway)
- `SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_ANON_KEY`: Your Supabase Anon/Public Key.
- `NODE_ENV`: set to `production`.
- `PORT`: (Auto-filled by Railway, usually 3000 or 8080).

### 4. Build Configuration
Railway will detect the root `package.json` and try to build. Ensure:
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

### 5. Verification
- Visit your Railway generated domain.
- Verify the Landing Page loads.
- Log in and verify that new analyses are saved to the persistent Postgres.
