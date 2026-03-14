<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="$emit('close')" id="ticket-modal">
        <div class="modal-panel">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title-group">
              <div class="modal-icon">🎫</div>
              <div>
                <h2 class="modal-title">{{ ticket?.title || 'Dev Ticket' }}</h2>
                <p class="modal-subtitle">{{ issue?.category }} · {{ issue?.estimatedEffort }}</p>
              </div>
            </div>
            <div class="modal-header-actions">
              <button id="copy-markdown-btn" class="copy-btn" @click="copyMarkdown" :class="{ copied: copyState === 'md' }">
                {{ copyState === 'md' ? '✓ Copied!' : '📋 Copy MD' }}
              </button>
              <button id="copy-json-btn" class="copy-btn" @click="copyJSON" :class="{ copied: copyState === 'json' }">
                {{ copyState === 'json' ? '✓ Copied!' : '{ } JSON' }}
              </button>
              <button class="close-btn" @click="$emit('close')" id="close-ticket-modal">
                <svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="modal-body" v-if="ticket">
            <!-- User POV -->
            <section class="ticket-section">
              <h3 class="section-heading">
                <span class="section-emoji">👤</span>
                User's Perspective
              </h3>
              <p class="user-pov">{{ ticket.userPOV }}</p>
              <div class="quote-list" v-if="issue?.userQuotes?.length">
                <blockquote v-for="(q, i) in issue.userQuotes.slice(0, 3)" :key="i" class="ref-quote">
                  "{{ q }}"
                </blockquote>
              </div>
            </section>

            <!-- What to Build -->
            <section class="ticket-section">
              <h3 class="section-heading">
                <span class="section-emoji">🔧</span>
                What to Build
              </h3>
              <ul class="build-list">
                <li v-for="(item, i) in ticket.whatToBuild" :key="i" class="build-item">
                  <span class="build-num">{{ String(i + 1).padStart(2, '0') }}</span>
                  {{ item }}
                </li>
              </ul>
            </section>

            <!-- Acceptance Criteria -->
            <section class="ticket-section">
              <h3 class="section-heading">
                <span class="section-emoji">✅</span>
                Acceptance Criteria
              </h3>
              <ul class="criteria-list">
                <li
                  v-for="(ac, i) in ticket.acceptanceCriteria"
                  :key="i"
                  class="criteria-item"
                  :class="{ completed: ac.done }"
                  @click="toggleCriteria(i)"
                >
                  <span class="criteria-checkbox">{{ ac.done ? '☑' : '☐' }}</span>
                  {{ ac.what }}
                </li>
              </ul>
            </section>

            <!-- Two columns: Edge Cases + Out of Scope -->
            <div class="two-col-sections">
              <section class="ticket-section">
                <h3 class="section-heading">
                  <span class="section-emoji">⚠️</span>
                  Edge Cases
                </h3>
                <ul class="simple-list">
                  <li v-for="(e, i) in ticket.edgeCases" :key="i">{{ e }}</li>
                </ul>
              </section>

              <section class="ticket-section">
                <h3 class="section-heading">
                  <span class="section-emoji">🚫</span>
                  Out of Scope
                </h3>
                <ul class="simple-list oos">
                  <li v-for="(o, i) in ticket.outOfScope" :key="i">{{ o }}</li>
                </ul>
              </section>
            </div>

            <!-- Technical Notes -->
            <section class="ticket-section" v-if="ticket.technicalNotes">
              <h3 class="section-heading">
                <span class="section-emoji">💡</span>
                Technical Notes
              </h3>
              <p class="tech-notes">{{ ticket.technicalNotes }}</p>
            </section>
          </div>

          <!-- Loading state inside modal -->
          <div v-else class="modal-loading">
            <div class="modal-spinner"></div>
            <p>Generating developer spec with Kimi AI…</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DevTicket, Issue } from '../types'

const props = defineProps<{
  visible: boolean
  ticket: DevTicket | null
  issue: Issue | null
}>()

const emit = defineEmits<{
  close: []
  'update:criteria': [index: number, done: boolean]
}>()

const copyState = ref<'md' | 'json' | null>(null)

function toggleCriteria(index: number) {
  if (!props.ticket) return
  emit('update:criteria', index, !props.ticket.acceptanceCriteria[index].done)
}

function buildMarkdown(): string {
  if (!props.ticket || !props.issue) return ''
  const t = props.ticket
  const lines = [
    `## 🎫 ${t.title}`,
    `**Category:** ${props.issue.category}  |  **Effort:** ${props.issue.estimatedEffort}  |  **Severity:** ${props.issue.severity}`,
    '',
    `### 👤 User's Perspective`,
    t.userPOV,
    '',
    `### 🔧 What to Build`,
    ...t.whatToBuild.map(w => `- ${w}`),
    '',
    `### ✅ Acceptance Criteria`,
    ...t.acceptanceCriteria.map(ac => `- [${ac.done ? 'x' : ' '}] ${ac.what}`),
    '',
    `### ⚠️ Edge Cases`,
    ...t.edgeCases.map(e => `- ${e}`),
    '',
    `### 🚫 Out of Scope`,
    ...t.outOfScope.map(o => `- ${o}`),
    '',
    `### 💡 Technical Notes`,
    t.technicalNotes,
  ]
  return lines.join('\n')
}

async function copyMarkdown() {
  await navigator.clipboard.writeText(buildMarkdown())
  copyState.value = 'md'
  setTimeout(() => copyState.value = null, 2000)
}

async function copyJSON() {
  await navigator.clipboard.writeText(JSON.stringify(props.ticket, null, 2))
  copyState.value = 'json'
  setTimeout(() => copyState.value = null, 2000)
}
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 1rem;
}

.modal-panel {
  width: min(680px, 96vw);
  max-height: calc(100vh - 2rem);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}

/* Transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s, transform 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translateX(40px); }

/* Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border-subtle);
  flex-shrink: 0;
}

.modal-title-group {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.modal-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.modal-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.2rem;
  line-height: 1.3;
}

.modal-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin: 0;
  text-transform: capitalize;
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.copy-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.copy-btn:hover { background: var(--color-surface-3); color: var(--color-text-primary); }
.copy-btn.copied { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.35); color: #4ade80; }

.close-btn {
  width: 32px; height: 32px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;
}
.close-btn:hover { background: var(--color-surface-3); color: var(--color-text-primary); }
.close-btn svg { width: 15px; height: 15px; }

/* Body */
.modal-body {
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.ticket-section {}

.section-heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin: 0 0 0.875rem;
}
.section-emoji { font-size: 1rem; }

.user-pov {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0 0 0.875rem;
}

.quote-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.ref-quote {
  margin: 0;
  padding: 0.5rem 0.875rem;
  background: var(--color-surface-2);
  border-left: 2px solid var(--color-accent);
  border-radius: 0 4px 4px 0;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

.build-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.build-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.build-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-accent);
  background: var(--color-accent-muted);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.criteria-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.criteria-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  padding: 0.5rem 0.75rem;
  background: var(--color-surface-2);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  line-height: 1.5;
}
.criteria-item:hover { background: var(--color-surface-3); }
.criteria-item.completed { color: var(--color-text-muted); text-decoration: line-through; }
.criteria-checkbox { font-size: 1.1rem; flex-shrink: 0; }

.two-col-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 560px) {
  .two-col-sections { grid-template-columns: 1fr; }
}

.simple-list {
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.simple-list li {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  padding-left: 1rem;
  position: relative;
  line-height: 1.5;
}
.simple-list li::before {
  content: '△';
  position: absolute;
  left: 0;
  color: var(--color-warning);
  font-size: 0.7rem;
  top: 3px;
}
.simple-list.oos li::before { content: '—'; color: var(--color-text-muted); top: 0; }

.tech-notes {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0;
  padding: 0.875rem 1rem;
  background: var(--color-surface-2);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-success);
}

/* Loading */
.modal-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}
.modal-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
