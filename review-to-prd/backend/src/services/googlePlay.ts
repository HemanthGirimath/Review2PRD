import gplay from 'google-play-scraper';
import { Review, AppInfo, ScrapeResponse } from '../types';

const REVIEWS_PER_STAR = 75; // fetch 75 reviews per star (1★, 2★, 3★) = up to 225 total

export function parseGooglePlayId(input: string): string | null {
    // Handle full URL: https://play.google.com/store/apps/details?id=com.example.app
    const urlMatch = input.match(/[?&]id=([a-zA-Z0-9._\-]+)/);
    if (urlMatch) return urlMatch[1];

    // Handle direct package name: com.example.app
    const packageMatch = input.match(/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/);
    if (packageMatch) return input.trim();

    return null;
}

export async function scrapeGooglePlay(appId: string): Promise<ScrapeResponse> {
    try {
        // Fetch app info
        const appDetails = await gplay.app({ appId }) as any;
        console.log(`[googlePlay] App: ${appDetails.title}, Rating: ${appDetails.score}`);

        const appInfo: AppInfo = {
            appId,
            appName: appDetails.title || appId,
            platform: 'android',
            icon: appDetails.icon,
            developer: appDetails.developer,
            category: appDetails.genre,
            rating: appDetails.score,
            reviews: appDetails.ratings,
        };

        // Fetch specifically 1-star, 2-star, and 3-star reviews using filterScoreWith
        // This guarantees we get negative reviews instead of hoping sort puts them first
        const allNegativeReviews: any[] = [];

        for (const starRating of [1, 2, 3]) {
            try {
                const result = await gplay.reviews({
                    appId,
                    sort: gplay.sort.NEWEST,
                    num: REVIEWS_PER_STAR,
                    filterScoreWith: starRating,
                    paginate: false,
                } as any) as any;

                const starReviews: any[] = result.data || result || [];
                console.log(`[googlePlay] ${starRating}★ reviews fetched: ${starReviews.length}`);
                allNegativeReviews.push(...starReviews);
            } catch (starErr: any) {
                console.warn(`[googlePlay] Could not fetch ${starRating}★ reviews: ${starErr.message}`);
            }
        }

        console.log(`[googlePlay] Total negative reviews: ${allNegativeReviews.length}`);

        // Filter reviews with actual text content
        const negativeReviews: Review[] = allNegativeReviews
            .filter((r: any) => r.text && r.text.trim().length > 5)
            .map((r: any) => ({
                id: r.id,
                userName: r.userName,
                title: r.title || '',
                text: r.text,
                score: r.score,
                date: r.date ? new Date(r.date).toISOString().split('T')[0] : undefined,
                version: r.version,
                platform: 'android' as const,
            }));

        return {
            success: true,
            appInfo,
            reviews: negativeReviews,
            totalFetched: allNegativeReviews.length,
            negativeCount: negativeReviews.length,
        };
    } catch (error: any) {
        console.error('[googlePlay] Scrape error:', error.message);
        return {
            success: false,
            error: error.message || 'Failed to scrape Google Play reviews',
        };
    }
}
