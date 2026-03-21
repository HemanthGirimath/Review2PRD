<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content settings-modal">
          <div class="modal-header">
            <h3>⚙️ AI Configuration</h3>
            <button class="modal-close" @click="$emit('close')">✕</button>
          </div>

          <div class="modal-body">
            <p class="settings-hint">
              Configure which AI model powers your analyses. Your keys are used only for your own requests.
            </p>

            <div class="settings-group">
              <label>Provider</label>
              <select v-model="form.ai_provider" class="settings-select">
                <option value="ollama">Ollama (Local / Custom)</option>
                <option value="openai">OpenAI</option>
                <option value="groq">Groq (Fast & Free Tier)</option>
              </select>
            </div>

            <div class="settings-group">
              <label>Model Preset</label>
              <select v-model="form.ai_model" class="settings-select">
                <option v-for="m in modelPresets" :key="m.value" :value="m.value">
                  {{ m.label }}
                </option>
                <option value="custom">-- Custom Model Name --</option>
              </select>
            </div>

            <div v-if="form.ai_model === 'custom' || !isPreset" class="settings-group">
              <label>Custom Model Name</label>
              <input 
                v-model="customModel" 
                type="text" 
                class="settings-input" 
                placeholder="e.g. gpt-4"
                @input="form.ai_model = customModel"
              />
            </div>

            <div v-if="form.ai_provider !== 'ollama'" class="settings-group">
              <label>API Key</label>
              <input 
                v-model="form.api_key" 
                type="password" 
                class="settings-input" 
                placeholder="sk-..."
              />
            </div>

            <div class="settings-group">
              <label>{{ baseUrlLabel }}</label>
              <input 
                v-model="form.base_url" 
                type="text" 
                class="settings-input" 
                :placeholder="baseUrlPlaceholder"
              />
              <p v-if="isLocalOllama" class="warning-text">
                ⚠️ <b>Hosted App Note</b>: Since this app is hosted on Railway, it cannot reach "localhost". 
                You must use a tunnel (like Ngrok) or a public URL if using Ollama remotely.
              </p>
            </div>

            <div v-if="error" class="settings-error">{{ error }}</div>
            <div v-if="testResult" :class="['test-result', testResult.success ? 'success' : 'fail']">
              {{ testResult.success ? '✅' : '❌' }} {{ testResult.message }}
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-test" :disabled="testing || saving" @click="handleTest">
              {{ testing ? 'Testing...' : 'Test Connection' }}
            </button>
            <div class="footer-spacer"></div>
            <button class="btn-secondary" @click="$emit('close')">Cancel</button>
            <button class="btn-primary" :disabled="saving || testing" @click="handleSave">
              {{ saving ? 'Saving...' : 'Save Configuration' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { getSettings, saveSettings, testConnection, type UserSettings } from '../lib/settings'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['close', 'updated'])

const saving = ref(false)
const error = ref('')
const form = reactive<UserSettings>({
  ai_provider: 'ollama',
  ai_model: 'kimi-k2.5:cloud',
  api_key: '',
  base_url: 'http://localhost:11434'
})

const testing = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)
const customModel = ref('')

const presets = {
  openai: [
    { label: 'GPT-4o (Smartest)', value: 'gpt-4o' },
    { label: 'GPT-4o Mini (Fast)', value: 'gpt-4o-mini' },
    { label: 'o3-mini (Reasoning)', value: 'o3-mini' },
  ],
  groq: [
    { label: 'Llama 3.3 70B (Best)', value: 'llama-3.3-70b-versatile' },
    { label: 'Mixtral 8x7B', value: 'mixtral-8x7b-32768' },
    { label: 'DeepSeek R1 (Distill)', value: 'deepseek-r1-distill-llama-70b' },
  ],
  ollama: [
    { label: 'Kimi K2.5 (Default)', value: 'kimi-k2.5:cloud' },
    { label: 'DeepSeek R1 14B', value: 'deepseek-r1:14b' },
    { label: 'Llama 3.2 3B', value: 'llama3.2:3b' },
  ]
}

const modelPresets = computed(() => presets[form.ai_provider] || [])
const isPreset = computed(() => modelPresets.value.some(p => p.value === form.ai_model))

const baseUrlLabel = computed(() => form.ai_provider === 'ollama' ? 'Ollama URL' : 'Base URL (Optional)')
const baseUrlPlaceholder = computed(() => form.ai_provider === 'ollama' ? 'http://localhost:11434' : 'https://api.openai.com/v1')
const isLocalOllama = computed(() => form.ai_provider === 'ollama' && form.base_url.includes('localhost'))

onMounted(async () => {
  const data = await getSettings()
  if (data) Object.assign(form, data)
})

watch(() => props.visible, async (val) => {
  if (val) {
    testResult.value = null
    const data = await getSettings()
    if (data) {
      Object.assign(form, data)
      if (!isPreset.value) customModel.value = data.ai_model
    } else {
      // Default for new users or if fetch fails
      resetToProviderDefaults()
    }
  }
})

watch(() => form.ai_provider, () => {
  testResult.value = null
  resetToProviderDefaults()
})

function resetToProviderDefaults() {
  const p = form.ai_provider
  form.ai_model = presets[p][0].value
  form.base_url = p === 'ollama' ? 'http://localhost:11434' : ''
  customModel.value = ''
}

async function handleTest() {
  testing.value = true
  testResult.value = null
  error.value = ''
  try {
    // Save first to ensure the backend uses the latest keys/url
    await saveSettings({ ...form })
    const res = await testConnection()
    testResult.value = res
  } catch (err: any) {
    testResult.value = { success: false, message: err.message }
  } finally {
    testing.value = false
  }
}

async function handleSave() {
  saving.value = true
  error.value = ''
  try {
    const ok = await saveSettings({ ...form })
    if (ok) {
      emit('updated')
      emit('close')
    } else {
      error.value = 'Failed to save settings.'
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.settings-modal {
  max-width: 440px;
}

.settings-hint {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.settings-group {
  margin-bottom: 1.25rem;
}

.settings-group label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.settings-input, .settings-select {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: 0.875rem;
}

.settings-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.warning-text {
  font-size: 0.75rem;
  color: var(--color-warning);
  margin-top: 0.5rem;
  line-height: 1.4;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
}

.settings-error {
  color: var(--color-danger);
  font-size: 0.8125rem;
  margin-top: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #ffffff;
  color: #1b1b18;
  border: 1px solid transparent;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.25); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  background: transparent;
  color: #e8e6e0;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.btn-secondary:hover { background: rgba(255, 255, 255, 0.06); color: #ffffff; }

.btn-test {
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.825rem;
  background: transparent;
  color: #e8e6e0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.2s;
}
.btn-test:hover:not(:disabled) { background: rgba(255, 255, 255, 0.06); color: #ffffff; }
.btn-test:disabled { opacity: 0.5; cursor: not-allowed; }

.footer-spacer { flex: 1; }

.test-result {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  line-height: 1.4;
}
.test-result.success { background: rgba(34, 197, 94, 0.1); color: var(--color-success); border: 1px solid rgba(34, 197, 94, 0.2); }
.test-result.fail { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); border: 1px solid rgba(239, 68, 68, 0.2); }

/* Fade animation */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  width: 90%;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 { margin: 0; font-size: 1.125rem; }

.modal-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.25rem;
  cursor: pointer;
}
</style>
