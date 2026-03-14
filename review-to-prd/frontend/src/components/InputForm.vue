<template>
  <div class="input-form">
    <!-- Tab selector -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ 'is-active': modelValue === tab.id }"
        @click="$emit('update:modelValue', tab.id)"
        :id="`tab-${tab.id}`"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Google Play Input -->
    <div v-if="modelValue === 'google-play'" class="input-panel">
      <div class="platform-badge android">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341A5.5 5.5 0 0 0 12 9.5a5.5 5.5 0 0 0-5.523 5.841L2.5 20h19l-3.977-4.659zM12 1L3.5 6l1.5 2.598L12 4.196l7 4.402L20.5 6 12 1zm0 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>
        Google Play
      </div>
      <label class="field-label">App URL or Package Name</label>
      <div class="input-wrapper">
        <input
          id="google-play-input"
          type="text"
          class="text-input"
          :value="inputValue"
          @input="$emit('update:inputValue', ($event.target as HTMLInputElement).value)"
          placeholder="https://play.google.com/store/apps/details?id=com.spotify.music"
          @keydown.enter="$emit('generate')"
          autocomplete="off"
        />
      </div>
      <p class="hint">Also accepts package names like <code>com.spotify.music</code></p>
    </div>

    <!-- App Store Input -->
    <div v-if="modelValue === 'app-store'" class="input-panel">
      <div class="platform-badge ios">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        App Store
      </div>
      <label class="field-label">App Store URL or Numeric ID</label>
      <div class="input-wrapper">
        <input
          id="app-store-input"
          type="text"
          class="text-input"
          :value="inputValue"
          @input="$emit('update:inputValue', ($event.target as HTMLInputElement).value)"
          placeholder="https://apps.apple.com/us/app/spotify/id324684580"
          @keydown.enter="$emit('generate')"
          autocomplete="off"
        />
      </div>
      <p class="hint">Country is auto-detected from URL · Also accepts numeric ID like <code>324684580</code></p>
    </div>

    <!-- Manual Input -->
    <div v-if="modelValue === 'manual'" class="input-panel">
      <div class="platform-badge manual">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Manual Input
      </div>

      <div class="manual-grid">
        <div class="field-group">
          <label class="field-label">App / Product Name (optional)</label>
          <input
            id="app-name-input"
            type="text"
            class="text-input"
            :value="appName"
            @input="$emit('update:appName', ($event.target as HTMLInputElement).value)"
            placeholder="My SaaS App"
          />
        </div>

        <div class="field-group">
          <label class="field-label">
            User Feedback
            <span class="char-count">{{ manualText.length }} chars</span>
          </label>
          <textarea
            id="manual-text-input"
            class="textarea-input"
            :value="manualText"
            @input="$emit('update:manualText', ($event.target as HTMLTextAreaElement).value)"
            placeholder="Paste reviews, support tickets, tweets, emails, or any user feedback here...

Example:
'The search feature is completely broken - I can't find anything'
'Why is there no dark mode? My eyes hurt'
'App crashes every time I try to export'"
            rows="10"
          ></textarea>
        </div>
      </div>
      <p class="hint">Paste from Trustpilot, Twitter/X, Reddit, support tickets, emails, or any other source</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="error-banner">
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>
      {{ error }}
    </div>

    <!-- CTA -->
    <button
      id="generate-btn"
      class="generate-btn"
      @click="$emit('generate')"
      :disabled="!canGenerate"
    >
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z"/></svg>
      Generate PRD
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InputMode } from '../types'

const props = defineProps<{
  modelValue: InputMode
  inputValue: string
  manualText: string
  appName: string
  error: string | null
}>()

defineEmits<{
  'update:modelValue': [value: InputMode]
  'update:inputValue': [value: string]
  'update:manualText': [value: string]
  'update:appName': [value: string]
  'generate': []
}>()

const tabs = [
  { id: 'google-play' as InputMode, icon: '🤖', label: 'Google Play' },
  { id: 'app-store' as InputMode, icon: '🍎', label: 'App Store' },
  { id: 'manual' as InputMode, icon: '📋', label: 'Manual Paste' },
]

const canGenerate = computed(() => {
  if (props.modelValue === 'manual') return props.manualText.trim().length > 20
  return props.inputValue.trim().length > 0
})
</script>

<style scoped>
.input-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tabs {
  display: flex;
  gap: 0.375rem;
  background: var(--color-surface-2);
  padding: 0.375rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.tab-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-3);
}

.tab-btn.is-active {
  background: var(--color-accent);
  color: white;
  box-shadow: 0 2px 12px var(--color-accent-glow);
}

.tab-icon {
  font-size: 1rem;
}

.input-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 600;
  width: fit-content;
}

.platform-badge svg {
  width: 14px;
  height: 14px;
}

.platform-badge.android {
  background: rgba(61, 220, 132, 0.12);
  color: #3ddc84;
  border: 1px solid rgba(61, 220, 132, 0.25);
}

.platform-badge.ios {
  background: rgba(255, 255, 255, 0.07);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.platform-badge.manual {
  background: var(--color-accent-muted);
  color: var(--color-accent-hover);
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.char-count {
  font-weight: 400;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.input-wrapper {
  position: relative;
}

.text-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.9375rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.text-input::placeholder {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.text-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-muted);
}

.textarea-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  min-height: 220px;
}

.textarea-input::placeholder {
  color: var(--color-text-muted);
}

.textarea-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-muted);
}

.manual-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.hint {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin: 0;
}

.hint code {
  background: var(--color-surface-3);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--color-accent-hover);
  font-family: 'Fira Code', 'Fira Mono', monospace;
}

.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: var(--radius-md);
  color: #fca5a5;
  font-size: 0.875rem;
  line-height: 1.5;
}

.error-banner svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--color-danger);
}

.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.generate-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
}

.generate-btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px var(--color-accent-glow);
}

.generate-btn:active:not(:disabled) {
  transform: translateY(0);
}

.generate-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.generate-btn svg {
  width: 18px;
  height: 18px;
}
</style>
