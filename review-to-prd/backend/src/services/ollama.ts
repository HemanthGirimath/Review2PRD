import axios from 'axios';
import { Review, AppInfo, PRD, AnalyzeResponse, Issue, DevTicket, TicketResponse, IssuesResponse } from '../types';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'kimi-k2.5:cloud';

// ── Helper: call Ollama and parse JSON ─────────────────────

async function callOllama(prompt: string, timeoutMs = 300000, numPredict = 4096): Promise<string> {
    const response = await axios.post(
        OLLAMA_URL,
        { model: MODEL, prompt, stream: false, options: { temperature: 0.3, num_predict: numPredict } },
        { timeout: timeoutMs, headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.response || '';
}

// Sanitize review text before embedding in prompts
// Strips control chars, smart quotes, backticks that can break JSON output
function sanitizeText(text: string, maxLen = 300): string {
    return text
        .replace(/[\u0000-\u001F\u007F]/g, ' ')   // control characters
        .replace(/[\u2018\u2019]/g, "'")            // smart single quotes → '
        .replace(/[\u201C\u201D]/g, '"')            // smart double quotes → " (LLM will escape)
        .replace(/`/g, "'")                         // backticks → apostrophe
        .replace(/\\/g, '/')                        // backslashes
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLen);
}

function parseJSON<T>(raw: string): T {
    let str = raw.trim();
    // Strip code fences
    const fenced = str.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) str = fenced[1].trim();
    // Find outermost object
    const first = str.indexOf('{');
    if (first === -1) throw new Error('No JSON object found in response');
    str = str.substring(first);

    // Try clean parse first (look for last })
    const last = str.lastIndexOf('}');
    if (last !== -1) {
        try { return JSON.parse(str.substring(0, last + 1)); } catch { /* fall through */ }
    }

    // Repair: walk backward to find the last valid closing brace
    let attempt = str;
    while (attempt.length > 2) {
        const lb = attempt.lastIndexOf('}');
        if (lb === -1) break;
        attempt = attempt.substring(0, lb + 1);
        try { return JSON.parse(attempt); } catch { attempt = attempt.substring(0, lb); }
    }
    throw new Error('Could not parse or repair JSON response');
}

// ── 1. PRD Analysis ────────────────────────────────────────

function buildAnalyzePrompt(reviews: Review[], appInfo?: AppInfo, manualText?: string): string {
    let reviewContent = '';
    if (manualText) {
        reviewContent = `--- USER FEEDBACK (Manual Input) ---\n${manualText}\n---`;
    } else if (reviews && reviews.length > 0) {
        const appName = appInfo?.appName || 'Unknown App';
        const platform = appInfo?.platform || 'unknown';
        reviewContent = `--- NEGATIVE USER REVIEWS for ${appName} (${platform}) ---\n`;
        reviewContent += reviews
            .slice(0, 150)
            .map((r, i) => `[${i + 1}] Rating: ${r.score}/5\nReview: ${sanitizeText(r.text, 250)}`)
            .join('\n\n');
        reviewContent += '\n---';
    }

    return `You are a senior product manager. Analyze these user complaints and generate a comprehensive Product Requirements Document (PRD).

${reviewContent}

Based on these complaints, generate a PRD as a valid JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):

{
  "appName": "string - name of the app",
  "appId": "string - app identifier or empty string",
  "platform": "string - android / ios / web / unknown",
  "analysisDate": "${new Date().toISOString().split('T')[0]}",
  "totalReviewsAnalyzed": number,
  "problemStatement": {
    "summary": "string - 2-3 sentence executive summary of the main problem",
    "painPoints": ["array of 4-8 specific pain points identified from reviews"],
    "userQuotes": ["array of 3-5 most impactful direct quotes from reviews"]
  },
  "successMetrics": ["array of 4-6 measurable success metrics"],
  "userStories": [
    { "as": "user type", "iWant": "what they want to do", "soThat": "the outcome/benefit" }
  ],
  "requirements": {
    "functional": ["array of 5-8 specific functional requirements"],
    "nonFunctional": ["array of 3-5 non-functional requirements like performance, accessibility"]
  },
  "edgeCases": ["array of 3-5 edge cases to handle"],
  "outOfScope": ["array of 2-4 things explicitly out of scope for this iteration"],
  "estimatedEffort": "string - e.g. '3-5 days' or '2-3 weeks'",
  "priority": "low | medium | high | critical",
  "confidence": "string percentage e.g. '85%'"
}

IMPORTANT: Return ONLY the raw JSON. No explanations, no markdown formatting, no code fences.`;
}

export async function analyzeWithOllama(
    reviews: Review[],
    appInfo?: AppInfo,
    manualText?: string
): Promise<AnalyzeResponse> {
    const prompt = buildAnalyzePrompt(reviews, appInfo, manualText);
    try {
        const raw = await callOllama(prompt);
        const prd = parseJSON<PRD>(raw);
        if (appInfo && !prd.appName) prd.appName = appInfo.appName;
        if (appInfo && !prd.appId) prd.appId = appInfo.appId;
        if (appInfo && !prd.platform) prd.platform = appInfo.platform;
        if (!prd.totalReviewsAnalyzed) prd.totalReviewsAnalyzed = reviews.length;
        return { success: true, prd };
    } catch (error: any) {
        console.error('Ollama PRD error:', error.message);
        if (error.code === 'ECONNREFUSED') return { success: false, error: 'Cannot connect to Ollama. Make sure Ollama is running (ollama serve).' };
        return { success: false, error: error.response?.data?.error || error.message || 'AI analysis failed' };
    }
}

// ── 2. Issue Extraction from PRD ───────────────────────────

function buildIssuesPrompt(prd: PRD): string {
    // Use only PRD data — no raw reviews — to stay well within token limits
    const painPoints = prd.problemStatement?.painPoints?.join('\n- ') || 'No pain points';
    const userQuotes = prd.problemStatement?.userQuotes?.map(q => `"${q}"`).join('\n') || '';
    const requirements = prd.requirements?.functional?.join('\n- ') || '';
    const userStories = prd.userStories?.map(s => `As ${s.as}, I want ${s.iWant}`).join('\n') || '';

    return `You are a senior product manager. Based on this PRD, extract 5-7 DISCRETE, ACTIONABLE issue cards for the Issue Board.

APP: ${prd.appName} (${prd.platform})
ANALYSIS DATE: ${prd.analysisDate}
REVIEWS ANALYZED: ${prd.totalReviewsAnalyzed || 'unknown'}

PAIN POINTS:
- ${painPoints}

USER QUOTES:
${userQuotes}

FUNCTIONAL REQUIREMENTS (from PRD):
- ${requirements}

USER STORIES:
${userStories}

Extract 5-7 distinct issues. Each issue = ONE specific problem cluster (not vague).
Return ONLY a raw JSON array, no code fences, no explanation:

[
  {
    "id": "issue-1",
    "title": "Short specific title starting with a noun e.g. 'Slow search response time'",
    "description": "2 sentences max describing the specific problem.",
    "severity": "critical",
    "affectedUsers": 45,
    "userQuotes": ["one direct quote relevant to this issue"],
    "suggestedFix": "One sentence fix.",
    "estimatedEffort": "2-3 days",
    "category": "Performance",
    "status": "open",
    "pmNotes": "",
    "priority": 1
  }
]

Severity guide: critical=app-breaking or major churn | high=frequent complaint | medium=notable | low=edge case
Category must be one of: Performance, UI/UX, Reliability, Features, Onboarding, Pricing, Content
Sort by severity descending. Return ONLY the JSON array.`;
}

function repairPartialIssuesJSON(raw: string): Issue[] {
    // Strip code fences
    let str = raw.trim();
    const fenced = str.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) str = fenced[1].trim();

    // Find array boundaries
    const first = str.indexOf('[');
    if (first === -1) throw new Error('No JSON array found');
    str = str.substring(first);

    // Try parsing as-is first
    try {
        const last = str.lastIndexOf(']');
        if (last !== -1) return JSON.parse(str.substring(0, last + 1));
    } catch { /* fall through to repair */ }

    // Truncated JSON repair: find the last COMPLETE object (ends with })
    // Walk backward from end to find last `}` that closes a complete object
    let repaired = str;
    while (repaired.length > 2) {
        const lastBrace = repaired.lastIndexOf('}');
        if (lastBrace === -1) break;
        repaired = repaired.substring(0, lastBrace + 1) + ']';
        try {
            const result = JSON.parse(repaired);
            console.log('[ollama] Repaired partial JSON, got', result.length, 'issues');
            return result;
        } catch {
            repaired = repaired.substring(0, lastBrace);
        }
    }
    throw new Error('Could not repair partial JSON response');
}

export async function extractIssuesFromPRD(prd: PRD, reviews: Review[]): Promise<IssuesResponse> {
    const prompt = buildIssuesPrompt(prd);
    try {
        console.log('[ollama] Extracting issues from PRD...');
        // Use 8192 tokens — the issue array needs more space than the PRD
        const raw = await callOllama(prompt, 300000, 8192);
        console.log('[ollama] Raw issues response length:', raw.length);
        const issues: Issue[] = repairPartialIssuesJSON(raw);
        console.log(`[ollama] Extracted ${issues.length} issues`);
        return { success: true, issues };
    } catch (error: any) {
        console.error('[ollama] Issue extraction error:', error.message);
        return { success: false, error: error.message || 'Failed to extract issues' };
    }
}

// ── 3. Dev Ticket Generation ───────────────────────────────

function buildTicketPrompt(issue: Issue, appInfo?: AppInfo): string {
    const appContext = appInfo ? `App: ${appInfo.appName} (${appInfo.platform})` : '';

    return `You are a senior software engineer writing a developer ticket. Generate a detailed, actionable dev ticket for this specific issue.

${appContext}

ISSUE TO SOLVE:
Title: ${issue.title}
Description: ${issue.description}
Severity: ${issue.severity}
Category: ${issue.category}
Suggested Fix: ${issue.suggestedFix}
Estimated Effort: ${issue.estimatedEffort}

USER QUOTES (real feedback):
${issue.userQuotes.map(q => `- "${q}"`).join('\n')}

Generate a developer ticket as raw JSON (no code fences, no markdown):

{
  "issueId": "${issue.id}",
  "title": "string - action-oriented ticket title starting with a verb e.g. 'Fix slow search indexing'",
  "userPOV": "string - 2-3 sentences describing the problem from the user's perspective, including emotional impact",
  "whatToBuild": [
    "string - specific technical implementation step",
    "string - each item is ONE concrete thing to build/change/fix"
  ],
  "acceptanceCriteria": [
    { "what": "string - testable criterion", "done": false }
  ],
  "edgeCases": ["string - edge case the developer must handle"],
  "outOfScope": ["string - explicitly NOT part of this ticket"],
  "technicalNotes": "string - any inferred technical context, architectural suggestions, or gotchas"
}

RULES:
- whatToBuild: 4-7 specific items, each starting with a verb (Add, Fix, Implement, Ensure, Update, Create)
- acceptanceCriteria: 3-6 items, must be verifiable/testable (e.g. "Search returns results in <1s")
- edgeCases: 2-4 items
- outOfScope: 2-3 items
- Return ONLY raw JSON.`;
}

export async function generateDevTicket(issue: Issue, appInfo?: AppInfo): Promise<TicketResponse> {
    const prompt = buildTicketPrompt(issue, appInfo);
    try {
        console.log(`[ollama] Generating dev ticket for: ${issue.title}`);
        const raw = await callOllama(prompt, 180000);
        const ticket = parseJSON<DevTicket>(raw);
        ticket.issueId = issue.id; // ensure it's set
        return { success: true, ticket };
    } catch (error: any) {
        console.error('[ollama] Dev ticket error:', error.message);
        return { success: false, error: error.message || 'Failed to generate dev ticket' };
    }
}
