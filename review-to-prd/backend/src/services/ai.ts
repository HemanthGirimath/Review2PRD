import axios from 'axios';
import { Review, AppInfo, PRD, AnalyzeResponse, Issue, DevTicket, TicketResponse, IssuesResponse } from '../types';
import { query } from '../lib/db';

async function getUserSettings(userId: string) {
    const result = await query(
        'SELECT ai_provider, ai_model, api_key, base_url FROM user_settings WHERE user_id = $1',
        [userId]
    );
    if (result.rowCount === 0) {
        return {
            ai_provider: 'ollama',
            ai_model: 'kimi-k2.5:cloud',
            api_key: '',
            base_url: 'http://localhost:11434'
        };
    }
    return result.rows[0];
}

async function callChatCompletion(userId: string, prompt: string, timeoutMs = 300000, numPredict = 4096): Promise<string> {
    const settings = await getUserSettings(userId);
    const { ai_provider, ai_model, api_key, base_url } = settings;
    
    // Safety check: Railway cannot reach localhost
    const isLocalhost = (base_url || '').includes('localhost') || (base_url || '').includes('127.0.0.1');
    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RAILWAY_STATIC_URL;
    
    if (isLocalhost && isProduction) {
        throw new Error('Since this app is hosted on Railway, it cannot reach "localhost". You must use a tunnel (like Ngrok) or use a public/cloud URL for your AI provider.');
    }

    const effectiveAiProvider = ai_provider === 'ollama-cloud' ? 'ollama' : ai_provider;

    if (effectiveAiProvider === 'ollama') {
        // Construct Ollama URL smartly
        let url = base_url || (ai_provider === 'ollama' ? 'http://localhost:11434' : 'https://ollama.com');
        if (!url.includes('/api/') && !url.includes('/v1/')) {
            url = `${url.replace(/\/$/, '')}/api/generate`;
        }
        
        const headers: any = { 'Content-Type': 'application/json' };
        if (api_key) {
            headers['Authorization'] = `Bearer ${api_key}`;
        }
        
        const response = await axios.post(
            url,
            { model: ai_model, prompt, stream: false, options: { temperature: 0.3, num_predict: numPredict } },
            { timeout: timeoutMs, headers }
        );
        return response.data.response || '';
    } else {
        // OpenAI / Groq / DeepSeek / compatible API
        let url = base_url || '';
        
        if (!url) {
            if (ai_provider === 'groq') url = 'https://api.groq.com/openai/v1/chat/completions';
            else if (ai_provider === 'deepseek') url = 'https://api.deepseek.com/chat/completions';
            else url = 'https://api.openai.com/v1/chat/completions';
        } else {
            // If user provided a base URL but no endpoint, append the standard one
            if (!url.includes('/chat/completions') && !url.includes('/generate')) {
                url = `${url.replace(/\/$/, '')}/chat/completions`;
                // Some providers like DeepSeek prefer /v1/chat/completions
                if (ai_provider === 'deepseek' && !url.includes('/v1/')) {
                  // Actually deepseek works with /chat/completions
                }
            }
        }
        
        // o-series models (reasoning) have different parameter requirements
        const isReasoningModel = ai_model.startsWith('o1-') || ai_model.startsWith('o3-') || ai_model.includes('reasoner');
        
        const payload: any = {
            model: ai_model,
            messages: [{ role: 'user', content: prompt }]
        };

        if (isReasoningModel) {
            payload.max_completion_tokens = numPredict;
        } else {
            payload.temperature = 0.3;
            payload.max_tokens = numPredict;
        }

        const response = await axios.post(
            url,
            payload,
            {
                timeout: timeoutMs,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api_key}`
                }
            }
        );
        return response.data.choices?.[0]?.message?.content || '';
    }
}

// Reuse existing sanitizeText and parseJSON from the old ollama.ts
function sanitizeText(text: string, maxLen = 300): string {
    return text
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/`/g, "'")
        .replace(/\\/g, '/')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLen);
}

function parseJSON<T>(raw: string): T {
    let str = raw.trim();
    const fenced = str.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) str = fenced[1].trim();
    const first = str.indexOf('{');
    if (first === -1) throw new Error('No JSON object found in response');
    str = str.substring(first);
    const last = str.lastIndexOf('}');
    if (last !== -1) {
        try { return JSON.parse(str.substring(0, last + 1)); } catch { /* fall through */ }
    }
    let attempt = str;
    while (attempt.length > 2) {
        const lb = attempt.lastIndexOf('}');
        if (lb === -1) break;
        attempt = attempt.substring(0, lb + 1);
        try { return JSON.parse(attempt); } catch { attempt = attempt.substring(0, lb); }
    }
    throw new Error('Could not parse or repair JSON response');
}

function repairPartialIssuesJSON(raw: string): Issue[] {
    let str = raw.trim();
    const fenced = str.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) str = fenced[1].trim();
    const first = str.indexOf('[');
    if (first === -1) throw new Error('No JSON array found');
    str = str.substring(first);
    try {
        const last = str.lastIndexOf(']');
        if (last !== -1) return JSON.parse(str.substring(0, last + 1));
    } catch { /* fall through */ }
    let repaired = str;
    while (repaired.length > 2) {
        const lastBrace = repaired.lastIndexOf('}');
        if (lastBrace === -1) break;
        repaired = repaired.substring(0, lastBrace + 1) + ']';
        try { return JSON.parse(repaired); } catch { repaired = repaired.substring(0, lastBrace); }
    }
    throw new Error('Could not repair partial JSON response');
}

// --- 1. PRD Analysis ---
function buildAnalyzePrompt(reviews: Review[], appInfo?: AppInfo, manualText?: string): string {
    let reviewContent = '';
    if (manualText) {
        reviewContent = `--- USER FEEDBACK (Manual Input) ---\n${manualText}\n---`;
    } else if (reviews && reviews.length > 0) {
        const appName = appInfo?.appName || 'Unknown App';
        const platform = appInfo?.platform || 'unknown';
        reviewContent = `--- NEGATIVE USER REVIEWS for ${appName} (${platform}) ---\n`;
        reviewContent += reviews.slice(0, 150).map((r, i) => `[${i + 1}] Rating: ${r.score}/5\nReview: ${sanitizeText(r.text, 250)}`).join('\n\n');
        reviewContent += '\n---';
    }

    return `You are a senior product manager. Analyze these user complaints and generate a comprehensive Product Requirements Document (PRD).
${reviewContent}
Generate a PRD as a valid JSON object with EXACTLY this structure:
{
  "appName": "string",
  "appId": "string",
  "platform": "string",
  "analysisDate": "${new Date().toISOString().split('T')[0]}",
  "totalReviewsAnalyzed": number,
  "problemStatement": { "summary": "string", "painPoints": ["string"], "userQuotes": ["string"] },
  "successMetrics": ["string"],
  "userStories": [{ "as": "string", "iWant": "string", "soThat": "string" }],
  "requirements": { "functional": ["string"], "nonFunctional": ["string"] },
  "edgeCases": ["string"],
  "outOfScope": ["string"],
  "estimatedEffort": "string",
  "priority": "low | medium | high | critical",
  "confidence": "string"
}
Return ONLY raw JSON.`;
}

export async function analyzeWithAI(reviews: Review[], appInfo: AppInfo | undefined, manualText: string | undefined, userId: string): Promise<AnalyzeResponse> {
    const prompt = buildAnalyzePrompt(reviews, appInfo, manualText);
    try {
        const raw = await callChatCompletion(userId, prompt);
        const prd = parseJSON<PRD>(raw);
        if (appInfo && !prd.appName) prd.appName = appInfo.appName;
        if (appInfo && !prd.appId) prd.appId = appInfo.appId;
        if (appInfo && !prd.platform) prd.platform = appInfo.platform;
        if (!prd.totalReviewsAnalyzed) prd.totalReviewsAnalyzed = reviews.length;
        return { success: true, prd };
    } catch (error: any) {
        console.error('AI PRD error:', error.message);
        return { success: false, error: error.message || 'AI analysis failed' };
    }
}

// --- 2. Issue Extraction ---
function buildIssuesPrompt(prd: PRD): string {
    const painPoints = prd.problemStatement?.painPoints?.join('\n- ') || '';
    const userQuotes = prd.problemStatement?.userQuotes?.join('\n') || '';
    const requirements = prd.requirements?.functional?.join('\n- ') || '';
    return `Extract 5-7 ACTIONABLE issues from this PRD for an Issue Board.
APP: ${prd.appName}
PAIN POINTS: ${painPoints}
QUOTES: ${userQuotes}
REQUIREMENTS: ${requirements}
Return ONLY raw JSON array:
[{ "id": "string", "title": "string", "description": "string", "severity": "critical|high|medium|low", "affectedUsers": number, "userQuotes": ["string"], "suggestedFix": "string", "estimatedEffort": "string", "category": "Performance|UI/UX|Reliability|Features|Onboarding|Pricing|Content", "status": "open", "pmNotes": "", "priority": number }]`;
}

export async function extractIssuesFromPRD(prd: PRD, reviews: Review[], userId: string): Promise<IssuesResponse> {
    const prompt = buildIssuesPrompt(prd);
    try {
        const raw = await callChatCompletion(userId, prompt, 300000, 8192);
        const issues: Issue[] = repairPartialIssuesJSON(raw);
        return { success: true, issues };
    } catch (error: any) {
        console.error('AI Issue extraction error:', error.message);
        return { success: false, error: error.message || 'Failed to extract issues' };
    }
}

// --- 3. Dev Ticket Generation ---
function buildTicketPrompt(issue: Issue, appInfo?: AppInfo): string {
    return `Generate a detailed dev ticket for this issue.
Title: ${issue.title}
Description: ${issue.description}
Fix: ${issue.suggestedFix}
QUOTES: ${issue.userQuotes.join('\n')}
Return ONLY raw JSON:
{ "issueId": "${issue.id}", "title": "string", "userPOV": "string", "whatToBuild": ["string"], "acceptanceCriteria": [{"what": "string", "done": false}], "edgeCases": ["string"], "outOfScope": ["string"], "technicalNotes": "string" }`;
}

export async function generateDevTicket(issue: Issue, appInfo: AppInfo | undefined, userId: string): Promise<TicketResponse> {
    const prompt = buildTicketPrompt(issue, appInfo);
    try {
        const raw = await callChatCompletion(userId, prompt, 180000);
        const ticket = parseJSON<DevTicket>(raw);
        ticket.issueId = issue.id;
        return { success: true, ticket };
    } catch (error: any) {
        console.error('AI Dev ticket error:', error.message);
        return { success: false, error: error.message || 'Failed to generate dev ticket' };
    }
}

export async function testConnection(userId: string): Promise<{ success: boolean; message: string }> {
    try {
        const settings = await getUserSettings(userId);
        const prompt = "Please respond only with the single word 'Connected'.";
        const responseText = await callChatCompletion(userId, prompt, 30000, 20);
        
        console.log(`[ai] Connection test response from ${settings.ai_model}: "${responseText.trim()}"`);

        // Lenient check: if it says connected anywhere or returns a decent length string
        if (responseText.toLowerCase().includes('connected') || responseText.trim().length > 0) {
            return { 
                success: true, 
                message: `Successfully connected to ${settings.ai_provider} (${settings.ai_model})` 
            };
        }
        return { success: false, message: 'Connected to provider, but received an empty response. Check your model name or cloud usage limits.' };
    } catch (err: any) {
        console.warn('[ai] Connection test failed:', err.message);
        let msg = 'Connection failed';
        
        // Handle Axios/Response Errors
        if (err.response?.data?.error) {
            const apiError = err.response.data.error;
            // OpenAI/Groq standard error formats
            if (typeof apiError === 'object') {
                if (apiError.code === 'insufficient_quota') msg = 'Quota exceeded! Check your OpenAI/Groq billing/credits.';
                else if (apiError.code === 'invalid_api_key') msg = 'Invalid API Key. Please check your settings.';
                else if (apiError.type === 'invalid_request_error') msg = `Invalid Request: ${apiError.message}`;
                else msg = apiError.message || msg;
            } else {
                msg = String(apiError);
            }
        } else {
            msg = err.message;
        }

        if (err.code === 'ECONNREFUSED') msg = 'Connection refused. Check if your provider/local URL is reachable.';
        if (err.response?.status === 401) msg = 'Invalid API key or unauthorized access.';
        if (err.response?.status === 404) msg = 'Endpoint or Model not found. Check your model name and base URL.';
        if (err.response?.status === 429) msg = 'Rate limit reached or insufficient credits. Check your provider dashboard.';
        if (err.response?.status === 400 && !msg.includes('Quota')) msg = 'Bad Request: Often caused by an invalid model name (e.g. check for typos like gpt-40).';

        return { success: false, message: msg };
    }
}
