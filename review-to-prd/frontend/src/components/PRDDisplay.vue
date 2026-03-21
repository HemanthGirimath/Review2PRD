<template>
  <div class="prd-display">
    <!-- PRD Header -->
    <div class="prd-header">
      <div class="app-identity">
        <div class="app-icon-placeholder" v-if="appInfo?.icon">
          <img :src="appInfo.icon" :alt="prd.appName" />
        </div>
        <div class="app-icon-placeholder empty" v-else>
          {{ prd.appName?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <div class="app-meta">
          <h2 class="app-name">{{ prd.appName }}</h2>
          <div class="app-tags">
            <span class="tag platform-tag" v-if="prd.platform">
              <svg v-if="prd.platform === 'android'" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341A5.5 5.5 0 0 0 12 9.5a5.5 5.5 0 0 0-5.523 5.841L2.5 20h19l-3.977-4.659zM12 1L3.5 6l1.5 2.598L12 4.196l7 4.402L20.5 6 12 1zm0 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>
              <svg v-else-if="prd.platform === 'ios'" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              {{ prd.platform }}
            </span>
            <span class="tag" :class="`priority-${prd.priority}`">
              {{ prd.priority?.toUpperCase() }} PRIORITY
            </span>
            <span class="tag confidence-tag">{{ prd.confidence }} confidence</span>
            <span class="tag date-tag" v-if="prd.totalReviewsAnalyzed">
              {{ prd.totalReviewsAnalyzed }} reviews analyzed
            </span>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <button id="export-json-btn" class="action-btn secondary" @click="$emit('exportJSON')">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Zm-1-5.427 3.22-3.22a.749.749 0 0 1 1.06 0l3.22 3.22a.749.749 0 1 1-1.06 1.06l-1.94-1.939V5.5a.75.75 0 0 0-1.5 0v2.934L4.81 8.97a.749.749 0 1 1-1.06-1.06-.749.749 0 0 1 1.06 0Z"/></svg>
          Export JSON
        </button>
        <button id="new-analysis-btn" class="action-btn primary" @click="$emit('reset')">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z"/></svg>
          New Analysis
        </button>
      </div>
    </div>

    <!-- Effort bar -->
    <div class="effort-bar">
      <div class="effort-item">
        <span class="effort-label">Estimated Effort</span>
        <span class="effort-value">{{ prd.estimatedEffort }}</span>
      </div>
      <div class="effort-divider"></div>
      <div class="effort-item">
        <span class="effort-label">Analysis Date</span>
        <span class="effort-value">{{ prd.analysisDate }}</span>
      </div>
      <div class="effort-divider"></div>
      <div class="effort-item">
        <span class="effort-label">User Stories</span>
        <span class="effort-value">{{ prd.userStories?.length || 0 }}</span>
      </div>
      <div class="effort-divider"></div>
      <div class="effort-item">
        <span class="effort-label">Requirements</span>
        <span class="effort-value">{{ (prd.requirements?.functional?.length || 0) + (prd.requirements?.nonFunctional?.length || 0) }}</span>
      </div>
    </div>

    <!-- Problem Statement -->
    <section class="prd-section problem-section">
      <div class="section-header">
        <div class="section-icon problem">🎯</div>
        <h3 class="section-title">Problem Statement</h3>
      </div>
      <p class="problem-summary">{{ prd.problemStatement?.summary }}</p>

      <div class="two-col">
        <div class="subsection">
          <h4 class="subsection-title">Pain Points</h4>
          <ul class="item-list">
            <li v-for="(point, i) in prd.problemStatement?.painPoints" :key="i" class="item-list-item pain-point">
              <span class="item-bullet pain">⚡</span>
              {{ point }}
            </li>
          </ul>
        </div>

        <div class="subsection">
          <h4 class="subsection-title">User Quotes</h4>
          <div class="quotes-list">
            <blockquote v-for="(quote, i) in prd.problemStatement?.userQuotes" :key="i" class="user-quote">
              {{ quote }}
            </blockquote>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Metrics -->
    <section class="prd-section">
      <div class="section-header">
        <div class="section-icon metrics">📊</div>
        <h3 class="section-title">Success Metrics</h3>
      </div>
      <div class="metrics-grid">
        <div v-for="(metric, i) in prd.successMetrics" :key="i" class="metric-card">
          <div class="metric-number">{{ String(i + 1).padStart(2, '0') }}</div>
          <p class="metric-text">{{ metric }}</p>
        </div>
      </div>
    </section>

    <!-- User Stories -->
    <section class="prd-section">
      <div class="section-header">
        <div class="section-icon stories">👤</div>
        <h3 class="section-title">User Stories</h3>
      </div>
      <div class="stories-list">
        <div v-for="(story, i) in prd.userStories" :key="i" class="story-card">
          <div class="story-line">
            <span class="story-chip as">As a</span>
            <span class="story-text">{{ story.as }}</span>
          </div>
          <div class="story-line">
            <span class="story-chip want">I want</span>
            <span class="story-text">{{ story.iWant }}</span>
          </div>
          <div class="story-line">
            <span class="story-chip so">So that</span>
            <span class="story-text">{{ story.soThat }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Requirements -->
    <section class="prd-section">
      <div class="section-header">
        <div class="section-icon reqs">⚙️</div>
        <h3 class="section-title">Requirements</h3>
      </div>
      <div class="two-col">
        <div class="subsection">
          <h4 class="subsection-title functional">Functional</h4>
          <ul class="item-list">
            <li v-for="(req, i) in prd.requirements?.functional" :key="i" class="item-list-item">
              <span class="item-bullet check">✓</span>
              {{ req }}
            </li>
          </ul>
        </div>
        <div class="subsection">
          <h4 class="subsection-title non-functional">Non-Functional</h4>
          <ul class="item-list">
            <li v-for="(req, i) in prd.requirements?.nonFunctional" :key="i" class="item-list-item">
              <span class="item-bullet check">✓</span>
              {{ req }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Edge Cases + Out of Scope -->
    <div class="two-col bottom-sections">
      <section class="prd-section">
        <div class="section-header">
          <div class="section-icon edge">⚠️</div>
          <h3 class="section-title">Edge Cases</h3>
        </div>
        <ul class="item-list">
          <li v-for="(edge, i) in prd.edgeCases" :key="i" class="item-list-item">
            <span class="item-bullet warn">△</span>
            {{ edge }}
          </li>
        </ul>
      </section>

      <section class="prd-section">
        <div class="section-header">
          <div class="section-icon scope">🚫</div>
          <h3 class="section-title">Out of Scope</h3>
        </div>
        <ul class="item-list">
          <li v-for="(item, i) in prd.outOfScope" :key="i" class="item-list-item">
            <span class="item-bullet muted">—</span>
            {{ item }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PRD, AppInfo } from '../types'

defineProps<{
  prd: PRD
  appInfo?: AppInfo
}>()

defineEmits<{
  reset: []
  exportJSON: []
}>()
</script>

<style scoped>
.prd-display {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fade-in 0.4s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.prd-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.app-identity {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-icon-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  flex-shrink: 0;
}

.app-icon-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-icon-placeholder.empty {
  background: linear-gradient(135deg, var(--color-accent), #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.app-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.app-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.tag svg {
  width: 11px;
  height: 11px;
}

.platform-tag {
  background: var(--color-surface-3);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.priority-critical { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
.priority-high { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
.priority-medium { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }
.priority-low { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }

.confidence-tag {
  background: var(--color-accent-muted);
  color: var(--color-accent-hover);
  border: 1px solid rgba(232,228,220,0.1);
}

.date-tag {
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-subtle);
}

.header-actions {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn svg {
  width: 15px;
  height: 15px;
}

.action-btn.secondary {
  background: var(--color-surface-2);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn.secondary:hover {
  background: var(--color-surface-3);
  color: var(--color-text-primary);
}

.action-btn.primary {
  background: var(--color-accent);
  color: white;
  box-shadow: 0 2px 10px var(--color-accent-glow);
}

.action-btn.primary:hover {
  background: var(--color-accent-hover);
}

/* Effort bar */
.effort-bar {
  display: flex;
  align-items: center;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: 0.875rem 1.5rem;
  overflow-x: auto;
}

.effort-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 120px;
}

.effort-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 500;
}

.effort-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.effort-divider {
  width: 1px;
  height: 36px;
  background: var(--color-border-subtle);
  margin: 0 1.5rem;
  flex-shrink: 0;
}

/* Sections */
.prd-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.section-icon.problem { background: rgba(239,68,68,0.12); }
.section-icon.metrics { background: rgba(59,130,246,0.12); }
.section-icon.stories { background: rgba(232,228,220,0.1); }
.section-icon.reqs { background: rgba(245,158,11,0.12); }
.section-icon.edge { background: rgba(245,158,11,0.12); }
.section-icon.scope { background: rgba(239,68,68,0.08); }

.section-title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

/* Problem section */
.problem-section {
  border-left: 3px solid var(--color-danger);
}

.problem-summary {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0 0 1.25rem;
  padding: 1rem;
  background: var(--color-surface-2);
  border-radius: var(--radius-sm);
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 700px) {
  .two-col { grid-template-columns: 1fr; }
}

.subsection-title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin: 0 0 0.875rem;
}

.subsection-title.functional { color: var(--color-success); }
.subsection-title.non-functional { color: var(--color-info); }

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.item-list-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.item-bullet {
  flex-shrink: 0;
  width: 20px;
  font-size: 0.875rem;
  margin-top: 1px;
}

.item-bullet.pain { color: #f87171; }
.item-bullet.check { color: var(--color-success); }
.item-bullet.warn { color: var(--color-warning); }
.item-bullet.muted { color: var(--color-text-muted); }

.quotes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-quote {
  margin: 0;
  padding: 0.75rem 1rem;
  background: var(--color-surface-2);
  border-left: 3px solid var(--color-accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-style: italic;
  line-height: 1.6;
}

/* Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.875rem;
}

.metric-card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
  transition: border-color 0.2s;
}

.metric-card:hover {
  border-color: var(--color-accent);
}

.metric-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-accent-muted);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(135deg, var(--color-accent), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.metric-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* User Stories */
.stories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.story-card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 0.2s;
}

.story-card:hover {
  border-color: var(--color-accent);
}

.story-line {
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  font-size: 0.9rem;
}

.story-chip {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.story-chip.as { background: rgba(232,228,220,0.1); color: var(--color-accent-hover); }
.story-chip.want { background: rgba(34,197,94,0.12); color: #4ade80; }
.story-chip.so { background: rgba(245,158,11,0.12); color: #fbbf24; }

.story-text {
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* Bottom sections */
.bottom-sections {
  align-items: start;
}
</style>
