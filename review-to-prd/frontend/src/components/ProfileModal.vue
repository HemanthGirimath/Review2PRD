<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content profile-modal">
          <div class="modal-header">
            <h3>👤 User Profile</h3>
            <button class="modal-close" @click="$emit('close')">✕</button>
          </div>

          <div class="modal-body" v-if="user">
            <div class="profile-section">
              <div class="profile-avatar">
                {{ user.email?.[0].toUpperCase() }}
              </div>
              <div class="profile-info">
                <h4>{{ user.email }}</h4>
                <p class="account-type">Free Tier Plan</p>
              </div>
            </div>

            <div class="divider"></div>

            <div class="ai-status-card">
              <div class="status-header">
                <span class="status-label">AI ENGINE STATUS</span>
                <span :class="['status-badge', status?.success ? 'online' : 'checking']">
                  {{ status?.success ? 'ONLINE' : (checking ? 'CHECKING...' : 'OFFLINE') }}
                </span>
              </div>
              
              <div class="status-details" v-if="settings">
                <div class="detail-row">
                  <span class="detail-key">Provider</span>
                  <span class="detail-val">{{ settings.ai_provider.toUpperCase() }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-key">Model</span>
                  <span class="detail-val">{{ settings.ai_model }}</span>
                </div>
              </div>

              <div v-if="status" :class="['status-msg', status.success ? 'success' : 'error']">
                {{ status.message }}
              </div>

              <button class="btn-check" :disabled="checking" @click="checkStatus">
                {{ checking ? 'Checking Connection...' : 'Re-check Connection' }}
              </button>

              <button class="btn-configure-shortcut" @click="$emit('open-settings')">
                ⚙️ Configure AI Settings
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-primary" @click="$emit('close')">Done</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getSettings, testConnection, type UserSettings } from '../lib/settings'

const props = defineProps<{ visible: boolean, user: any }>()
const emit = defineEmits(['close', 'open-settings'])

const settings = ref<UserSettings | null>(null)
const status = ref<{ success: boolean, message: string } | null>(null)
const checking = ref(false)

async function loadData() {
  settings.value = await getSettings()
  if (settings.value) {
    await checkStatus()
  }
}

async function checkStatus() {
  checking.value = true
  status.value = null
  try {
    status.value = await testConnection()
  } catch (err: any) {
    status.value = { success: false, message: 'Failed to connect to backend' }
  } finally {
    checking.value = false
  }
}

watch(() => props.visible, (val) => {
  if (val) loadData()
})
</script>

<style scoped>
.profile-modal {
  max-width: 400px;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 56px;
  height: 56px;
  background: var(--color-accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.profile-info h4 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--color-text-primary);
}

.account-type {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: var(--color-accent);
  font-weight: 600;
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: 1.5rem 0;
}

.ai-status-card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.status-badge {
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-badge.online { background: rgba(34, 197, 94, 0.1); color: var(--color-success); }
.status-badge.checking { background: rgba(99, 102, 241, 0.1); color: var(--color-accent); }

.status-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
}

.detail-key { color: var(--color-text-secondary); }
.detail-val { color: var(--color-text-primary); font-weight: 500; }

.status-msg {
  font-size: 0.75rem;
  padding: 0.625rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  line-height: 1.4;
}
.status-msg.success { background: rgba(34, 197, 94, 0.05); color: var(--color-success); }
.status-msg.error { background: rgba(239, 68, 68, 0.05); color: var(--color-danger); }

.btn-check {
  width: 100%;
  padding: 0.625rem;
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-check:hover:not(:disabled) { background: var(--color-surface); border-color: var(--color-accent); }
.btn-check:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-configure-shortcut {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.625rem;
  background: transparent;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  color: var(--color-accent);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-configure-shortcut:hover {
  background: var(--color-accent-muted);
  border-color: var(--color-accent);
}

.modal-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  padding: 0.625rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* Base Modal Styles */
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
  margin-bottom: 1.5rem;
}

.modal-header h3 { margin: 0; font-size: 1.125rem; }

.modal-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.25rem;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
