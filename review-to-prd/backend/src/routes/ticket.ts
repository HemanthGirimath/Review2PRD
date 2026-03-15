import { Router, Request, Response } from 'express';
import { generateDevTicket, extractIssuesFromPRD } from '../services/ai';
import { getUserIdFromToken } from '../lib/auth';
import { TicketRequest, Issue, PRD } from '../types';

const router = Router();

// POST /api/ticket — generate a dev ticket for one issue
router.post('/', async (req: Request, res: Response) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { issue, appInfo }: TicketRequest = req.body;

        if (!issue) {
            return res.status(400).json({ success: false, error: 'issue is required' });
        }

        console.log(`[ticket] Generating ticket for: ${issue.title}, userId: ${userId}`);
        const result = await generateDevTicket(issue, appInfo, userId);
        return res.json(result);
    } catch (err: any) {
        console.error('[ticket] Error:', err.message);
        return res.status(500).json({ success: false, error: 'Internal server error during ticket generation' });
    }
});

// POST /api/ticket/issues — extract discrete issues from a PRD
router.post('/issues', async (req: Request, res: Response) => {
    try {
        const userId = await getUserIdFromToken(req.headers.authorization);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { prd, reviews } = req.body as { prd: PRD; reviews: any[] };

        if (!prd) {
            return res.status(400).json({ success: false, error: 'prd is required' });
        }

        console.log(`[ticket] Extracting issues from PRD for: ${prd.appName}, userId: ${userId}`);
        const result = await extractIssuesFromPRD(prd, reviews || [], userId);
        return res.json(result);
    } catch (err: any) {
        console.error('[ticket/issues] Error:', err.message);
        return res.status(500).json({ success: false, error: 'Internal server error during issue extraction' });
    }
});

export default router;
