import { Router } from 'express';
import { query } from '../lib/db';
import { getUserIdFromToken } from '../lib/auth';

const router = Router();

// GET /api/analyses - List analyses for user
router.get('/', async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const result = await query(
            'SELECT * FROM analyses WHERE user_id = $1 ORDER BY analyzed_at DESC LIMIT 20',
            [userId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err: any) {
        console.error('[analyses] List error:', err.message);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// POST /api/analyses - Save new analysis
router.post('/', async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { appName, platform, inputValue, inputMode, prd, issues, ticketCache } = req.body;

        const result = await query(
            `INSERT INTO analyses 
            (user_id, app_name, platform, input_value, input_mode, prd, issues, ticket_cache)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id`,
            [userId, appName, platform, inputValue, inputMode, JSON.stringify(prd), JSON.stringify(issues), JSON.stringify(ticketCache)]
        );

        res.json({ success: true, id: result.rows[0].id });
    } catch (err: any) {
        console.error('[analyses] Save error:', err.message);
        res.status(500).json({ error: 'Failed to save analysis' });
    }
});

// DELETE /api/analyses/:id - Remove an analysis
router.delete('/:id', async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { id } = req.params;
        await query('DELETE FROM analyses WHERE id = $1 AND user_id = $2', [id, userId]);
        
        res.json({ success: true });
    } catch (err: any) {
        console.error('[analyses] Delete error:', err.message);
        res.status(500).json({ error: 'Failed to delete analysis' });
    }
});

export default router;
