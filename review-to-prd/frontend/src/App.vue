<template>
  <div class="app">
    <!-- UNIVERSAL STICKY NAV (all states) -->
    <header class="top-nav">
      <div class="nav-logo" @click="router.push('/app')" style="cursor: pointer;" title="Go to Dashboard">
        <div class="logo-dot"></div>
        <span class="logo-name-sm">Review<span class="logo-accent">2</span>PRD</span>
      </div>

      <!-- Center: view toggle + app meta (result only) -->
      <div class="nav-center" v-if="step === 'result'">
        <div class="compact-meta" v-if="prd">
          <span class="compact-app">{{ prd.appName }}</span>
          <span class="compact-sep">·</span>
          <span class="compact-date">{{ prd.analysisDate }}</span>
          <span class="compact-conf" v-if="prd.confidence"> · {{ prd.confidence }}</span>
        </div>
        <div class="view-toggle">
          <button id="view-prd-btn" class="toggle-btn" :class="{ active: activeView === 'prd' }" @click="activeView = 'prd'">📄 PRD</button>
          <button id="view-board-btn" class="toggle-btn" :class="{ active: activeView === 'board' }" @click="activeView = 'board'">
            🗂 Board<span v-if="issues.length" class="toggle-badge">{{ issues.length }}</span>
          </button>
        </div>
      </div>
      <div class="nav-center" v-else>
        <!-- placeholder to keep right-side aligned -->
      </div>

      <!-- Right: always visible -->
      <div class="nav-right">
        <button v-if="step === 'result'" class="nav-btn" @click="reset" id="new-analysis-btn">+ New</button>
        <button id="history-nav-btn" class="nav-btn history-nav-btn" @click="historyOpen = true">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 1.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h2a.75.75 0 0 1 0 1.5h-2A1.75 1.75 0 0 1 0 10.25v-8.5C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v8.5A1.75 1.75 0 0 1 14.25 12h-2a.75.75 0 0 1 0-1.5h2a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25Zm-1 3h14.5a.75.75 0 0 0 0-1.5H.75a.75.75 0 0 0 0 1.5ZM8 9.5a.75.75 0 0 0-.75.75v4l-1.22-1.22a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06L8.75 14.25v-4A.75.75 0 0 0 8 9.5Z"/></svg>
          History
          <span v-if="historyItems.length" class="nav-history-badge">{{ historyItems.length }}</span>
        </button>
        <button id="settings-nav-btn" class="nav-btn" @click="settingsOpen = true" title="AI Settings">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5.78-1.554.432-.249a.174.174 0 0 0 .022-.283l-.934-1.618a.174.174 0 0 0-.214-.047l-.433.25a1.706 1.706 0 0 1-1.742-.032c-.007-.004-.014-.009-.022-.014a1.708 1.708 0 0 1-.806-1.463l-.001-.484a.174.174 0 0 0-.174-.174H8.05a.174.174 0 0 0-.174.174l-.001.484a1.71 1.71 0 0 1-1.48 1.702l-.432.25a1.702 1.702 0 0 1-1.743-.034l-.43-.245a.175.175 0 0 0-.215.047l-.934 1.618a.174.174 0 0 0 .022.283l.432.249a1.702 1.702 0 0 1 .821 1.483l-.001.484c0 .02.002.039.006.058a1.703 1.703 0 0 1-.827 1.693l-.432.25a.175.175 0 0 0-.022.282l.934 1.619c.05.086.162.115.248.065l.432-.25a1.7 1.7 0 0 1 1.742.031l.022.014a1.71 1.71 0 0 1 .806 1.463l.001.48c0 .097.078.175.175.175h1.868a.175.175 0 0 0 .175-.175l.001-.484a1.711 1.711 0 0 1 1.48-1.702l.432-.25a1.7 1.7 0 0 1 1.743.033l.43.246a.175.175 0 0 0 .215-.047l.934-1.618a.175.175 0 0 0-.022-.283l-.432-.249a1.703 1.703 0 0 1-.821-1.483l.001-.484a1.7 1.7 0 0 1 .827-1.693Z"/></svg>
        </button>
        <div v-if="user" class="user-menu">
          <button class="user-profile-trigger" @click="profileOpen = true" title="View Profile">
            {{ userEmail }}
          </button>
          <button id="logout-btn" class="logout-btn" @click="handleLogout" title="Sign out">
            <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"/></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- HERO TAGLINE (input + loading only) -->
    <div class="app-hero" v-if="step !== 'result'">
      <div class="logo-group">
        <div class="logo-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#e8e4dc" />
            <path d="M8 10h16M8 16h10M8 22h13" stroke="#1b1b18" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="24" cy="22" r="4" fill="#1b1b18" fill-opacity=".9"/>
            <path d="M22.5 22l1 1 2-2" stroke="#e8e4dc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 class="logo-name">Review<span class="logo-accent">2</span>PRD</h1>
          <p class="logo-tagline">Turn complaints into actionable product specs</p>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <main class="app-main">
      <!-- Input -->
      <div v-if="step === 'input'">
        <div class="card main-card">
          <InputForm
            :model-value="inputMode"
            :input-value="inputValue"
            :manual-text="manualText"
            :app-name="appName"
            :error="error"
            @update:model-value="inputMode = $event"
            @update:input-value="inputValue = $event"
            @update:manual-text="manualText = $event"
            @update:app-name="appName = $event"
            @generate="handleGenerate"
          />
        </div>

        <!-- Recent Analyses (shown on input screen when history exists) -->
        <div v-if="historyItems.length" class="recent-analyses">
          <div class="recent-header">
            <span class="recent-label">📂 Recent Analyses</span>
            <button class="recent-view-all" @click="historyOpen = true">View all →</button>
          </div>
          <div class="recent-grid">
            <button
              v-for="item in historyItems.slice(0, 4)"
              :key="item.id"
              class="recent-item"
              @click="loadHistory(item)"
            >
              <span class="recent-platform">{{ platformEmoji(item.platform) }}</span>
              <div class="recent-info">
                <div class="recent-app-name">{{ item.app_name }}</div>
                <div class="recent-meta">{{ item.issues?.length || 0 }} issues · {{ formatDate(item.analyzed_at) }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading (scraping / analyzing / extracting) -->
      <div v-else-if="isLoading" class="card loading-card">
        <LoadingState :step="step as any" :message="loadingMessage" />
      </div>

      <!-- Result views -->
      <div v-else-if="step === 'result'" class="result-wrapper">
        <!-- PRD View -->
        <div v-if="activeView === 'prd'">
          <PRDDisplay
            v-if="prd"
            :prd="prd"
            :app-info="scrapeData?.appInfo"
            @reset="reset"
            @export-j-s-o-n="exportJSON"
          />
        </div>

        <!-- Issue Board View -->
        <div v-if="activeView === 'board'">
          <IssueBoard
            :issues="issues"
            :generating-ticket-id="generatingTicketId"
            :ticket-cache="ticketCache"
            :stats="triageStats"
            @update:issues="issues = $event"
            @update:status="updateIssueStatus"
            @update:pm-notes="updateIssuePMNotes"
            @generate-ticket="handleGenerateTicket"
            @export-sprint="exportSprintPack"
            @export-report="exportFullReport"
          />
        </div>
      </div>
    </main>

    <!-- Dev Ticket Modal -->
    <DevTicketModal
      :visible="!!ticketModalIssue"
      :ticket="ticketModalIssue ? ticketCache[ticketModalIssue.id] || null : null"
      :issue="ticketModalIssue"
      @close="ticketModalIssue = null"
      @update:criteria="updateTicketCriteria"
    />

    <!-- AI Settings Modal -->
    <SettingsModal
      :visible="settingsOpen"
      @close="settingsOpen = false"
    />

    <!-- Resume Session Banner -->
    <ResumeModal
      :session="savedSession"
      @resume="handleResume"
      @start-fresh="handleStartFresh"
    />

    <!-- User Profile Modal -->
    <ProfileModal
      :visible="profileOpen"
      :user="user"
      @close="profileOpen = false"
      @open-settings="profileOpen = false; settingsOpen = true"
    />

    <!-- History Drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="historyOpen" class="drawer-overlay" @click.self="historyOpen = false">
          <div class="history-drawer">
            <div class="drawer-header">
              <h3 class="drawer-title">📂 Past Analyses</h3>
              <button class="drawer-close" @click="historyOpen = false">✕</button>
            </div>
            <div v-if="historyLoading" class="drawer-loading">Loading…</div>
            <div v-else-if="!historyItems.length" class="drawer-empty">
              <p>No saved analyses yet.</p>
              <p class="drawer-hint">Complete an analysis to save it here automatically.</p>
            </div>
            <ul v-else class="history-list">
              <li
                v-for="item in historyItems"
                :key="item.id"
                class="history-item"
                @click="loadHistory(item)"
              >
                <div class="history-item-icon">
                  <img v-if="item.prd?.appName" src="" style="display:none" />
                  <span>{{ platformEmoji(item.platform) }}</span>
                </div>
                <div class="history-item-info">
                  <div class="history-app">{{ item.app_name }}</div>
                  <div class="history-meta">
                    <span>{{ item.issues?.length || 0 }} issues</span>
                    <span class="meta-sep">·</span>
                    <span>{{ formatDate(item.analyzed_at) }}</span>
                  </div>
                </div>
                <button
                  class="history-delete-btn"
                  @click.stop="deleteHistoryItem(item.id)"
                  title="Delete"
                >✕</button>
              </li>
            </ul>
            <div v-if="!supabaseConfigured" class="drawer-warn">
              ⚠️ Connect Supabase to save analyses across devices.
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <footer class="app-footer">
      <p>Built with Ollama + Kimi K2.5 · <span>Review2PRD</span></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InputForm from './components/InputForm.vue'
import LoadingState from './components/LoadingState.vue'
import PRDDisplay from './components/PRDDisplay.vue'
import IssueBoard from './components/IssueBoard.vue'
import DevTicketModal from './components/DevTicketModal.vue'
import SettingsModal from './components/SettingsModal.vue'
import ProfileModal from './components/ProfileModal.vue'
import ResumeModal from './components/ResumeModal.vue'
import { usePRD } from './composables/usePRD'
import { useAuth } from './composables/useAuth'
import { useSessionCache, type PersistedSession } from './composables/useSessionCache'
import { saveAnalysis, listAnalyses, deleteAnalysis, type SavedAnalysis } from './lib/analyses'
import { supabase } from './lib/supabase'
import type { Issue } from './types'

const {
  step, inputMode, inputValue, manualText, appName, activeView,
  scrapeData, prd, issues, ticketCache, generatingTicketId,
  error, loadingMessage, isLoading, triageStats,
  generate, reset, restoreSession, generateTicket,
  exportFullReport, exportSprintPack, exportJSON,
} = usePRD()

const router = useRouter()
const { user, logout } = useAuth()
const { savedSession, dismiss, clear } = useSessionCache()

const supabaseConfigured = computed(() => !!supabase)
const userEmail = computed(() => user.value?.email?.split('@')[0] || '')

const ticketModalIssue = ref<Issue | null>(null)
const historyOpen = ref(false)
const settingsOpen = ref(false)
const profileOpen = ref(false)
const historyLoading = ref(false)
const historyItems = ref<SavedAnalysis[]>([])

async function handleLogout() {
  await logout()
}

onMounted(async () => {
  // 1. Load history list for Recent Analyses grid
  await fetchHistory()

  // 2. Auto-restore session from cache if it exists (so refresh doesn't lose work)
  if (savedSession.value && step.value === 'input') {
    restoreSession(savedSession.value)
    // Don't need to dismiss() because it wasn't a choice, it's just stickiness
  }
})

async function fetchHistory() {
  if (historyLoading.value) return
  historyLoading.value = true
  historyItems.value = await listAnalyses()
  historyLoading.value = false
}

import { watch } from 'vue'
// Only fetch when drawer opens if we haven't already
watch(historyOpen, async (val) => { if (val) await fetchHistory() })

function loadHistory(item: SavedAnalysis) {
  restoreSession({
    inputMode: (item.input_mode as any) || 'google-play',
    inputValue: item.input_value || '',
    appName: item.app_name,
    prd: item.prd,
    issues: item.issues,
    ticketCache: item.ticket_cache,
    savedAt: item.analyzed_at,
  })
  historyOpen.value = false
}

async function deleteHistoryItem(id: string) {
  await deleteAnalysis(id)
  historyItems.value = historyItems.value.filter(i => i.id !== id)
}

function platformEmoji(platform: string | null) {
  if (platform === 'ios') return '🍎'
  if (platform === 'android') return '🤖'
  return '📱'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function handleResume(session: PersistedSession) {
  restoreSession(session)
  dismiss()
}

function handleStartFresh() {
  clear()
  dismiss()
}

async function handleGenerateTicket(issue: Issue) {
  ticketModalIssue.value = issue
  await generateTicket(issue)
}

function updateIssueStatus(id: string, status: string) {
  const issue = issues.value.find(i => i.id === id)
  if (issue) issue.status = status as any
}

function updateIssuePMNotes(id: string, notes: string) {
  const issue = issues.value.find(i => i.id === id)
  if (issue) issue.pmNotes = notes
}

function updateTicketCriteria(index: number, done: boolean) {
  if (!ticketModalIssue.value) return
  const ticket = ticketCache.value[ticketModalIssue.value.id]
  if (ticket?.acceptanceCriteria?.[index]) {
    ticket.acceptanceCriteria[index].done = done
  }
}

// ── Analysis Wrap-up ──────────────────────────────────────
async function handleGenerate() {
  await generate()
  if (step.value === 'result' && prd.value) {
    // Only save brand new analyses to history, ignore resumes
    await saveAnalysis({
      appName: prd.value.appName,
      platform: prd.value.platform || '',
      inputValue: inputValue.value,
      inputMode: inputMode.value,
      prd: prd.value,
      issues: issues.value,
      ticketCache: ticketCache.value,
    })
    await fetchHistory() // Refresh the local list
  }
}
</script>

<style>
/* ── Global base ───────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }

:root {
  --color-bg: #1b1b18;
  --color-surface: #232320;
  --color-surface-2: #2a2a26;
  --color-surface-3: #323230;
  --color-border: #38382e;
  --color-border-subtle: #2e2e28;
  --color-text-primary: #e8e6e0;
  --color-text-secondary: #8a8a80;
  --color-text-muted: #4a4a44;
  --color-accent: #e8e4dc;
  --color-accent-hover: #f5f0e8;
  --color-accent-muted: rgba(255,255,255,0.06);
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
  --color-success: #22c55e;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: 'Satoshi', 'Instrument Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

#app { min-height: 100vh; display: flex; flex-direction: column; }

.app { display: flex; flex-direction: column; min-height: 100vh; }

/* Nav */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  background: rgba(27, 27, 24, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1.5rem;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
}

.nav-center {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

@media (max-width: 850px) {
  .nav-center { display: none; }
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.875rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  color: #e8e6e0;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.nav-btn:hover { 
  background: rgba(255, 255, 255, 0.06); 
  color: #ffffff; 
}
.nav-btn svg { width: 14px; height: 14px; opacity: 0.8; }

.nav-history-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: var(--color-accent);
  color: var(--color-bg);
  padding: 1px 5px;
  border-radius: 10px;
  margin-left: 2px;
}

/* Hero */
.app-hero {
  padding: 3rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  text-align: left;
}

.logo-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(255,255,255,0.08);
}

.logo-name {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
}

.logo-tagline {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin: 0.25rem 0 0;
}

/* Recent Analyses Grid */
.recent-analyses {
  max-width: 720px;
  margin: 2rem auto 0;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.recent-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.recent-view-all {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 640px) {
  .recent-grid { grid-template-columns: 1fr; }
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: all 0.2s;
}

.recent-item:hover {
  border-color: var(--color-accent);
  background: var(--color-surface-2);
  transform: translateY(-2px);
}

.recent-platform {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.recent-info {
  min-width: 0;
}

.recent-app-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.15rem;
}

/* View toggle */
.view-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 3px;
  gap: 2px;
}
.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: transparent;
  color: #8a8a80;
  transition: all 0.2s;
  white-space: nowrap;
}
.toggle-btn:hover:not(.active) { color: #e8e6e0; }
.toggle-btn.active {
  background: #ffffff;
  color: #1b1b18;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.toggle-btn.active .toggle-badge {
  background: rgba(0,0,0,0.1);
  color: #1b1b18;
}
.toggle-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(255,255,255,0.15);
  padding: 1px 5px;
  border-radius: 10px;
}
.toggle-btn.active .toggle-badge {
  background: rgba(0,0,0,0.1);
  color: #1b1b18;
}

.reset-btn {
  padding: 0.45rem 0.875rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  color: #e8e6e0;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}
.reset-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

/* Main */
.app-main {
  flex: 1;
  padding: 1.5rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.main-card { max-width: 720px; margin: 0 auto; }
.loading-card { max-width: 520px; margin: 0 auto; }

.result-wrapper { width: 100%; }

/* Footer */
.app-footer {
  padding: 1.25rem;
  text-align: center;
  border-top: 1px solid var(--color-border-subtle);
}
.app-footer p {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
.app-footer span { color: var(--color-accent); }

/* User menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border-left: 1px solid var(--color-border-subtle);
  padding-left: 0.75rem;
}
.user-profile-trigger {
  background: transparent;
  border: 1px solid transparent;
  font-size: 0.75rem;
  font-weight: 500;
  color: #e8e6e0;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: inherit;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}
.user-profile-trigger:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px; height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: #8a8a80;
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;
}
.logout-btn:hover { background: rgba(239,68,68,0.1); color: #f87171; border-color: rgba(239,68,68,0.3); }
.logout-btn svg { width: 13px; height: 13px; }

/* History Drawer */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  justify-content: flex-end;
}
.history-drawer {
  width: min(360px, 92vw);
  height: 100vh;
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 40px rgba(0,0,0,0.4);
  overflow: hidden;
}
.drawer-enter-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-leave-active { transition: transform 0.2s ease-in; }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 0.75rem;
  border-bottom: 1px solid var(--color-border-subtle);
  flex-shrink: 0;
}
.drawer-title { margin: 0; font-size: 0.9375rem; font-weight: 600; }
.drawer-close {
  background: none; border: none; color: var(--color-text-muted);
  font-size: 1rem; cursor: pointer; padding: 0.25rem;
  transition: color 0.15s;
}
.drawer-close:hover { color: var(--color-text-primary); }

.drawer-loading, .drawer-empty {
  padding: 2rem 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  text-align: center;
}
.drawer-hint { font-size: 0.8125rem; opacity: 0.7; margin: 0.5rem 0 0; }
.drawer-warn {
  margin: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #fbbf24;
}

.history-list {
  list-style: none;
  padding: 0.75rem;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.history-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-subtle);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.history-item:hover { border-color: var(--color-accent); background: var(--color-surface-3); }
.history-item-icon { font-size: 1.25rem; flex-shrink: 0; }
.history-item-info { flex: 1; min-width: 0; }
.history-app { font-size: 0.875rem; font-weight: 500; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.history-meta { display: flex; gap: 0.4rem; font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.2rem; }
.meta-sep { opacity: 0.4; }
.history-delete-btn {
  background: none; border: none; padding: 0.25rem;
  color: var(--color-text-muted); cursor: pointer; font-size: 0.8rem;
  border-radius: 4px; flex-shrink: 0;
  transition: all 0.15s;
}
.history-delete-btn:hover { color: #f87171; background: rgba(239,68,68,0.1); }
</style>
