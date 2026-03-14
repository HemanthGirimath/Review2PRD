import { Router, Request, Response } from 'express';
import { generateDevTicket, extractIssuesFromPRD } from '../services/ollama';
import { TicketRequest, Issue, PRD } from '../types';

const router = Router();

// POST /api/ticket — generate a dev ticket for one issue
router.post('/', async (req: Request, res: Response) => {
    const { issue, appInfo }: TicketRequest = req.body;

    if (!issue) {
        return res.status(400).json({ success: false, error: 'issue is required' });
    }

    console.log(`[ticket] Generating ticket for: ${issue.title}`);
    const result = await generateDevTicket(issue, appInfo);
    return res.json(result);
});

// POST /api/ticket/issues — extract discrete issues from a PRD
router.post('/issues', async (req: Request, res: Response) => {
    const { prd, reviews } = req.body as { prd: PRD; reviews: any[] };

    if (!prd) {
        return res.status(400).json({ success: false, error: 'prd is required' });
    }

    console.log(`[ticket] Extracting issues from PRD for: ${prd.appName}`);
    const result = await extractIssuesFromPRD(prd, reviews || []);
    return res.json(result);
});

export default router;
