import store from 'app-store-scraper';
import { Review, AppInfo, ScrapeResponse } from '../types';

const REVIEW_PAGES = 10; // Each page has ~50 reviews → up to 500 reviews
const NEGATIVE_THRESHOLD = 3;

export interface ParsedAppStoreId {
    appId: number;
    country: string;
}

export function parseAppStoreUrl(input: string): ParsedAppStoreId | null {
    // Handle full URL: https://apps.apple.com/us/app/spotify/id324684580
    const urlMatch = input.match(/apps\.apple\.com\/([a-z]{2})\/app\/[^/]+\/id(\d+)/i);
    if (urlMatch) {
        return {
            country: urlMatch[1].toLowerCase(),
            appId: parseInt(urlMatch[2], 10),
        };
    }

    // Handle ID-only URL without country: https://apps.apple.com/app/id324684580
    const shortUrlMatch = input.match(/apps\.apple\.com\/app\/id(\d+)/i);
    if (shortUrlMatch) {
        return {
            country: 'us',
            appId: parseInt(shortUrlMatch[1], 10),
        };
    }

    // Handle numeric ID directly: 324684580
    const numericMatch = input.match(/^(\d{6,12})$/);
    if (numericMatch) {
        return {
            country: 'us',
            appId: parseInt(numericMatch[1], 10),
        };
    }

    return null;
}

export async function scrapeAppStore(appId: number, country: string): Promise<ScrapeResponse> {
    try {
        // Fetch app details
        const appDetails = await store.app({ id: appId, country }) as any;

        const appInfo: AppInfo = {
            appId: String(appId),
            appName: appDetails.title || String(appId),
            platform: 'ios',
            icon: appDetails.icon,
            developer: appDetails.developer,
            category: appDetails.primaryGenre,
            rating: appDetails.score,
            reviews: appDetails.reviews,
            country,
        };

        // Scrape multiple pages to get enough negative reviews
        const allReviews: any[] = [];
        for (let page = 1; page <= REVIEW_PAGES; page++) {
            try {
                const pageReviews = await store.reviews({
                    id: appId,
                    country,
                    sort: store.sort.CRITICAL,
                    page,
                }) as any[];
                if (!pageReviews || pageReviews.length === 0) break;
                allReviews.push(...pageReviews);
            } catch {
                break; // No more pages
            }
        }

        // Filter only negative reviews with actual text
        const negativeReviews: Review[] = allReviews
            .filter((r: any) => r.score <= NEGATIVE_THRESHOLD && r.text && r.text.trim().length > 10)
            .map((r: any) => ({
                id: r.id,
                userName: r.userName,
                title: r.title || '',
                text: r.text,
                score: r.score,
                date: r.updated ? new Date(r.updated).toISOString().split('T')[0] : undefined,
                version: r.version,
                platform: 'ios' as const,
            }));

        return {
            success: true,
            appInfo,
            reviews: negativeReviews,
            totalFetched: allReviews.length,
            negativeCount: negativeReviews.length,
        };
    } catch (error: any) {
        console.error('App Store scrape error:', error.message);
        return {
            success: false,
            error: error.message || 'Failed to scrape App Store reviews',
        };
    }
}
