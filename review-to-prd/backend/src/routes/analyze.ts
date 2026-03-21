import { Router, Request, Response } from 'express';
import { analyzeWithAI } from '../services/ai';
import { getUserIdFromToken } from '../lib/auth';
import { AnalyzeRequest } from '../types';
import { query } from '../lib/db';

const router = Router();

// POST /api/analyze
router.post('/', async (req: Request, res: Response) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Enforce Freemium limit: 3 analyses per month
        try {
            const countResult = await query(
                `SELECT count(*) as count FROM analyses 
                 WHERE user_id = $1 
                 AND date_trunc('month', analyzed_at) = date_trunc('month', now())`,
                [userId]
            );
            
            const currentCount = parseInt(countResult.rows[0].count, 10) || 0;
            if (currentCount >= 3) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'LIMIT_REACHED', 
                    message: 'You have reached your free limit of 3 analyses this month. Upgrade to Pro for unlimited access.' 
                });
            }
        } catch (dbError) {
            console.error('Error checking analysis limit:', dbError);
            // In case of local fallback without full schema support, allow it to pass or handle gracefully
        }

        const { reviews, manualText, appInfo }: AnalyzeRequest = req.body;

        if (!manualText && (!reviews || reviews.length === 0)) {
            return res.status(400).json({
                success: false,
                error: 'Either reviews or manual text is required for analysis',
            });
        }

        console.log(`[analyze] ${reviews?.length || 0} reviews, userId: ${userId}`);
        const result = await analyzeWithAI(reviews || [], appInfo, manualText, userId);
        return res.json(result);
    } catch (err: any) {
        console.error('[analyze] Error:', err.message);
        return res.status(500).json({ success: false, error: 'Internal server error during analysis' });
    }
});

export default router;
