declare module 'app-store-scraper' {
    interface AppDetails {
        id: number;
        appId: string;
        title: string;
        url: string;
        description: string;
        icon: string;
        genres: string[];
        primaryGenre: string;
        developer: string;
        developerId: string;
        developerUrl: string;
        developerWebsite?: string;
        updated: string;
        releaseNotes?: string;
        version: string;
        price: number;
        currency: string;
        free: boolean;
        score: number;
        reviews: number;
        currentVersionScore: number;
        currentVersionReviews: number;
        screenshots: string[];
        ipadScreenshots: string[];
        appletvScreenshots: string[];
        supportedDevices: string[];
        size: string;
    }

    interface Review {
        id: string;
        userName: string;
        userUrl: string;
        version: string;
        score: number;
        title: string;
        text: string;
        url: string;
        updated: string;
    }

    interface SortMethod {
        RECENT: number;
        HELPFUL: number;
        CRITICAL: number;
    }

    interface AppOptions {
        id?: number;
        appId?: string;
        country?: string;
        lang?: string;
        ratings?: boolean;
    }

    interface ReviewOptions {
        id?: number;
        appId?: string;
        country?: string;
        page?: number;
        sort?: number;
    }

    const sort: SortMethod;

    function app(options: AppOptions): Promise<AppDetails>;
    function reviews(options: ReviewOptions): Promise<Review[]>;
    function search(options: { term: string; country?: string; num?: number }): Promise<AppDetails[]>;

    export { sort, app, reviews, search };
    export default { sort, app, reviews, search };
}
