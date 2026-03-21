<template>
  <div class="landing">
    <!-- NAV -->
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo">
          <div class="nav-logo-icon">
            <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="10" fill="url(#lg)"/><path d="M8 10h16M8 16h10M8 22h13" stroke="white" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="4" fill="white" fill-opacity=".9"/><path d="M22.5 22l1 1 2-2" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#6366f1"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs></svg>
          </div>
          <span>Review<span class="accent">2</span>PRD</span>
        </div>
        <!-- <RouterLink class="nav-signin" to="/login">Sign In →</RouterLink> -->
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-glow hero-glow-1"></div>
      <div class="hero-glow hero-glow-2"></div>

      <div class="hero-inner">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          AI-Powered Product Intelligence
        </div>

        <h1 class="hero-headline">
          Turn App Store<br />
          <span class="headline-gradient">Complaints Into</span><br />
          Shipping-Ready PRDs
        </h1>

        <p class="hero-sub">
          Paste a Google Play or App Store URL. Get a structured PRD, an issue board, and developer-ready tickets — powered by local AI, in under 2 minutes.
        </p>

        <!-- Email capture CTA -->
        <form class="hero-cta" @submit.prevent="handleEarlyAccess">
          <input
            id="hero-email"
            v-model="email"
            type="email"
            placeholder="you@company.com"
            class="cta-input"
            required
          />
          <button type="submit" class="cta-btn" :disabled="ctaLoading">
            <span v-if="ctaLoading" class="cta-spinner"></span>
            <span v-else>Get Early Access</span>
          </button>
        </form>
        <p v-if="ctaSuccess" class="cta-success">🎉 You're on the list! We'll be in touch.</p>
        <p v-if="ctaError" class="cta-error">{{ ctaError }}</p>
        <p class="hero-note">No credit card required · Works with your local Ollama</p>

        <!-- Mini preview -->
        <div class="hero-preview">
          <div class="preview-bar">
            <span class="preview-dot red"></span>
            <span class="preview-dot yellow"></span>
            <span class="preview-dot green"></span>
            <span class="preview-title">Review2PRD — Spotify: Music and Podcasts</span>
          </div>
          <div class="preview-body">
            <div class="preview-issue" v-for="i in mockIssues" :key="i.id">
              <span class="prev-sev" :class="i.sev">{{ i.sev }}</span>
              <span class="prev-title">{{ i.title }}</span>
              <span class="prev-status">{{ i.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROBLEM → SOLUTION strip -->
    <section class="ps-strip">
      <div class="ps-col before">
        <div class="ps-label before-label">Before Review2PRD</div>
        <ul>
          <li>📂 Manually read through hundreds of reviews</li>
          <li>🤔 Guess which problems matter most</li>
          <li>📝 Write PRDs from scratch, repeating yourself</li>
          <li>📬 Manually write dev tickets, copy-paste quotes</li>
          <li>⏳ 4-8 hours per analysis cycle</li>
        </ul>
      </div>
      <div class="ps-divider">→</div>
      <div class="ps-col after">
        <div class="ps-label after-label">After Review2PRD</div>
        <ul>
          <li>🤖 Auto-scrape 200+ reviews per star rating</li>
          <li>📊 AI clusters complaints into ranked issues</li>
          <li>📋 PRD generated with problem statement + metrics</li>
          <li>🎫 One-click dev tickets with acceptance criteria</li>
          <li>⚡ Under 2 minutes, every time</li>
        </ul>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features">
      <div class="section-label">What it does</div>
      <h2 class="section-title">Everything from review to roadmap</h2>

      <div class="features-grid">
        <div class="feature-card" v-for="f in features" :key="f.title">
          <div class="feature-icon">{{ f.icon }}</div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how">
      <div class="section-label">How it works</div>
      <h2 class="section-title">Three steps to a shippable roadmap</h2>

      <div class="steps">
        <div class="step" v-for="(s, i) in steps" :key="i">
          <div class="step-num">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="step-connector" v-if="i < steps.length - 1"></div>
          <div class="step-content">
            <h3 class="step-title">{{ s.title }}</h3>
            <p class="step-desc">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ROADMAP / UPCOMING -->
    <section class="roadmap">
      <div class="section-label">Coming Soon</div>
      <h2 class="section-title">The Future of Review2PRD</h2>

      <div class="roadmap-grid">
        <div class="roadmap-card featured">
          <div class="roadmap-badge">Next Milestone</div>
          <h3 class="roadmap-item-title">🔍 Competitor Gap Analysis</h3>
          <p class="roadmap-item-desc">
            Enter your app and a competitor's link. Our AI will automatically identify market gaps, feature weaknesses, and specific areas where you can outshine the competition based on their own users' complaints.
          </p>
        </div>
        
        <div class="roadmap-card">
          <h3 class="roadmap-item-title">📈 Sentiment Timeline</h3>
          <p class="roadmap-item-desc">Track how user sentiment shifts over time and across different app versions. See the direct impact of your feature releases on user satisfaction.</p>
        </div>

        <div class="roadmap-card">
          <h3 class="roadmap-item-title">🔌 1-Click Sync</h3>
          <p class="roadmap-item-desc">Direct integrations with Jira, Linear, and Trello. Push your generated tickets directly into your existing workflow without copy-pasting.</p>
        </div>

        <div class="roadmap-card">
          <h3 class="roadmap-item-title">👥 Team Workspaces</h3>
          <p class="roadmap-item-desc">Collaborate with your team on PRDs and Issue Boards. Shared history and real-time editing for product organizations.</p>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="final-cta">
      <div class="final-glow"></div>
      <div class="section-label">Get started</div>
      <h2 class="final-title">Ready to stop reading<br />and start shipping?</h2>
      <p class="final-sub">Join product managers already using Review2PRD to close the gap between user pain and developer action.</p>
      <form class="final-form" @submit.prevent="handleEarlyAccess">
        <input id="final-email" v-model="email" type="email" placeholder="Work email address" class="cta-input dark" required />
        <button type="submit" class="cta-btn large" :disabled="ctaLoading">
          {{ ctaLoading ? 'Adding you…' : 'Request Access' }}
        </button>
      </form>
      <p v-if="ctaSuccess" class="cta-success">🎉 You're on the list!</p>
      <p v-if="ctaError" class="cta-error">{{ ctaError }}</p>
      <!-- <RouterLink class="final-login-link" to="/login">Already have an account? Sign in →</RouterLink> -->
    </section>

    <!-- FOOTER -->
    <footer class="landing-footer">
      <div class="footer-logo">Review<span class="accent">2</span>PRD</div>
      <p class="footer-copy">Built with Ollama + Kimi K2.5 · Local-first AI for product teams</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const ctaLoading = ref(false)
const ctaSuccess = ref(false)
const ctaError = ref('')

async function handleEarlyAccess() {
  if (!email.value) return
  ctaLoading.value = true
  ctaError.value = ''
  ctaSuccess.value = false
  
  try {
    const API_BASE = import.meta.env.VITE_API_URL || '/api'
    await axios.post(`${API_BASE}/waitlist`, { email: email.value })
    ctaSuccess.value = true
    email.value = ''
  } catch (err: any) {
    ctaError.value = err.response?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    ctaLoading.value = false
  }
}

const mockIssues = [
  { id: 1, sev: 'critical', title: 'Search returns no results on poor connection', status: '🟢 In Sprint' },
  { id: 2, sev: 'high', title: 'Lyrics panel crashes on Android 13', status: '🔵 Open' },
  { id: 3, sev: 'high', title: 'Offline downloads disappear after update', status: '🟢 In Sprint' },
  { id: 4, sev: 'medium', title: 'Podcast resume position resets randomly', status: '🔵 Open' },
]

const features = [
  {
    icon: '🕷',
    title: 'Scrape any app store',
    desc: 'Paste a Google Play or App Store URL. We fetch 200+ reviews filtered by star rating — 1★ through 3★ — automatically.',
  },
  {
    icon: '🧠',
    title: 'AI-generated PRD',
    desc: 'Local Kimi AI clusters complaints into a structured PRD with problem statement, user stories, requirements, and success metrics.',
  },
  {
    icon: '🗂',
    title: 'Issue Board',
    desc: 'Each problem becomes a draggable card with severity, affected user %, and PM notes. Triage in seconds — Open, In Sprint, Won\'t Fix.',
  },
  {
    icon: '🎫',
    title: 'Dev-ready tickets',
    desc: 'One click generates a full developer spec per issue: user POV, what to build, acceptance criteria, edge cases. Copy as Markdown or JSON.',
  },
  {
    icon: '📤',
    title: 'Export anywhere',
    desc: 'Export a Full Report for Notion/Confluence, a Sprint Pack for your current sprint, or raw JSON for Jira/Linear integrations.',
  },
  {
    icon: '🔒',
    title: 'Fully local AI',
    desc: 'Runs on Ollama — your data never leaves your machine. No API keys, no rate limits, no per-token costs.',
  },
]

const steps = [
  {
    title: 'Paste an app store URL',
    desc: 'Drop in a Google Play or App Store link (or a package name like com.spotify.music). Review2PRD handles the rest.',
  },
  {
    title: 'AI generates your PRD + Issue Board',
    desc: 'Within 2 minutes, you have a full PRD and an issue board with 5-7 discrete, ranked problem cards ready to triage.',
  },
  {
    title: 'Triage, ticket, ship',
    desc: 'Mark issues In Sprint, generate developer tickets with acceptance criteria, export your Sprint Pack, and get to work.',
  },
]
</script>

<style scoped>
/* ── Base ─────────────────────────────────────── */
.landing {
  min-height: 100vh;
  background: #0a0a0a;
  color: #f4f4f5;
  font-family: 'Inter', -apple-system, sans-serif;
  overflow-x: hidden;
}

.accent { color: #6366f1; }

/* ── Nav ──────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid #1e1e1e;
  background: rgba(10,10,10,0.85);
  backdrop-filter: blur(16px);
}
.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #f4f4f5;
  text-decoration: none;
}
.nav-logo-icon { width: 30px; height: 30px; }
.nav-logo-icon svg { width: 100%; height: 100%; display: block; }
.nav-signin {
  font-size: 0.875rem;
  font-weight: 500;
  color: #a1a1aa;
  text-decoration: none;
  padding: 0.4rem 0.875rem;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  transition: all 0.2s;
}
.nav-signin:hover { color: #f4f4f5; border-color: #444; background: #111; }

/* ── Hero ─────────────────────────────────────── */
.hero {
  position: relative;
  padding: 6rem 1.5rem 5rem;
  text-align: center;
  overflow: hidden;
}
.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}
.hero-glow-1 {
  width: 500px; height: 500px;
  background: rgba(99,102,241,0.18);
  top: -100px; left: 50%;
  transform: translateX(-50%);
}
.hero-glow-2 {
  width: 300px; height: 300px;
  background: rgba(139,92,246,0.12);
  top: 200px; right: -50px;
}
.hero-inner {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #a78bfa;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.25);
  padding: 0.3rem 0.875rem;
  border-radius: 100px;
}
.badge-dot {
  width: 6px; height: 6px;
  background: #6366f1;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.7); }
}
.hero-headline {
  font-size: clamp(2.25rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0;
}
.headline-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-size: 1.125rem;
  color: #a1a1aa;
  line-height: 1.7;
  max-width: 560px;
  margin: 0;
}
.hero-cta {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  max-width: 480px;
  flex-wrap: wrap;
}
.cta-input {
  flex: 1;
  min-width: 200px;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #f4f4f5;
  font-size: 0.9375rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.cta-input::placeholder { color: #52525b; }
.cta-input:focus { border-color: #6366f1; }
.cta-input.dark { background: #0a0a0a; }
.cta-btn {
  padding: 0.75rem 1.375rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}
.cta-btn:hover:not(:disabled) { background: #818cf8; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
.cta-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.cta-btn.large { padding: 0.875rem 1.75rem; font-size: 1rem; }
.cta-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.cta-success { color: #4ade80; font-size: 0.9rem; margin: 0; }
.cta-error { color: #ef4444; font-size: 0.9rem; margin: 0; }
.hero-note { font-size: 0.8125rem; color: #52525b; margin: 0; }

/* Hero preview mockup */
.hero-preview {
  width: 100%;
  max-width: 620px;
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  text-align: left;
  margin-top: 0.5rem;
}
.preview-bar {
  background: #1a1a1a;
  padding: 0.625rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #222;
}
.preview-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.preview-dot.red { background: #ef4444; }
.preview-dot.yellow { background: #f59e0b; }
.preview-dot.green { background: #22c55e; }
.preview-title {
  flex: 1;
  font-size: 0.75rem;
  color: #52525b;
  text-align: center;
}
.preview-body { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.preview-issue {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: #1a1a1a;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 0.6rem 0.875rem;
  font-size: 0.8125rem;
}
.prev-sev {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  flex-shrink: 0;
}
.prev-sev.critical { background: rgba(239,68,68,0.15); color: #f87171; }
.prev-sev.high { background: rgba(245,158,11,0.15); color: #fbbf24; }
.prev-sev.medium { background: rgba(59,130,246,0.12); color: #60a5fa; }
.prev-title { flex: 1; color: #d4d4d8; }
.prev-status { font-size: 0.75rem; color: #71717a; white-space: nowrap; }

/* ── Problem → Solution ───────────────────────── */
.ps-strip {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
}
@media (max-width: 640px) {
  .ps-strip { grid-template-columns: 1fr; }
  .ps-divider { text-align: center; transform: rotate(90deg); }
}
.ps-col ul { list-style: none; padding: 0; margin: 0.75rem 0 0; display: flex; flex-direction: column; gap: 0.625rem; }
.ps-col li { font-size: 0.9rem; color: #a1a1aa; line-height: 1.5; }
.ps-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.25rem 0.75rem; border-radius: 100px; display: inline-block; }
.before-label { background: rgba(239,68,68,0.1); color: #f87171; }
.after-label { background: rgba(34,197,94,0.1); color: #4ade80; }
.ps-divider { font-size: 2rem; color: #6366f1; font-weight: 300; }

/* ── Features ─────────────────────────────────── */
.features {
  padding: 5rem 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}
.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6366f1;
  margin-bottom: 0.875rem;
}
.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0 0 3rem;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  text-align: left;
}
.feature-card {
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 14px;
  padding: 1.5rem;
  transition: border-color 0.2s, transform 0.2s;
}
.feature-card:hover { border-color: #333; transform: translateY(-2px); }
.feature-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
.feature-title { font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; }
.feature-desc { font-size: 0.875rem; color: #71717a; line-height: 1.6; margin: 0; }

/* ── How it works ─────────────────────────────── */
.how {
  padding: 5rem 1.5rem;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}
.steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 3rem;
  text-align: left;
}
.step {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  position: relative;
}
.step-num {
  font-size: 0.875rem;
  font-weight: 800;
  color: #6366f1;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.25);
  border-radius: 8px;
  padding: 0.35rem 0.6rem;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  margin-top: 2px;
}
.step-connector {
  position: absolute;
  left: 1.6rem;
  top: 2.2rem;
  width: 1px;
  height: calc(100% + 1.5rem);
  background: linear-gradient(to bottom, #6366f1, transparent);
  opacity: 0.25;
}
.step-content { padding-bottom: 2.5rem; }
.step-title { font-size: 1.0625rem; font-weight: 600; margin: 0 0 0.375rem; }
.step-desc { font-size: 0.9rem; color: #71717a; line-height: 1.6; margin: 0; }

/* ── Final CTA ────────────────────────────────── */
.final-cta {
  position: relative;
  padding: 6rem 1.5rem;
  text-align: center;
  overflow: hidden;
}
.final-glow {
  position: absolute;
  width: 600px; height: 300px;
  background: rgba(99,102,241,0.12);
  border-radius: 50%;
  filter: blur(80px);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.final-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0 0 1rem;
}
.final-sub { font-size: 1rem; color: #71717a; max-width: 480px; margin: 0 auto 2rem; line-height: 1.6; }
.final-form {
  display: flex;
  gap: 0.5rem;
  max-width: 440px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}
.final-login-link {
  display: block;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: #52525b;
  text-decoration: none;
  transition: color 0.2s;
}
.final-login-link:hover { color: #a1a1aa; }

/* ── Roadmap ─────────────────────────────────── */
.roadmap {
  padding: 5rem 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}
.roadmap-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  text-align: left;
}
@media (max-width: 768px) {
  .roadmap-grid { grid-template-columns: 1fr; }
}
.roadmap-card {
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
}
.roadmap-card.featured {
  grid-column: span 2;
  border-color: #6366f1;
  background: linear-gradient(145deg, #111 0%, #1a1a1a 100%);
}
@media (max-width: 768px) {
  .roadmap-card.featured { grid-column: span 1; }
}
.roadmap-badge {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #6366f1;
  background: rgba(99,102,241,0.1);
  padding: 0.25rem 0.625rem;
  border-radius: 100px;
  border: 1px solid rgba(99,102,241,0.2);
}
.roadmap-item-title { font-size: 1.125rem; font-weight: 700; margin: 0 0 0.75rem; color: #f4f4f5; }
.roadmap-item-desc { font-size: 0.9375rem; color: #a1a1aa; line-height: 1.6; margin: 0; }

</style>
