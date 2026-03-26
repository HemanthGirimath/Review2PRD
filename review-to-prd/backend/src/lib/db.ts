import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;
const usePostgres = !!connectionString;

const JSON_DB_PATH = path.join(__dirname, '../../data/db.json');

// Ensure data directory exists
const dataDir = path.dirname(JSON_DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize JSON DB if missing
if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify({ analyses: [], settings: [] }, null, 2));
}

let pool: Pool | null = null;
if (usePostgres) {
    console.log('[db] Using Postgres database');
    pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
} else {
    console.log('[db] No DATABASE_URL found. Using local JSON storage: ' + JSON_DB_PATH);
}

export async function query(text: string, params: any[] = []) {
    if (pool) {
        try {
            return await pool.query(text, params);
        } catch (err: any) {
            if (err.code === 'ECONNREFUSED' || err.message.includes('ECONNREFUSED')) {
                console.warn('[db] Postgres connection refused. Falling back to JSON storage for this session.');
                pool = null; // Disable for future calls to avoid repeated timeouts
            } else {
                throw err;
            }
        }
    }

    // JSON Fallback logic...
    const db = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
    if (!db.settings) db.settings = []; // Migration for existing files
    
    if (text.includes('INSERT INTO waitlist')) {
        const [email] = params;
        if (!db.waitlist) db.waitlist = [];
        const exists = db.waitlist.find((w: any) => w.email === email);
        if (exists) {
            return { rowCount: 0 };
        }
        const newRow = { id: Math.random().toString(36).substring(2, 15), email, created_at: new Date().toISOString() };
        db.waitlist.push(newRow);
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(db, null, 2));
        return { rowCount: 1, rows: [newRow] };
    }

    if (text.includes('INSERT INTO analyses')) {
        const [user_id, app_name, platform, input_value, input_mode, prd, issues, ticket_cache] = params;
        const newRow = {
            id: Math.random().toString(36).substring(2, 15),
            user_id,
            app_name,
            platform,
            input_value,
            input_mode,
            prd: typeof prd === 'string' ? JSON.parse(prd) : prd,
            issues: typeof issues === 'string' ? JSON.parse(issues) : issues,
            ticket_cache: typeof ticket_cache === 'string' ? JSON.parse(ticket_cache) : ticket_cache,
            analyzed_at: new Date().toISOString()
        };
        db.analyses.push(newRow);
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(db, null, 2));
        return { rows: [newRow] };
    }

    if (text.includes('SELECT * FROM analyses')) {
        const [userId] = params;
        const rows = db.analyses
            .filter((a: any) => a.user_id === userId)
            .sort((a: any, b: any) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime())
            .slice(0, 20);
        return { rows };
    }

    if (text.includes('DELETE FROM analyses')) {
        const [id, userId] = params;
        db.analyses = db.analyses.filter((a: any) => !(a.id === id && a.user_id === userId));
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(db, null, 2));
        return { rowCount: 1 };
    }

    // Settings logic
    if (text.includes('SELECT * FROM user_settings') || text.includes('SELECT ai_provider')) {
        const [userId] = params;
        const row = db.settings.find((s: any) => s.user_id === userId);
        return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
    }

    if (text.includes('INSERT INTO user_settings') || text.includes('UPSERT') || text.includes('ON CONFLICT')) {
        const [user_id, ai_provider, ai_model, api_key, base_url] = params;
        const index = db.settings.findIndex((s: any) => s.user_id === user_id);
        const existing = index > -1 ? db.settings[index] : {};
        const newRow = { 
            user_id, 
            ai_provider, 
            ai_model, 
            api_key, 
            base_url, 
            plan_type: existing.plan_type || 'free',
            updated_at: new Date().toISOString() 
        };
        if (index > -1) {
            db.settings[index] = newRow;
        } else {
            db.settings.push(newRow);
        }
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(db, null, 2));
        return { rows: [newRow] };
    }

    throw new Error('Unsupported JSON fallback query: ' + text);
}
