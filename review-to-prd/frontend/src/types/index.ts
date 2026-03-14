export interface Review {
    id?: string
    userName?: string
    title?: string
    text: string
    score: number
    date?: string
    version?: string
    platform: 'android' | 'ios'
}

export interface AppInfo {
    appId: string
    appName: string
    platform: 'android' | 'ios'
    icon?: string
    developer?: string
    category?: string
    rating?: number
    reviews?: number
    country?: string
}

export interface PRDProblemStatement {
    summary: string
    painPoints: string[]
    userQuotes: string[]
}

export interface PRDUserStory {
    as: string
    iWant: string
    soThat: string
}

export interface PRDRequirements {
    functional: string[]
    nonFunctional: string[]
}

export interface PRD {
    appName: string
    appId?: string
    platform?: string
    analysisDate: string
    totalReviewsAnalyzed?: number
    problemStatement: PRDProblemStatement
    successMetrics: string[]
    userStories: PRDUserStory[]
    requirements: PRDRequirements
    edgeCases: string[]
    outOfScope: string[]
    estimatedEffort: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    confidence: string
}

export interface ScrapeResponse {
    success: boolean
    appInfo?: AppInfo
    reviews?: Review[]
    totalFetched?: number
    negativeCount?: number
    error?: string
}

export interface AnalyzeResponse {
    success: boolean
    prd?: PRD
    error?: string
}

export type InputMode = 'google-play' | 'app-store' | 'manual'

export type Step = 'input' | 'scraping' | 'analyzing' | 'extracting' | 'result'

export type IssueStatus = 'open' | 'in-sprint' | 'wont-fix' | 'done'
export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface Issue {
    id: string
    title: string
    description: string
    severity: IssueSeverity
    affectedUsers: number
    userQuotes: string[]
    suggestedFix: string
    estimatedEffort: string
    category: string
    status: IssueStatus
    pmNotes: string
    priority: number
}

export interface DevTicketAcceptanceCriteria {
    what: string
    done: boolean
}

export interface DevTicket {
    issueId: string
    title: string
    userPOV: string
    whatToBuild: string[]
    acceptanceCriteria: DevTicketAcceptanceCriteria[]
    edgeCases: string[]
    outOfScope: string[]
    technicalNotes: string
}

export interface IssuesResponse {
    success: boolean
    issues?: Issue[]
    error?: string
}

export interface TicketResponse {
    success: boolean
    ticket?: DevTicket
    error?: string
}
