<template>
  <div class="auth-page">
    <div class="auth-glow"></div>

    <!-- Logo link back to landing -->
    <RouterLink to="/" class="auth-logo">
      <div class="auth-logo-icon">
        <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="10" fill="url(#alg)"/><path d="M8 10h16M8 16h10M8 22h13" stroke="white" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="4" fill="white" fill-opacity=".9"/><path d="M22.5 22l1 1 2-2" stroke="#e8e4dc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="alg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#e8e4dc"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs></svg>
      </div>
      <span>Review<span class="accent">2</span>PRD</span>
    </RouterLink>

    <!-- Email Verification screen -->
    <div v-if="verifyState" class="auth-card verify-card">
      <div class="verify-icon">📬</div>
      <h2 class="auth-title">Check your inbox</h2>
      <p class="verify-msg">We sent a verification link to <strong>{{ email }}</strong>. Click it to activate your account, then come back to sign in.</p>
      <button class="auth-submit-btn" style="margin-top:1rem" @click="verifyState = false; mode = 'signin'">
        Go to Sign In
      </button>
    </div>

    <!-- Normal auth card -->
    <div v-else class="auth-card">
      <!-- Tab toggle -->
      <div class="auth-tabs">
        <button
          id="tab-signin"
          class="auth-tab"
          :class="{ active: mode === 'signin' }"
          @click="mode = 'signin'"
        >Sign In</button>
        <button
          id="tab-signup"
          class="auth-tab"
          :class="{ active: mode === 'signup' }"
          @click="mode = 'signup'"
        >Create Account</button>
      </div>

      <h2 class="auth-title">
        {{ mode === 'signin' ? 'Welcome back' : 'Get started free' }}
      </h2>

      <!-- Error banner -->
      <div v-if="authError" class="auth-error">
        {{ authError }}
      </div>

      <!-- No Supabase config warning -->
      <div v-if="!supabaseConfigured" class="auth-warn">
        ⚠️ Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file.
      </div>

      <!-- Google OAuth (Disabled for now) -->
      <!--
      <button
        id="google-signin-btn"
        class="google-btn"
        @click="loginWithGoogle"
        :disabled="loading || !supabaseConfigured"
      >
        <svg class="google-icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      <div class="auth-divider"><span>or</span></div>
      -->

      <!-- Email form -->
      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="field-group">
          <label for="auth-email" class="field-label">Email</label>
          <input
            id="auth-email"
            v-model="email"
            type="email"
            class="field-input"
            placeholder="you@company.com"
            required
            autocomplete="email"
          />
        </div>
        <div class="field-group">
          <label for="auth-password" class="field-label">
            Password
            <RouterLink v-if="mode === 'signin'" to="/forgot" class="forgot-link">Forgot?</RouterLink>
          </label>
          <div class="password-wrapper">
            <input
              id="auth-password"
              v-model="password"
              :type="showPw ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              minlength="8"
            />
            <button type="button" class="pw-toggle" @click="showPw = !showPw" tabindex="-1">
              {{ showPw ? '🙈' : '👁' }}
            </button>
          </div>
        </div>

        <button
          id="auth-submit-btn"
          type="submit"
          class="auth-submit-btn"
          :disabled="loading || !supabaseConfigured"
        >
          <span v-if="loading" class="auth-spinner"></span>
          <span v-else>{{ mode === 'signin' ? 'Sign In' : 'Create Account' }}</span>
        </button>
      </form>

      <p class="auth-switch">
        {{ mode === 'signin' ? "Don't have an account?" : 'Already have an account?' }}
        <button type="button" class="auth-switch-btn" @click="mode = mode === 'signin' ? 'signup' : 'signin'">
          {{ mode === 'signin' ? 'Sign up →' : 'Sign in →' }}
        </button>
      </p>
    </div><!-- end auth-card -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { supabase } from '../lib/supabase'

const mode = ref<'signin' | 'signup'>('signin')
const email = ref('')
const password = ref('')
const showPw = ref(false)
const verifyState = ref(false)  // true when awaiting email verification

const { loading, authError, login, signup } = useAuth()

const supabaseConfigured = computed(() => !!supabase)

async function handleSubmit() {
  if (mode.value === 'signin') {
    await login(email.value, password.value)
  } else {
    await signup(email.value, password.value)
    // Supabase sends a verification email — show confirm screen, don't redirect
    if (!authError.value) {
      verifyState.value = true
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #1b1b18;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}
.auth-glow {
  position: absolute;
  width: 500px; height: 500px;
  background: rgba(232,228,220,0.04);
  filter: blur(100px);
  border-radius: 50%;
  top: 50%; left: 50%;
  transform: translate(-50%, -60%);
  pointer-events: none;
}
.auth-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #e8e6e0;
  text-decoration: none;
  margin-bottom: 2rem;
}
.auth-logo-icon { width: 28px; height: 28px; }
.auth-logo-icon svg { width: 100%; height: 100%; }
.accent { color: #e8e4dc; }

.auth-card {
  width: 100%;
  max-width: 400px;
  background: #232320;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
}

.auth-tabs {
  display: flex;
  background: #2a2a26;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
  margin-bottom: 1.5rem;
}
.auth-tab {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 7px;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  background: transparent;
  color: #6a6a64;
  transition: all 0.2s;
}
.auth-tab.active {
  background: #222;
  color: #e8e6e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.auth-title {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0 0 1.25rem;
  color: #e8e6e0;
}

.auth-error {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  color: #f87171;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
.auth-warn {
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
  color: #fbbf24;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}
.auth-warn code {
  background: rgba(245,158,11,0.15);
  padding: 0 4px;
  border-radius: 3px;
  font-family: monospace;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.75rem;
  background: #2a2a26;
  border: 1px solid #38382e;
  border-radius: 10px;
  color: #e4e4e7;
  font-size: 0.9375rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}
.google-btn:hover:not(:disabled) { background: #222; border-color: #444; }
.google-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.google-icon { width: 18px; height: 18px; flex-shrink: 0; }

.auth-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem 0;
  color: #4a4a44;
  font-size: 0.8125rem;
}
.auth-divider::before, .auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #222;
}

.auth-form { display: flex; flex-direction: column; gap: 1rem; }
.field-group { display: flex; flex-direction: column; gap: 0.375rem; }
.field-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #8a8a80;
}
.forgot-link { color: #e8e4dc; text-decoration: none; font-size: 0.8125rem; }
.forgot-link:hover { color: #f5f0e8; }
.field-input {
  background: #2a2a26;
  border: 1px solid #38382e;
  border-radius: 8px;
  padding: 0.7rem 0.875rem;
  color: #e8e6e0;
  font-size: 0.9375rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
.field-input::placeholder { color: #5a5a52; }
.field-input:focus { border-color: rgba(232,228,220,0.35); }
.password-wrapper { position: relative; }
.password-wrapper .field-input { padding-right: 2.5rem; }
.pw-toggle {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1;
  padding: 0.25rem;
}

.auth-submit-btn {
  width: 100%;
  padding: 0.8rem;
  background: #e8e4dc;
  color: #1b1b18;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.25rem;
}
.auth-submit-btn:hover:not(:disabled) { background: #f5f0e8; }
.auth-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.auth-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(27,27,24,0.2);
  border-top-color: #1b1b18;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.auth-switch {
  text-align: center;
  font-size: 0.875rem;
  color: #4a4a44;
  margin: 1.25rem 0 0;
}
.auth-switch-btn {
  background: none;
  border: none;
  color: #e8e4dc;
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
}
.auth-switch-btn:hover { color: #f5f0e8; text-decoration: underline; }

/* Verify email screen */
.verify-card { text-align: center; }
.verify-icon { font-size: 3rem; margin-bottom: 0.75rem; }
.verify-msg {
  font-size: 0.9375rem;
  color: #8a8a80;
  line-height: 1.6;
  margin: 0 0 0.5rem;
}
.verify-msg strong { color: #e8e6e0; }
</style>
