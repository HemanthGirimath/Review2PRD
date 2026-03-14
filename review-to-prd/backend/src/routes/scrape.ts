import { Router, Request, Response } from 'express';
import { parseGooglePlayId, scrapeGooglePlay } from '../services/googlePlay';
import { parseAppStoreUrl, scrapeAppStore } from '../services/appStore';
import { ScrapeRequest } from '../types';

const router = Router();

// POST /api/scrape
router.post('/', async (req: Request, res: Response) => {
    console.log('[scrape] body received:', JSON.stringify(req.body));

    const { url, platform }: ScrapeRequest = req.body;

    if (!url || !url.trim()) {
        return res.status(400).json({ success: false, error: 'URL or app ID is required' });
    }

    const input = url.trim();

    // Try to detect platform from URL if not explicitly provided
    let detectedPlatform = platform;

    if (!detectedPlatform) {
        if (
            input.includes('play.google.com') ||
            input.startsWith('com.') ||
            /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i.test(input)
        ) {
            detectedPlatform = 'android';
        } else if (
            input.includes('apps.apple.com') ||
            input.includes('itunes.apple.com') ||
            /^\d{6,12}$/.test(input)
        ) {
            detectedPlatform = 'ios';
        }
    }

    if (!detectedPlatform) {
        return res.status(400).json({
            success: false,
            error: `Could not detect platform from: "${input}". Please use a Google Play URL (play.google.com/...) or App Store URL (apps.apple.com/...) or a package name like com.example.app`,
        });
    }

    console.log(`[scrape] Platform detected: ${detectedPlatform}, input: ${input}`);

    if (detectedPlatform === 'android') {
        const appId = parseGooglePlayId(input);
        if (!appId) {
            return res.status(400).json({
                success: false,
                error: `Could not parse Google Play app ID from: "${input}". Expected: com.example.app or full Play Store URL`,
            });
        }
        console.log(`[scrape] Google Play appId: ${appId}`);
        const result = await scrapeGooglePlay(appId);
        return res.json(result);
    }

    if (detectedPlatform === 'ios') {
        const parsed = parseAppStoreUrl(input);
        if (!parsed) {
            return res.status(400).json({
                success: false,
                error: `Could not parse App Store ID from: "${input}". Expected: https://apps.apple.com/us/app/name/id123456789 or numeric ID`,
            });
        }
        console.log(`[scrape] App Store id: ${parsed.appId}, country: ${parsed.country}`);
        const result = await scrapeAppStore(parsed.appId, parsed.country);
        return res.json(result);
    }

    return res.status(400).json({ success: false, error: 'Unsupported platform' });
});

export default router;
