<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div v-if="session" class="resume-overlay" id="resume-modal">
        <div class="resume-banner">
          <!-- App icon / indicator -->
          <div class="resume-icon">
            <img v-if="session.appInfo?.icon" :src="session.appInfo.icon" alt="" class="resume-app-icon" />
            <span v-else class="resume-emoji">🗂</span>
          </div>

          <!-- Info -->
          <div class="resume-info">
            <div class="resume-title">Resume last analysis?</div>
            <div class="resume-meta">
              <strong class="resume-app">{{ session.prd.appName }}</strong>
              <span class="resume-sep">·</span>
              <span>{{ session.issues.length }} issues extracted</span>
              <span class="resume-sep">·</span>
              <span>Saved {{ relativeTime }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="resume-actions">
            <button id="resume-btn" class="resume-btn primary" @click="$emit('resume', session)">
              ↩ Resume
            </button>
            <button id="start-fresh-btn" class="resume-btn secondary" @click="$emit('start-fresh')">
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PersistedSession } from '../composables/useSessionCache'

const props = defineProps<{
  session: PersistedSession | null
}>()

defineEmits<{
  resume: [session: PersistedSession]
  'start-fresh': []
}>()

const relativeTime = computed(() => {
  if (!props.session) return ''
  const savedAt = new Date(props.session.savedAt)
  const diffMs = Date.now() - savedAt.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 2) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
})
</script>

<style scoped>
.resume-overlay {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  width: min(680px, 94vw);
}

.resume-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-xl);
  padding: 0.875rem 1.25rem;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.15);
}

/* Transition */
.slide-up-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-up-leave-active { transition: all 0.2s ease-in; }
.slide-up-enter-from { transform: translateX(-50%) translateY(100%); opacity: 0; }
.slide-up-leave-to { transform: translateX(-50%) translateY(20px); opacity: 0; }

.resume-icon {
  flex-shrink: 0;
}
.resume-app-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  object-fit: cover;
}
.resume-emoji {
  font-size: 1.75rem;
  line-height: 1;
}

.resume-info {
  flex: 1;
  min-width: 0;
}
.resume-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.2rem;
}
.resume-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  flex-wrap: wrap;
}
.resume-app {
  color: var(--color-text-secondary);
  font-weight: 500;
}
.resume-sep { opacity: 0.4; }

.resume-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.resume-btn {
  padding: 0.45rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.resume-btn.primary {
  background: var(--color-accent);
  color: white;
  border: 1px solid var(--color-accent);
}
.resume-btn.primary:hover {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}
.resume-btn.secondary {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}
.resume-btn.secondary:hover {
  background: var(--color-surface-2);
  color: var(--color-text-secondary);
}
</style>
