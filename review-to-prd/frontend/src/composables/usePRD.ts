import { ref, computed } from 'vue'
import axios from 'axios'
import type {
    PRD, AppInfo, Review, Issue, DevTicket,
    ScrapeResponse, AnalyzeResponse, IssuesResponse, TicketResponse,
    InputMode, Step
} from '../types'
import {
    getCachedScrape, setCachedScrape,
    saveSession, clearSession,
    type PersistedSession
} from './useSessionCache'

const API_BASE = '/api'

export function usePRD() {
    const step = ref<Step>('input')
    const inputMode = ref<InputMode>('google-play')
    const inputValue = ref('')
    const manualText = ref('')
    const appName = ref('')
    const activeView = ref<'prd' | 'board'>('prd')

    const scrapeData = ref<{ appInfo?: AppInfo; reviews?: Review[]; negativeCount?: number } | null>(null)
    const prd = ref<PRD | null>(null)
    const issues = ref<Issue[]>([])
    const ticketCache = ref<Record<string, DevTicket>>({})  // issueId → ticket
    const generatingTicketId = ref<string | null>(null)
    const error = ref<string | null>(null)
    const loadingMessage = ref('')

    const isLoading = computed(() => ['scraping', 'analyzing', 'extracting'].includes(step.value))

    // ── Triage stats ────────────────────────────────────────
    const triageStats = computed(() => {
        const total = issues.value.length
        const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 }
        const byStatus = { open: 0, 'in-sprint': 0, 'wont-fix': 0, done: 0 }
        for (const issue of issues.value) {
            bySeverity[issue.severity] = (bySeverity[issue.severity] || 0) + 1
            byStatus[issue.status] = (byStatus[issue.status] || 0) + 1
        }
        const triaged = total - byStatus['open']
        return { total, bySeverity, byStatus, triaged, pct: total ? Math.round((triaged / total) * 100) : 0 }
    })

    // ── Generate flow ───────────────────────────────────────
    async function generate() {
        error.value = null
        prd.value = null
        issues.value = []
        ticketCache.value = {}
        scrapeData.value = null

        if (inputMode.value === 'manual') {
            if (!manualText.value.trim()) { error.value = 'Please paste some user feedback text.'; return }
            await analyzeManual()
        } else {
            await scrapeAndAnalyze()
        }
    }

    async function scrapeAndAnalyze() {
        step.value = 'scraping'
        loadingMessage.value = 'Scraping reviews from the app store…'
        try {
            const cacheKey = inputValue.value.trim()

            // Check in-memory scrape cache first
            let scrapeResult = getCachedScrape(cacheKey)
            if (scrapeResult) {
                console.log('[cache] Scrape cache hit for:', cacheKey)
                loadingMessage.value = '✓ Reviews loaded from cache'
            } else {
                const scrapeRes = await axios.post<ScrapeResponse>(`${API_BASE}/scrape`, { url: cacheKey })
                if (!scrapeRes.data.success) { error.value = scrapeRes.data.error || 'Scraping failed'; step.value = 'input'; return }
                scrapeResult = scrapeRes.data
                // Store in cache for this session
                setCachedScrape(cacheKey, scrapeResult)
            }

            if (!scrapeResult.reviews?.length) { error.value = 'No negative reviews found. Try a different app.'; step.value = 'input'; return }
            scrapeData.value = { appInfo: scrapeResult.appInfo, reviews: scrapeResult.reviews, negativeCount: scrapeResult.negativeCount }

            step.value = 'analyzing'
            loadingMessage.value = `Analyzing ${scrapeResult.negativeCount} complaints with Kimi AI…`
            await runAnalysis(scrapeResult.reviews!, scrapeResult.appInfo)
        } catch (err: any) {
            error.value = err.response?.data?.error || err.message || 'Unexpected error'
            step.value = 'input'
        }
    }

    async function analyzeManual() {
        step.value = 'analyzing'
        loadingMessage.value = 'Analyzing feedback with Kimi AI…'
        try {
            await runAnalysis([], undefined, manualText.value)
        } catch (err: any) {
            error.value = err.response?.data?.error || err.message || 'Unexpected error'
            step.value = 'input'
        }
    }

    async function runAnalysis(reviews: Review[], appInfo?: AppInfo, manualTextVal?: string) {
        const analyzeRes = await axios.post<AnalyzeResponse>(`${API_BASE}/analyze`, {
            reviews, appInfo, manualText: manualTextVal,
        })
        if (!analyzeRes.data.success) { error.value = analyzeRes.data.error || 'AI analysis failed'; step.value = 'input'; return }
        prd.value = analyzeRes.data.prd!

        // Immediately extract issues
        step.value = 'extracting'
        loadingMessage.value = 'Extracting actionable issues from PRD…'
        try {
            const issuesRes = await axios.post<IssuesResponse>(`${API_BASE}/ticket/issues`, {
                prd: prd.value,
                reviews: scrapeData.value?.reviews || [],
            })
            if (issuesRes.data.success && issuesRes.data.issues) {
                issues.value = issuesRes.data.issues
            }
        } catch {
            // Non-fatal — board just won't populate
        }

        step.value = 'result'
        activeView.value = 'prd' // Changed from 'board' to keep focus on PRD

        // Persist session to localStorage so user can resume later
        saveSession({
            inputMode: inputMode.value,
            inputValue: inputValue.value,
            appName: prd.value!.appName,
            appInfo: scrapeData.value?.appInfo,
            negativeCount: scrapeData.value?.negativeCount,
            prd: prd.value!,
            issues: issues.value,
            ticketCache: ticketCache.value,
            savedAt: new Date().toISOString(),
        })
    }

    // ── Dev Ticket ───────────────────────────────────────────
    async function generateTicket(issue: Issue): Promise<DevTicket | null> {
        if (ticketCache.value[issue.id]) return ticketCache.value[issue.id] ?? null
        generatingTicketId.value = issue.id
        try {
            const res = await axios.post<TicketResponse>(`${API_BASE}/ticket`, {
                issue,
                appInfo: scrapeData.value?.appInfo,
            })
            if (res.data.success && res.data.ticket) {
                ticketCache.value[issue.id] = res.data.ticket
                return res.data.ticket
            }
            return null
        } finally {
            generatingTicketId.value = null
        }
    }

    // ── Export ───────────────────────────────────────────────
    function exportFullReport() {
        if (!prd.value) return
        const lines: string[] = [
            `# PRD Report — ${prd.value.appName}`,
            `**Date:** ${prd.value.analysisDate}  |  **Platform:** ${prd.value.platform}  |  **Confidence:** ${prd.value.confidence}`,
            '',
            `## Problem Statement`,
            prd.value.problemStatement.summary,
            '',
            `## Issue Board`,
        ]
        for (const issue of issues.value) {
            lines.push(`### [${issue.severity.toUpperCase()}] ${issue.title}`)
            lines.push(`**Status:** ${issue.status}  |  **Effort:** ${issue.estimatedEffort}  |  **Affects:** ~${issue.affectedUsers}% of users`)
            lines.push(`${issue.description}`)
            if (issue.pmNotes) lines.push(`> 📝 PM Notes: ${issue.pmNotes}`)
            lines.push('')
            const cached = ticketCache.value[issue.id]
            if (cached) {
                lines.push(`#### Dev Ticket`)
                lines.push(`**What to build:**`)
                cached.whatToBuild.forEach(w => lines.push(`- ${w}`))
                lines.push(`**Acceptance Criteria:**`)
                cached.acceptanceCriteria.forEach(ac => lines.push(`- [ ] ${ac.what}`))
                lines.push('')
            }
        }
        downloadText(lines.join('\n'), `PRD-${prd.value.appName.replace(/\s+/g, '-')}-${prd.value.analysisDate}.md`, 'text/markdown')
    }

    function exportSprintPack() {
        const sprintIssues = issues.value.filter(i => i.status === 'in-sprint')
        if (!sprintIssues.length) return
        const lines: string[] = [`# Sprint Pack — ${prd.value?.appName || 'App'}\n`]
        for (const issue of sprintIssues) {
            const ticket = ticketCache.value[issue.id]
            lines.push(`## ${issue.title}`)
            lines.push(`> ${issue.description}\n`)
            if (ticket) {
                lines.push(`**What to build:**`)
                ticket.whatToBuild.forEach(w => lines.push(`- ${w}`))
                lines.push(`\n**Acceptance Criteria:**`)
                ticket.acceptanceCriteria.forEach(ac => lines.push(`- [ ] ${ac.what}`))
                lines.push('')
            }
        }
        downloadText(lines.join('\n'), `SprintPack-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown')
    }

    function exportJSON() {
        if (!prd.value) return
        const blob = new Blob([JSON.stringify({ prd: prd.value, issues: issues.value }, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Review2PRD-${prd.value.appName.replace(/\s+/g, '-')}-${prd.value.analysisDate}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    function downloadText(content: string, filename: string, mimeType: string) {
        const blob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = filename; a.click()
        URL.revokeObjectURL(url)
    }

    function reset() {
        step.value = 'input'; prd.value = null; issues.value = []; error.value = null
        scrapeData.value = null; ticketCache.value = {}; generatingTicketId.value = null
        loadingMessage.value = ''; activeView.value = 'prd'
        clearSession()
    }

    // ── Session restore ───────────────────────────────────────
    function restoreSession(session: PersistedSession) {
        inputMode.value = session.inputMode
        inputValue.value = session.inputValue
        appName.value = session.appName
        prd.value = session.prd
        issues.value = session.issues
        ticketCache.value = session.ticketCache || {}
        scrapeData.value = {
            appInfo: session.appInfo,
            negativeCount: session.negativeCount,
        }
        activeView.value = 'board'
        step.value = 'result'
    }

    return {
        step, inputMode, inputValue, manualText, appName, activeView,
        scrapeData, prd, issues, ticketCache, generatingTicketId,
        error, loadingMessage, isLoading, triageStats,
        generate, reset, restoreSession, generateTicket,
        exportFullReport, exportSprintPack, exportJSON,
    }
}
