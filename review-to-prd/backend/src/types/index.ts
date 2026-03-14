export interface Review {
    id?: string;
    userName?: string;
    title?: string;
    text: string;
    score: number;
    date?: string;
    version?: string;
    platform: 'android' | 'ios';
}

export interface AppInfo {
    appId: string;
    appName: string;
    platform: 'android' | 'ios';
    icon?: string;
    developer?: string;
    category?: string;
    rating?: number;
    reviews?: number;
    country?: string;
}

export interface ScrapeRequest {
    url?: string;
    appId?: string;
    platform?: 'android' | 'ios';
    country?: string;
}

export interface ManualRequest {
    text: string;
    appName?: string;
    source?: string;
}

export interface AnalyzeRequest {
    reviews?: Review[];
    manualText?: string;
    appInfo?: AppInfo;
}

export interface PRDProblemStatement {
    summary: string;
    painPoints: string[];
    userQuotes: string[];
}

export interface PRDUserStory {
    as: string;
    iWant: string;
    soThat: string;
}

export interface PRDRequirements {
    functional: string[];
    nonFunctional: string[];
}

export interface PRD {
    appName: string;
    appId?: string;
    platform?: string;
    analysisDate: string;
    totalReviewsAnalyzed?: number;
    problemStatement: PRDProblemStatement;
    successMetrics: string[];
    userStories: PRDUserStory[];
    requirements: PRDRequirements;
    edgeCases: string[];
    outOfScope: string[];
    estimatedEffort: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    confidence: string;
}

export interface ScrapeResponse {
    success: boolean;
    appInfo?: AppInfo;
    reviews?: Review[];
    totalFetched?: number;
    negativeCount?: number;
    error?: string;
}

export interface AnalyzeResponse {
    success: boolean;
    prd?: PRD;
    error?: string;
    rawResponse?: string;
}

// ── Issue Board ────────────────────────────────────────────

export type IssueStatus = 'open' | 'in-sprint' | 'wont-fix' | 'done';
export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Issue {
    id: string;
    title: string;
    description: string;
    severity: IssueSeverity;
    affectedUsers: number;        // estimated % or count of reviewers mentioning this
    userQuotes: string[];
    suggestedFix: string;
    estimatedEffort: string;
    category: string;             // e.g. "Performance", "UI/UX", "Reliability"
    status: IssueStatus;
    pmNotes: string;              // editable by PM
    priority: number;             // 1 = highest, used for ordering
}

// ── Dev Ticket ─────────────────────────────────────────────

export interface DevTicketAcceptanceCriteria {
    what: string;
    done: boolean;
}

export interface DevTicket {
    issueId: string;
    title: string;
    userPOV: string;             // The problem from the user's perspective
    whatToBuild: string[];       // Technical implementation bullets
    acceptanceCriteria: DevTicketAcceptanceCriteria[];
    edgeCases: string[];
    outOfScope: string[];
    technicalNotes: string;      // Any technical context the AI inferred
}

export interface TicketRequest {
    issue: Issue;
    appInfo?: AppInfo;
}

export interface TicketResponse {
    success: boolean;
    ticket?: DevTicket;
    error?: string;
}

export interface IssuesResponse {
    success: boolean;
    issues?: Issue[];
    error?: string;
}

