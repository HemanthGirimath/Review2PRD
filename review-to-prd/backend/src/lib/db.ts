import { Pool } from 'pg';

// Connection string will be provided by Railway as DATABASE_URL
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/review2prd';

export const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
        console.log('[db] executed query', { text, duration, rows: res.rowCount });
    }
    return res;
}
