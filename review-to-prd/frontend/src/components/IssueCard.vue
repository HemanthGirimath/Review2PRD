<template>
  <div class="issue-card" :class="[`severity-${issue.severity}`, `status-${issue.status}`]">
    <!-- Top row: category + severity badge -->
    <div class="card-top">
      <span class="category-tag">{{ issue.category }}</span>
      <span class="severity-badge" :class="issue.severity">{{ issue.severity }}</span>
    </div>

    <!-- Title -->
    <h3 class="issue-title">{{ issue.title }}</h3>

    <!-- Description -->
    <p class="issue-desc">{{ issue.description }}</p>

    <!-- Stat pills -->
    <div class="stat-row">
      <div class="stat-pill">
        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z"/></svg>
        ~{{ issue.affectedUsers }}% affected
      </div>
      <div class="stat-pill">
        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 5.25C1 4.01 2.01 3 3.25 3h9.5C13.99 3 15 4.01 15 5.25v5.5C15 11.99 13.99 13 12.75 13h-9.5C2.01 13 1 11.99 1 10.75ZM3.25 4.5a.75.75 0 0 0-.75.75v.154l5.5 3.135 5.5-3.135V5.25a.75.75 0 0 0-.75-.75Z"/></svg>
        {{ issue.estimatedEffort }}
      </div>
    </div>

    <!-- Top user quote -->
    <blockquote v-if="issue.userQuotes?.[0]" class="quote">
      "{{ issue.userQuotes[0] }}"
    </blockquote>

    <!-- PM Notes (editable inline) -->
    <div class="pm-notes-wrapper">
      <textarea
        class="pm-notes"
        :placeholder="`📝 PM notes…`"
        :value="issue.pmNotes"
        @input="$emit('update:pmNotes', ($event.target as HTMLTextAreaElement).value)"
        rows="2"
      ></textarea>
    </div>

    <!-- Footer: status + ticket button -->
    <div class="card-footer">
      <select
        class="status-select"
        :class="`status-${issue.status}`"
        :value="issue.status"
        @change="$emit('update:status', ($event.target as HTMLSelectElement).value)"
        :id="`status-${issue.id}`"
      >
        <option value="open">🔵 Open</option>
        <option value="in-sprint">🟢 In Sprint</option>
        <option value="wont-fix">🔴 Won't Fix</option>
        <option value="done">✅ Done</option>
      </select>

      <button
        class="ticket-btn"
        :class="{ 'is-loading': isGenerating }"
        @click="$emit('generate-ticket')"
        :disabled="isGenerating"
        :id="`ticket-btn-${issue.id}`"
      >
        <span v-if="isGenerating" class="btn-spinner"></span>
        <svg v-else viewBox="0 0 16 16" fill="currentColor"><path d="M14.064 0h.186C15.216 0 16 .784 16 1.75v8.5A1.75 1.75 0 0 1 14.25 12H8.814l-2.814 3.117a.75.75 0 0 1-1.3-.492V12H3.75A1.75 1.75 0 0 1 2 10.25v-8.5C2 .784 2.784 0 3.75 0H14.064Z"/></svg>
        {{ isGenerating ? 'Generating…' : hasCachedTicket ? 'View Ticket' : 'Dev Ticket' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Issue } from '../types'

const props = defineProps<{
  issue: Issue
  isGenerating: boolean
  hasCachedTicket: boolean
}>()

defineEmits<{
  'update:status': [value: string]
  'update:pmNotes': [value: string]
  'generate-ticket': []
}>()
</script>

<style scoped>
.issue-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  cursor: grab;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.2s;
  position: relative;
}

.issue-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.issue-card.severity-critical::before { background: var(--color-danger); }
.issue-card.severity-high::before { background: var(--color-warning); }
.issue-card.severity-medium::before { background: var(--color-info); }
.issue-card.severity-low::before { background: var(--color-success); }

.issue-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  border-color: var(--color-border);
}

.issue-card.status-done {
  opacity: 0.55;
}
.issue-card.status-wont-fix {
  opacity: 0.4;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-tag {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a8a7a;
  background: var(--color-surface-2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.severity-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
}
.severity-badge.critical { background: rgba(239,68,68,0.15); color: #f87171; }
.severity-badge.high { background: rgba(245,158,11,0.15); color: #fbbf24; }
.severity-badge.medium { background: rgba(59,130,246,0.15); color: #60a5fa; }
.severity-badge.low { background: rgba(34,197,94,0.12); color: #4ade80; }

.issue-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.4;
}

.issue-desc {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stat-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  background: var(--color-surface-2);
  padding: 0.25rem 0.6rem;
  border-radius: 100px;
}
.stat-pill svg { width: 11px; height: 11px; }

.quote {
  margin: 0;
  padding: 0.625rem 0.875rem;
  background: var(--color-surface-2);
  border-left: 2px solid var(--color-accent);
  border-radius: 0 6px 6px 0;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  font-style: italic;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pm-notes-wrapper { flex: 1; }

.pm-notes {
  width: 100%;
  background: transparent;
  border: 1px dashed var(--color-border-subtle);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-family: inherit;
  padding: 0.5rem 0.625rem;
  resize: none;
  outline: none;
  line-height: 1.5;
  transition: border-color 0.2s;
}
.pm-notes::placeholder { color: var(--color-text-muted); }
.pm-notes:focus { border-color: var(--color-accent); border-style: solid; }

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: auto;
  padding-top: 0.25rem;
  flex-wrap: wrap;
}

@media (max-width: 380px) {
  .card-footer { flex-direction: column; align-items: stretch; }
  .ticket-btn { justify-content: center; }
}

.status-select {
  flex: 1;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-family: inherit;
  padding: 0.4rem 0.5rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.status-select:focus { border-color: var(--color-accent); }
.status-select.status-in-sprint { color: #4ade80; border-color: rgba(34,197,94,0.35); }
.status-select.status-wont-fix { color: #f87171; border-color: rgba(239,68,68,0.35); }
.status-select.status-done { color: var(--color-text-muted); }

.ticket-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.875rem;
  background: var(--color-accent-muted);
  color: var(--color-accent-hover);
  border: 1px solid rgba(232,228,220,0.1);
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.ticket-btn svg { width: 13px; height: 13px; }
.ticket-btn:hover:not(:disabled) {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}
.ticket-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-spinner {
  width: 12px; height: 12px;
  border: 2px solid rgba(232,228,220,0.1);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
