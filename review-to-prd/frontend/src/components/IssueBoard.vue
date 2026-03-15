<template>
  <div class="issue-board">
    <!-- Triage Stats Bar -->
    <div class="stats-bar">
      <div class="stat-group">
        <div class="big-stat">
          <span class="big-stat-number">{{ stats.total }}</span>
          <span class="big-stat-label">Total Issues</span>
        </div>
        <div class="severity-stats">
          <div class="sev-dot critical" v-if="stats.bySeverity.critical">
            {{ stats.bySeverity.critical }} Critical
          </div>
          <div class="sev-dot high" v-if="stats.bySeverity.high">
            {{ stats.bySeverity.high }} High
          </div>
          <div class="sev-dot medium" v-if="stats.bySeverity.medium">
            {{ stats.bySeverity.medium }} Medium
          </div>
          <div class="sev-dot low" v-if="stats.bySeverity.low">
            {{ stats.bySeverity.low }} Low
          </div>
        </div>
      </div>

      <div class="triage-progress">
        <div class="progress-label">
          <span>Triaged</span>
          <strong>{{ stats.triaged }} / {{ stats.total }}</strong>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" :style="{ width: stats.pct + '%' }"></div>
        </div>
        <span class="progress-pct">{{ stats.pct }}%</span>
      </div>

      <div class="status-counts">
        <div class="status-count in-sprint">
          <span class="status-dot"></span>
          {{ stats.byStatus['in-sprint'] }} In Sprint
        </div>
        <div class="status-count wont-fix">
          <span class="status-dot"></span>
          {{ stats.byStatus['wont-fix'] }} Won't Fix
        </div>
        <div class="status-count done">
          <span class="status-dot"></span>
          {{ stats.byStatus['done'] }} Done
        </div>
      </div>

      <div class="board-actions">
        <button
          id="export-sprint-btn"
          class="board-action-btn"
          @click="$emit('export-sprint')"
          :disabled="!stats.byStatus['in-sprint']"
          title="Export In Sprint issues as markdown"
        >
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M14.064 0h.186C15.216 0 16 .784 16 1.75v8.5A1.75 1.75 0 0 1 14.25 12H8.814l-2.814 3.117a.75.75 0 0 1-1.3-.492V12H3.75A1.75 1.75 0 0 1 2 10.25v-8.5C2 .784 2.784 0 3.75 0H14.064Z"/></svg>
          Sprint Pack
        </button>
        <button
          id="export-report-btn"
          class="board-action-btn primary"
          @click="$emit('export-report')"
        >
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Zm-1-5.427 3.22-3.22a.749.749 0 0 1 1.06 0l3.22 3.22a.749.749 0 1 1-1.06 1.06l-1.94-1.939V5.5a.75.75 0 0 0-1.5 0v2.934L4.81 8.97a.749.749 0 1 1-1.06-1.06-.749.749 0 0 1 1.06 0Z"/></svg>
          Full Report
        </button>
      </div>
    </div>

    <!-- Hint -->
    <p class="drag-hint">
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4-8a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>
      Drag cards to reprioritize · Click status to triage · Click <strong>Dev Ticket</strong> to generate a developer spec
    </p>

    <!-- Card Grid (vue-draggable-plus for reordering) -->
    <VueDraggable
      v-model="localIssues"
      class="cards-grid"
      item-key="id"
      handle=".issue-card"
      :animation="200"
      ghost-class="card-ghost"
    >
      <IssueCard
        v-for="issue in localIssues"
        :key="issue.id"
        :issue="issue"
        :is-generating="generatingTicketId === issue.id"
        :has-cached-ticket="!!ticketCache[issue.id]"
        @update:status="updateStatus(issue.id, $event)"
        @update:pm-notes="updateNotes(issue.id, $event)"
        @generate-ticket="$emit('generate-ticket', issue)"
      />
    </VueDraggable>

    <!-- Empty state -->
    <div v-if="localIssues.length === 0" class="empty-board">
      <div class="empty-icon">🎉</div>
      <p>No issues extracted yet. Run an analysis to populate the board.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import IssueCard from './IssueCard.vue'
import type { Issue, DevTicket } from '../types'

const props = defineProps<{
  issues: Issue[]
  generatingTicketId: string | null
  ticketCache: Record<string, DevTicket>
  stats: {
    total: number
    bySeverity: Record<string, number>
    byStatus: Record<string, number>
    triaged: number
    pct: number
  }
}>()

const emit = defineEmits<{
  'update:issues': [value: Issue[]]
  'update:status': [id: string, status: string]
  'update:pmNotes': [id: string, notes: string]
  'generate-ticket': [issue: Issue]
  'export-sprint': []
  'export-report': []
}>()

const localIssues = computed({
  get: () => props.issues,
  set: (val) => emit('update:issues', val),
})

function updateStatus(id: string, status: string) {
  emit('update:status', id, status)
}

function updateNotes(id: string, notes: string) {
  emit('update:pmNotes', id, notes)
}
</script>

<style scoped>
.issue-board {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Stats bar */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: 1rem 1.5rem;
  flex-wrap: wrap;
}

.stat-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.big-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.big-stat-number {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--color-accent), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.big-stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.severity-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.sev-dot {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}
.sev-dot.critical { background: rgba(239,68,68,0.12); color: #f87171; }
.sev-dot.high { background: rgba(245,158,11,0.12); color: #fbbf24; }
.sev-dot.medium { background: rgba(59,130,246,0.12); color: #60a5fa; }
.sev-dot.low { background: rgba(34,197,94,0.1); color: #4ade80; }

/* Progress */
.triage-progress {
  flex: 1;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
.progress-label strong { color: var(--color-text-primary); }
.progress-bar-track {
  height: 6px;
  background: var(--color-surface-2);
  border-radius: 3px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), #22c55e);
  border-radius: 3px;
  transition: width 0.5s ease;
}
.progress-pct {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-align: right;
}

/* Status counts */
.status-counts {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.status-count {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.in-sprint .status-dot { background: #4ade80; }
.wont-fix .status-dot { background: #f87171; }
.done .status-dot { background: var(--color-text-muted); }

/* Board actions */
.board-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}
.board-action-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.875rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text-secondary);
}
.board-action-btn svg { width: 13px; height: 13px; }
.board-action-btn:hover:not(:disabled) {
  background: var(--color-surface-3);
  color: var(--color-text-primary);
}
.board-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.board-action-btn.primary {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}
.board-action-btn.primary:hover {
  background: var(--color-accent-hover);
}

/* Hint */
.drag-hint {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
}
.drag-hint svg { width: 14px; height: 14px; flex-shrink: 0; }

/* Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

@media (max-width: 360px) {
  .cards-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .stats-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .stat-group { justify-content: flex-start; }
  .triage-progress { min-width: unset; }
  .board-actions { margin-left: 0; flex-direction: row; }
  .board-action-btn { flex: 1; justify-content: center; }
}

:global(.card-ghost) {
  opacity: 0.35;
  border: 2px dashed var(--color-accent);
}

/* Empty */
.empty-board {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-muted);
}
.empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
</style>
