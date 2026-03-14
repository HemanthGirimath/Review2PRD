import { Router, Request, Response } from 'express';
import { analyzeWithOllama } from '../services/ollama';
import { AnalyzeRequest } from '../types';

const router = Router();

// POST /api/analyze
router.post('/', async (req: Request, res: Response) => {
    const { reviews, manualText, appInfo }: AnalyzeRequest = req.body;

    if (!manualText && (!reviews || reviews.length === 0)) {
        return res.status(400).json({
            success: false,
            error: 'Either reviews or manual text is required for analysis',
        });
    }

    console.log(`Analyzing: ${reviews?.length || 0} reviews, manual: ${!!manualText}`);
    console.log(`Sending to Ollama (${reviews?.length || 0} reviews)...`);

    const result = await analyzeWithOllama(reviews || [], appInfo, manualText);
    return res.json(result);
});

export default router;
