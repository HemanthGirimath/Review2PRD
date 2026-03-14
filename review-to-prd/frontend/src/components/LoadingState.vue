<template>
  <div class="loading-state">
    <div class="spinner-wrapper">
      <div class="spinner-outer"></div>
      <div class="spinner-inner"></div>
      <div class="pulse-ring"></div>
    </div>
    <div class="loading-content">
      <h3 class="loading-title">{{ title }}</h3>
      <p class="loading-message">{{ message }}</p>
      <div class="progress-steps">
        <div
          v-for="(s, i) in steps"
          :key="i"
          class="progress-step"
          :class="{ 'is-done': i < currentStepIndex, 'is-active': i === currentStepIndex }"
        >
          <div class="step-dot">
            <svg v-if="i < currentStepIndex" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="step-label">{{ s }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  message: string
  step: 'scraping' | 'analyzing' | 'extracting'
}>()

const steps = ['Fetching reviews', 'Filtering complaints', 'AI analysis', 'Extracting issues']

const title = computed(() => {
  if (props.step === 'scraping') return 'Scraping Store Reviews'
  if (props.step === 'analyzing') return 'Generating PRD with AI'
  return 'Building Issue Board'
})

const currentStepIndex = computed(() => {
  if (props.step === 'scraping') return 1
  if (props.step === 'analyzing') return 2
  return 3 // extracting
})
</script>

<style scoped>
.loading-state {
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.spinner-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner-outer {
  position: absolute;
  inset: 0;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-inner {
  position: absolute;
  inset: 12px;
  border: 2px solid transparent;
  border-bottom-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite reverse;
}

.pulse-ring {
  position: absolute;
  inset: -8px;
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  opacity: 0;
  animation: pulse 2s ease-out infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(1.4); opacity: 0; }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  text-align: center;
}

.loading-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.loading-message {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
  max-width: 240px;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  opacity: 0.35;
  transition: opacity 0.3s;
}
.progress-step.is-active { opacity: 1; }
.progress-step.is-done { opacity: 0.7; }

.step-dot {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1.5px solid var(--color-border);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.is-active .step-dot {
  border-color: var(--color-accent);
  background: var(--color-accent-muted);
  box-shadow: 0 0 0 3px var(--color-accent-muted);
}
.is-done .step-dot {
  background: rgba(34,197,94,0.15);
  border-color: #22c55e;
  color: #4ade80;
}
.step-dot svg { width: 10px; height: 10px; }

.step-label {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}
.is-active .step-label {
  color: var(--color-text-primary);
  font-weight: 500;
}
.is-done .step-label {
  color: #4ade80;
  text-decoration: line-through;
  text-decoration-color: rgba(74,222,128,0.4);
}
</style>
