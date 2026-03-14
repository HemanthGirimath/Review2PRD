import { ref } from 'vue'
import type { PRD, AppInfo, Issue, DevTicket, ScrapeResponse, InputMode } from '../types'

const SESSION_KEY = 'review2prd_session'
const SESSION_TTL_DAYS = 7

// ── Types ──────────────────────────────────────────────────

export interface PersistedSession {
    inputMode: InputMode
    inputValue: string
    appName: string
    appInfo?: AppInfo
    negativeCount?: number
    prd: PRD
    issues: Issue[]
    ticketCache: Record<string, DevTicket>
    savedAt: string   // ISO timestamp
}

// ── In-memory scrape cache (session-level, keyed by URL/appId) ──

const scrapeCache = new Map<string, ScrapeResponse>()

export function getCachedScrape(key: string): ScrapeResponse | null {
    return scrapeCache.get(key.toLowerCase().trim()) ?? null
}

export function setCachedScrape(key: string, data: ScrapeResponse) {
    scrapeCache.set(key.toLowerCase().trim(), data)
}

// ── localStorage session persistence ──────────────────────

export function saveSession(session: PersistedSession) {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch (e) {
        console.warn('[cache] Could not save session to localStorage:', e)
    }
}

export function loadSession(): PersistedSession | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY)
        if (!raw) return null
        const session: PersistedSession = JSON.parse(raw)

        // Expire sessions older than TTL
        const savedAt = new Date(session.savedAt).getTime()
        const ageMs = Date.now() - savedAt
        if (ageMs > SESSION_TTL_DAYS * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(SESSION_KEY)
            return null
        }
        return session
    } catch {
        localStorage.removeItem(SESSION_KEY)
        return null
    }
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY)
    scrapeCache.clear()
}

// ── Composable: reactive saved session state ──────────────

export function useSessionCache() {
    // sessionStorage is cleared on hard reload (DevTools viewport toggle → reload)
    // but persists across normal navigations within the same tab.
    // This means: dismiss hides the banner for the current tab session,
    // but a fresh page load (e.g. after DevTools mobile/desktop toggle) shows it again.
    const dismissed = sessionStorage.getItem('r2prd_dismissed') === '1'
    const savedSession = ref<PersistedSession | null>(dismissed ? null : loadSession())

    function persist(session: PersistedSession) {
        saveSession(session)
        savedSession.value = session
        sessionStorage.removeItem('r2prd_dismissed')
    }

    function dismiss() {
        // Hide banner for this tab only — keep data in localStorage
        sessionStorage.setItem('r2prd_dismissed', '1')
        savedSession.value = null
    }

    function clear() {
        clearSession()
        sessionStorage.removeItem('r2prd_dismissed')
        savedSession.value = null
    }

    return { savedSession, persist, dismiss, clear }
}
