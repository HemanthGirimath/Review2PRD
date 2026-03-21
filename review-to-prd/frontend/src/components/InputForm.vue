<template>
  <div class="input-form">

    <!-- Smart Universal Input -->
    <div class="smart-input-wrapper" :class="{ 'is-focused': focused, 'has-value': !!detectedMode, 'is-expanded': isMultiline }">

      <!-- Detected mode chip -->
      <Transition name="chip">
        <div v-if="detectedMode" class="mode-chip" :class="detectedMode">
          <span class="chip-dot"></span>
          {{ modeLabel }}
        </div>
      </Transition>

      <!-- The input itself — switches between input and textarea -->
      <textarea
        v-if="isMultiline"
        ref="inputEl"
        id="universal-input"
        class="smart-textarea"
        :value="rawInput"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
        @keydown.esc="clearInput"
        placeholder="Paste a Google Play or App Store URL, or drop in user reviews directly…"
        rows="8"
        autocomplete="off"
        spellcheck="false"
      />
      <input
        v-else
        ref="inputEl"
        id="universal-input"
        class="smart-input"
        type="text"
        :value="rawInput"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
        @keydown.enter="handleEnter"
        @keydown.esc="clearInput"
        :placeholder="currentPlaceholder"
        autocomplete="off"
        spellcheck="false"
      />

      <!-- Clear button (shown when has content) -->
      <button v-if="rawInput" class="clear-btn" @click="clearInput" type="button" tabindex="-1" title="Clear">
        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg>
      </button>
    </div>

    <!-- Hint row -->
    <div class="hint-row">
      <div v-if="!rawInput" class="example-chips">
        <span class="hint-label">Try:</span>
        <button class="example-chip" @click="setExample('play')" type="button">🤖 Google Play URL</button>
        <button class="example-chip" @click="setExample('ios')" type="button">🍎 App Store URL</button>
        <button class="example-chip" @click="setExample('manual')" type="button">📋 Paste reviews</button>
      </div>
      <div v-else-if="detectedMode === 'google-play'" class="hint-text android">
        ✓ Google Play detected — we'll fetch the top negative reviews automatically
      </div>
      <div v-else-if="detectedMode === 'app-store'" class="hint-text ios">
        ✓ App Store detected — we'll pull 1–3★ reviews from the listing
      </div>
      <div v-else-if="detectedMode === 'manual'" class="hint-text manual">
        ✓ {{ wordCount }} words detected — paste more feedback or click Generate
      </div>
      <div v-else-if="rawInput" class="hint-text unknown">
        Paste a full Play Store / App Store URL, or type directly for manual analysis
      </div>
    </div>

    <!-- Optional App Name (shown for manual only) -->
    <Transition name="slide">
      <div v-if="detectedMode === 'manual'" class="app-name-row">
        <label for="app-name-input" class="app-name-label">App / Product name <span class="optional">(optional)</span></label>
        <input
          id="app-name-input"
          type="text"
          class="app-name-input"
          :value="appName"
          @input="$emit('update:appName', ($event.target as HTMLInputElement).value)"
          placeholder="e.g. Spotify, My SaaS"
        />
      </div>
    </Transition>

    <!-- Error -->
    <div v-if="error" class="error-banner">
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>
      {{ error }}
    </div>

    <!-- Generate button -->
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
import { ref, computed, watch, nextTick } from 'vue'
import type { InputMode } from '../types'

const props = defineProps<{
  modelValue: InputMode
  inputValue: string
  manualText: string
  appName: string
  error: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: InputMode]
  'update:inputValue': [value: string]
  'update:manualText': [value: string]
  'update:appName': [value: string]
  'generate': []
}>()

const focused = ref(false)
const rawInput = ref(props.inputValue || props.manualText || '')

// Placeholder rotation
const placeholders = [
  'Paste a Google Play or App Store link…',
  'https://play.google.com/store/apps/details?id=com.spotify.music',
  'https://apps.apple.com/us/app/spotify/id324684580',
  'Drop in user reviews, support tickets, or any feedback…',
]
const placeholderIndex = ref(0)
let placeholderTimer: ReturnType<typeof setInterval> | null = null

const currentPlaceholder = computed(() => placeholders[placeholderIndex.value])

// Auto-rotate placeholders only when unfocused + empty
watch(focused, (val) => {
  if (!val && !rawInput.value) {
    placeholderTimer = setInterval(() => {
      placeholderIndex.value = (placeholderIndex.value + 1) % placeholders.length
    }, 3000)
  } else {
    if (placeholderTimer) clearInterval(placeholderTimer)
  }
})

// Detect mode from input value
const detectedMode = computed<InputMode | null>(() => {
  const v = rawInput.value.trim()
  if (!v) return null
  if (/play\.google\.com\/store\/apps/i.test(v) || /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){1,}$/i.test(v)) return 'google-play'
  if (/apps\.apple\.com/i.test(v) || /^[0-9]{6,12}$/.test(v)) return 'app-store'
  if (v.length > 30) return 'manual'
  return null
})

const modeLabel = computed(() => {
  if (detectedMode.value === 'google-play') return '🤖 Google Play'
  if (detectedMode.value === 'app-store') return '🍎 App Store'
  if (detectedMode.value === 'manual') return '📋 Manual'
  return ''
})

const isMultiline = computed(() => detectedMode.value === 'manual')

const wordCount = computed(() => {
  const words = rawInput.value.trim().split(/\s+/).filter(Boolean)
  return words.length
})

// Sync detected mode and values to parent
watch(detectedMode, (mode) => {
  if (!mode) return
  emit('update:modelValue', mode)
  if (mode === 'manual') {
    emit('update:manualText', rawInput.value)
    emit('update:inputValue', '')
  } else {
    emit('update:inputValue', rawInput.value)
    emit('update:manualText', '')
  }
})

watch(rawInput, () => {
  const mode = detectedMode.value
  if (mode === 'manual') {
    emit('update:manualText', rawInput.value)
  } else {
    emit('update:inputValue', rawInput.value)
  }
})

function onInput(e: Event) {
  rawInput.value = (e.target as HTMLInputElement | HTMLTextAreaElement).value
}

function handleEnter() {
  if (canGenerate.value) emit('generate')
}

function clearInput() {
  rawInput.value = ''
  emit('update:inputValue', '')
  emit('update:manualText', '')
  nextTick(() => (document.getElementById('universal-input') as HTMLElement)?.focus())
}

function setExample(type: 'play' | 'ios' | 'manual') {
  if (type === 'play') rawInput.value = 'https://play.google.com/store/apps/details?id=com.spotify.music'
  if (type === 'ios') rawInput.value = 'https://apps.apple.com/us/app/spotify/id324684580'
  if (type === 'manual') rawInput.value = "The search is completely broken on mobile data\nEvery time I update the app my downloads disappear\nApp crashes every time I open the lyrics panel\nPodcast resume position resets after reboot"
}

const canGenerate = computed(() => {
  const mode = detectedMode.value
  if (!mode) return false
  if (mode === 'manual') return rawInput.value.trim().length > 20
  return rawInput.value.trim().length > 0
})
</script>

<style scoped>
.input-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem 2rem;
}

/* ── Smart input wrapper ─────────────────────── */
.smart-input-wrapper {
  position: relative;
  border-radius: 10px;
  border: 1px solid #38382e;
  background: #2a2a26;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.smart-input-wrapper.is-focused {
  border-color: rgba(232,228,220,0.35);
  box-shadow: 0 0 0 3px rgba(232,228,220,0.05);
}

/* Detected mode chip */
.mode-chip {
  position: absolute;
  top: -0.875rem;
  left: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.625rem;
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.08);
  background: #232320;
  white-space: nowrap;
}
.chip-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.mode-chip.google-play { color: #4ade80; }
.mode-chip.google-play .chip-dot { background: #4ade80; }
.mode-chip.app-store { color: #93c5fd; }
.mode-chip.app-store .chip-dot { background: #93c5fd; }
.mode-chip.manual { color: #e8e4dc; }
.mode-chip.manual .chip-dot { background: #e8e4dc; }

/* The single smart input */
.smart-input {
  width: 100%;
  padding: 1rem 2.5rem 1rem 1rem;
  background: transparent;
  border: none;
  color: #e8e6e0;
  font-size: 0.9375rem;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
}
.smart-input::placeholder { color: #4a4a44; }

.smart-textarea {
  width: 100%;
  padding: 1rem 2.5rem 1rem 1rem;
  background: transparent;
  border: none;
  color: #e8e6e0;
  font-size: 0.9375rem;
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 180px;
  line-height: 1.6;
  box-sizing: border-box;
}
.smart-textarea::placeholder { color: #4a4a44; }

/* Clear button */
.clear-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.625rem;
  width: 22px; height: 22px;
  background: none;
  border: none;
  color: #4a4a44;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
  border-radius: 4px;
}
.clear-btn:hover { color: #8a8a80; }
.clear-btn svg { width: 13px; height: 13px; }

/* ── Hint row ──────────────────────────────── */
.hint-row { min-height: 1.5rem; }
.example-chips {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.hint-label { font-size: 0.75rem; color: #4a4a44; }
.example-chip {
  background: none;
  border: 1px solid #38382e;
  border-radius: 100px;
  color: #6a6a64;
  font-size: 0.75rem;
  font-family: inherit;
  padding: 0.25rem 0.625rem;
  cursor: pointer;
  transition: all 0.15s;
}
.example-chip:hover { border-color: rgba(232,228,220,0.2); color: #8a8a80; }

.hint-text {
  font-size: 0.8125rem;
  line-height: 1.5;
}
.hint-text.android { color: #4ade80; }
.hint-text.ios { color: #93c5fd; }
.hint-text.manual { color: #8a8a80; }
.hint-text.unknown { color: #4a4a44; }

/* ── App name row (manual only) ─────────────── */
.app-name-row {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.app-name-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6a6a64;
}
.optional { font-weight: 400; opacity: 0.6; }
.app-name-input {
  background: #2a2a26;
  border: 1px solid #38382e;
  border-radius: 7px;
  padding: 0.6rem 0.875rem;
  color: #e8e6e0;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.app-name-input::placeholder { color: #5a5a52; }
.app-name-input:focus { border-color: rgba(232,228,220,0.35); }

/* ── Error ───────────────────────────────────── */
.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.875rem;
  line-height: 1.5;
}
.error-banner svg { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; color: #f87171; }

/* ── Generate button ─────────────────────────── */
.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #ffffff;
  color: #1b1b18;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}
.generate-btn:hover:not(:disabled) {
  background: #e8e4dc;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}
.generate-btn:active:not(:disabled) { transform: translateY(0); }
.generate-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.generate-btn svg { width: 16px; height: 16px; }

/* ── Transitions ─────────────────────────────── */
.chip-enter-active, .chip-leave-active { transition: all 0.2s; }
.chip-enter-from, .chip-leave-to { opacity: 0; transform: translateY(4px); }

.slide-enter-active, .slide-leave-active { transition: all 0.25s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; }
.slide-enter-to, .slide-leave-from { max-height: 120px; }
</style>
