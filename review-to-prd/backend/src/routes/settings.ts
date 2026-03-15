import { Router } from 'express';
import { query } from '../lib/db';
import { getUserIdFromToken } from '../lib/auth';
import { testConnection } from '../services/ai';

const router = Router();

// GET /api/settings - Get user settings
router.get('/', async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const result = await query(
            'SELECT ai_provider, ai_model, api_key, base_url FROM user_settings WHERE user_id = $1',
            [userId]
        );
        
        if (result.rowCount === 0) {
            // Return default settings if none exist
            return res.json({
                success: true,
                data: {
                    ai_provider: 'ollama',
                    ai_model: 'kimi-k2.5:cloud',
                    api_key: '',
                    base_url: 'http://localhost:11434'
                }
            });
        }

        const settings = result.rows[0];
        // Don't leak full API key if not needed, or just return it for now since it's personal
        res.json({ success: true, data: settings });
    } catch (err: any) {
        console.error('[settings] Get error:', err.message);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// POST /api/settings - Update settings
router.post('/', async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { ai_provider, ai_model, api_key, base_url } = req.body;

        // Upsert logic for Postgres, JSON fallback handled in db.query
        await query(
            `INSERT INTO user_settings (user_id, ai_provider, ai_model, api_key, base_url, updated_at)
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id) DO UPDATE SET
                ai_provider = EXCLUDED.ai_provider,
                ai_model = EXCLUDED.ai_model,
                api_key = EXCLUDED.api_key,
                base_url = EXCLUDED.base_url,
                updated_at = CURRENT_TIMESTAMP`,
            [userId, ai_provider, ai_model, api_key, base_url]
        );

        res.json({ success: true });
    } catch (err: any) {
        console.error('[settings] Save error:', err.message);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// GET /api/settings/test - Test current AI connection
router.get('/test', async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const result = await testConnection(userId);
        res.json(result);
    } catch (err: any) {
        console.error('[settings] Test error:', err.message);
        res.status(500).json({ success: false, message: err.message || 'Failed to test connection' });
    }
});

export default router;
