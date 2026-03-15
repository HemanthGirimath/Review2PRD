import { Router, Request, Response } from 'express';
import { analyzeWithAI } from '../services/ai';
import { getUserIdFromToken } from '../lib/auth';
import { AnalyzeRequest } from '../types';

const router = Router();

// POST /api/analyze
router.post('/', async (req: Request, res: Response) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

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
