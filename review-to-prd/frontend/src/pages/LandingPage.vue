<template>
  <div class="landing">

    <!-- NAV -->
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="7" fill="#e8e4dc"/><path d="M8 10h16M8 16h10M8 22h13" stroke="#0d1a14" stroke-width="2.5" stroke-linecap="round"/></svg>
          <span>Review<span class="accent">2</span>PRD</span>
        </div>
        <!-- Sign-in hidden during early access -->
      </div>
    </nav>

    <!-- HERO — split layout: text left, mockup right -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Early Access
        </div>

        <h1 class="hero-headline">
          Turn&nbsp;App&nbsp;Store<br />reviews into your<br />next&nbsp;sprint.
        </h1>

        <p class="hero-sub">
          Paste a Google Play or App Store link. Get a structured PRD, a prioritized issue board, and developer-ready tickets in under 2&nbsp;minutes.
        </p>

        <div class="hero-cta">
          <form class="early-access-form" @submit.prevent="handleWaitlist">
            <input 
              v-model="waitlistEmail" 
              type="email" 
              class="ea-input" 
              placeholder="Enter your email" 
              required
              :disabled="waitlistStatus === 'loading' || waitlistStatus === 'success'"
            />
            <button 
              type="submit" 
              class="cta-btn large"
              :disabled="waitlistStatus === 'loading' || waitlistStatus === 'success'"
            >
              <span v-if="waitlistStatus === 'idle' || waitlistStatus === 'error'">Join Waitlist</span>
              <span v-else-if="waitlistStatus === 'loading'">Joining...</span>
              <span v-else>Added! ✓</span>
            </button>
          </form>
          <div v-if="waitlistMessage" class="ea-message" :class="waitlistStatus">{{ waitlistMessage }}</div>
          
          <div style="margin-top: 1rem;">
            <router-link to="/demo" class="cta-link-secondary">
              Or see interactive demo →
            </router-link>
          </div>
        </div>
        <div class="hero-note-highlight" style="margin-top: 1.5rem; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.875rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 99px; font-size: 0.875rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          <span style="color: #a1a1aa">No credit card required · <strong style="color: #10b981; font-weight: 600;">Completely free to try</strong></span>
        </div>
      </div>

      <div class="hero-right">
        <div class="hero-card">
          <div class="card-topbar">
             <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
             <span class="card-title">app.review2prd.com</span>
          </div>
          <div class="card-body">
            <div class="issue-row" v-for="i in mockIssues" :key="i.id">
              <span class="sev-tag" :class="i.sev">{{ i.sev }}</span>
              <span class="issue-text">{{ i.title }}</span>
              <span class="issue-status">{{ i.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- DEMO VIDEO -->
    <section class="video-section">
      <div class="video-inner">
        <div class="section-eyebrow" style="text-align:center">See it in action</div>
        <h2 class="video-heading">From URL to sprint-ready PRD<br />in under 2 minutes.</h2>
        <p class="video-sub">Watch how Review2PRD turns a Google Play listing into a structured PRD, an issue board, and developer tickets — automatically.</p>

        <div class="video-frame-wrapper">
          <!-- Replace src with your Loom/YouTube embed URL when ready -->
          <!-- <iframe src="https://www.loom.com/embed/YOUR_VIDEO_ID" frameborder="0" allowfullscreen class="video-iframe"></iframe> -->

          <video ref="demoVideo" class="video-iframe" autoplay loop muted playsinline @click="toggleFullscreen">
            <source src="../assets/Review2PRD.mp4" type="video/mp4" />
          </video>
          <button class="video-fs-btn" @click="toggleFullscreen" title="Fullscreen">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- PROBLEM → SOLUTION -->
    <section class="section ps-section">
      <h2 class="center-heading">Stop copy-pasting reviews into Notion.</h2>
      <p class="center-sub">Every answer your users need is already written in their one-star reviews. Review2PRD reads them at scale.</p>
      <div class="ps-grid">
        <div class="ps-col">
          <div class="ps-badge before-badge">Without Review2PRD</div>
          <ul class="ps-list">
            <li>📂 Manually read hundreds of reviews</li>
            <li>🤔 Guess which problems matter most</li>
            <li>📝 Write PRDs from scratch every time</li>
            <li>📬 Copy-paste quotes into dev tickets</li>
            <li>⏳ 4–8 hours per cycle</li>
          </ul>
        </div>
        <div class="ps-arrow">→</div>
        <div class="ps-col">
          <div class="ps-badge after-badge">With Review2PRD</div>
          <ul class="ps-list">
            <li>🤖 Auto-scrape 200+ reviews instantly</li>
            <li>📊 AI clusters complaints into ranked issues</li>
            <li>📋 Structured PRD with problem statement</li>
            <li>🎫 Dev tickets with acceptance criteria</li>
            <li>⚡ Under 2 minutes, every time</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FEATURES — alternating rows -->
    <section class="section features-section">
      <div class="section-eyebrow">What it does</div>
      <h2 class="section-heading">From 300 one-star reviews<br />to a shipping-ready roadmap.</h2>

      <div class="feature-list">
        <div v-for="(f, i) in features" :key="f.title" class="feature-row" :class="{ 'feat-reverse': i % 2 !== 0 }">
          <div class="feat-text">
            <div class="feat-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="feat-title">{{ f.title }}</h3>
            <p class="feat-desc">{{ f.desc }}</p>
          </div>
          <div class="feat-visual">
            <div class="ui-card">
              <div class="ui-card-bar">
                <span class="ui-bar-dot"></span><span class="ui-bar-dot"></span><span class="ui-bar-dot"></span>
                <span class="ui-card-label">{{ f.mockLabel }}</span>
              </div>
              <div class="ui-card-body" v-html="f.mockContent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section how-section">
      <div class="section-eyebrow">How it works</div>
      <h2 class="section-heading">Three steps.<br />Under two minutes.</h2>
      <div class="steps-grid">
        <div class="step-item" v-for="(s, i) in steps" :key="i">
          <div class="feat-num">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="step-title">{{ s.title }}</h3>
          <p class="step-desc">{{ s.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ROADMAP -->
    <section class="section roadmap-section">
      <div class="section-eyebrow">What's coming</div>
      <h2 class="section-heading">We're just getting started.</h2>
      <div class="roadmap-rows">
        <div class="roadmap-item featured">
          <div class="roadmap-tag">Next up</div>
          <h3 class="roadmap-title">🔍 Competitor Gap Analysis</h3>
          <p class="roadmap-desc">Enter your app and a competitor's link. The AI identifies market gaps and outlines exactly where you can win based on their users' complaints.</p>
        </div>
        <div class="roadmap-item" v-for="r in roadmapItems" :key="r.title">
          <h3 class="roadmap-title">{{ r.title }}</h3>
          <p class="roadmap-desc">{{ r.desc }}</p>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="section final-section">
      <h2 class="final-heading">Ready to stop guessing<br />and start shipping?</h2>
      <p class="final-sub">Join product managers who use Review2PRD to close the gap between user pain and developer action.</p>
      <div class="final-form">
        <form class="early-access-form" @submit.prevent="handleWaitlist" style="justify-content: center; max-width: 400px; margin: 0 auto;">
          <input 
            v-model="waitlistEmail" 
            type="email" 
            class="ea-input" 
            placeholder="Enter your work email" 
            required
            :disabled="waitlistStatus === 'loading' || waitlistStatus === 'success'"
          />
          <button 
            type="submit" 
            class="cta-btn large"
            :disabled="waitlistStatus === 'loading' || waitlistStatus === 'success'"
          >
            <span v-if="waitlistStatus === 'idle' || waitlistStatus === 'error'">Join Waitlist</span>
            <span v-else-if="waitlistStatus === 'loading'">Joining...</span>
            <span v-else>Added! ✓</span>
          </button>
        </form>
        <div v-if="waitlistMessage" class="ea-message" :class="waitlistStatus" style="text-align: center;">{{ waitlistMessage }}</div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="landing-footer">
      <span class="footer-logo">Review<span class="accent">2</span>PRD</span>
      <p class="footer-copy">Built for people who believe shipping the right thing matters more than shipping fast.</p>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import posthog from 'posthog-js'

const waitlistEmail = ref('')
const waitlistStatus = ref<'idle'|'loading'|'success'|'error'>('idle')
const waitlistMessage = ref('')

async function handleWaitlist() {
  if (!waitlistEmail.value) return
  waitlistStatus.value = 'loading'
  
  try {
    posthog.capture('waitlist_signup', { email: waitlistEmail.value })
    waitlistStatus.value = 'success'
    waitlistMessage.value = 'You are on the list! We will be in touch.'
    waitlistEmail.value = ''
  } catch (err) {
    waitlistStatus.value = 'error'
    waitlistMessage.value = 'Something went wrong. Please try again.'
  }
}

const demoVideo = ref<HTMLVideoElement | null>(null)

function toggleFullscreen() {
  if (!demoVideo.value) return
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    demoVideo.value.requestFullscreen().catch(err => {
      console.warn('Fullscreen error:', err)
    })
  }
}

const mockIssues = [
  { id: 1, sev: 'critical', title: 'Search broken on mobile data', status: '🟢 In Sprint' },
  { id: 2, sev: 'high', title: 'Lyrics panel crashes on Android 13', status: '🔵 Open' },
  { id: 3, sev: 'high', title: 'Downloads disappear on update', status: '🟢 In Sprint' },
  { id: 4, sev: 'medium', title: 'Podcast position resets randomly', status: '🔵 Open' },
]

const features = [
  {
    title: 'Scrape any app, automatically.',
    desc: 'Paste a Google Play or App Store URL. Review2PRD fetches hundreds of real 1–3 star complaints — the reviews where users tell you exactly what\'s broken. Enterprise-grade privacy: Run locally with Ollama or securely plug in your OpenAI key.',
    mockLabel: 'Fetching reviews…',
    mockContent: `<div class="m-row"><span class="m-star">1★</span><span>"Search is completely broken on mobile data…"</span></div><div class="m-row"><span class="m-star">2★</span><span>"Downloads disappear every time I update"</span></div><div class="m-row"><span class="m-star">1★</span><span>"Crashes on open when lyrics panel is pinned"</span></div><div class="m-stat">214 reviews · 3 clusters identified</div>`,
  },
  {
    title: 'AI writes your PRD in seconds.',
    desc: 'Your AI reads every complaint, clusters them into themes, and produces a complete PRD — problem statement, user evidence, functional requirements, and success metrics. Structured, editable, and ready to share.',
    mockLabel: 'PRD · Spotify for Android',
    mockContent: `<div class="m-label">Problem Statement</div><div class="m-body">Users on Android 13+ experience repeated crashes when accessing the lyrics panel, affecting ~18% of reviews this month.</div><div class="m-label mt">Success Metrics</div><div class="m-body">Crash rate → 0% · Offline retention → 98%+</div>`,
  },
  {
    title: 'An issue board, already prioritized.',
    desc: 'Every clustered problem becomes a card — with severity, affected user %, effort estimate, and a real user quote. Drag to triage. Mark issues In Sprint or Won\'t Fix with one click.',
    mockLabel: 'Issue Board',
    mockContent: `<div class="m-issue m-crit"><span>Critical</span><span>Search broken · 31% of users</span></div><div class="m-issue m-high"><span>High</span><span>Downloads lost on update · 22%</span></div><div class="m-issue m-high"><span>High</span><span>Lyrics crash on Android 13 · 18%</span></div>`,
  },
  {
    title: 'Dev tickets — one click.',
    desc: 'Click any issue to generate a full engineering spec: user perspective, what to build, acceptance criteria, edge cases, and out-of-scope. Copy as Markdown or JSON.',
    mockLabel: 'Dev Ticket: Search broken',
    mockContent: `<div class="m-label">Acceptance Criteria</div><div class="m-check">☐ Search works on 2G / 3G connections</div><div class="m-check">☐ Offline query resolves within 500ms</div><div class="m-check">☐ Error state shown when truly offline</div>`,
  },
]

const steps = [
  { title: 'Paste a link', desc: 'Drop in a Google Play or App Store URL. We fetch real 1–3 star reviews automatically.' },
  { title: 'AI generates the PRD', desc: 'Within 2 minutes: a full PRD, a prioritized issue board, and 5–7 ranked problem cards.' },
  { title: 'Triage, ticket, ship', desc: 'Generate dev tickets with acceptance criteria, export your Sprint Pack, and get to work.' },
]

const roadmapItems = [
  { title: '📈 Sentiment Timeline', desc: 'Visual charts showing how user satisfaction shifts across app versions and time. See the exact moment a bad release hit, and whether your fix worked.' },
  { title: '🔌 1-Click Jira / Linear Sync', desc: 'Push your generated tickets directly into your existing workflow with one click. No copy-paste, no reformatting, no switching tabs.' },
  { title: '🎛️ Custom Review Filtering', desc: 'Control exactly how deep the AI digs — set how many reviews to analyze and how far back (in days) to fetch. Perfect for post-launch audits or long-term trend analysis.' },
  { title: '👥 Team Workspaces', desc: 'Shared PRD history, collaborative triage boards, real-time editing, and role-based access for your full product team or agency clients.' },
]
</script>

<style scoped>
/* ── Base ───────────────────────────────────── */
.landing {
  min-height: 100vh;
  background: #1b1b18;
  color: #e8e6e0;
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
}
.accent { color: #e8e4dc; }

/* ── Nav ─────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(27, 27, 24, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
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
  color: #e8e6e0;
}

/* ── Hero — Split layout ─────────────────────── */
.hero {
  max-width: 1100px;
  margin: 0 auto;
  padding: 5rem 1.5rem 5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 85vh;
}
@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; min-height: auto; gap: 2.5rem; }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #e8e4dc;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.3rem 0.75rem;
  border-radius: 100px;
  margin-bottom: 1.5rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.badge-dot {
  width: 5px; height: 5px;
  background: #e8e4dc;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

/* THE key change: serif font for main headline */
.hero-headline {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: clamp(2.75rem, 5.5vw, 4.5rem);
  font-weight: 600;
  line-height: 1.05;

  color: #ffffff;
  margin: 0 0 1.5rem;
}

.hero-sub {
  font-size: 1.0625rem;
  color: #8a8a80;
  line-height: 1.7;
  max-width: 460px;
  margin: 0 0 2rem;
}
.hero-cta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.cta-input {
  flex: 1;
  min-width: 200px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 7px;
  padding: 0.75rem 1rem;
  color: #e8e6e0;
  font-size: 0.9375rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.cta-input::placeholder { color: #4a4a44; }
.cta-input:focus { border-color: rgba(255,255,255,0.3); }
.cta-btn {
  padding: 0.75rem 1.375rem;
  background: #ffffff;
  color: #1b1b18;
  border: none;
  border-radius: 7px;
  font-size: 0.9375rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cta-btn:hover:not(:disabled) { background: #e8e4dc; transform: translateY(-1px); }
.cta-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.cta-btn.large { padding: 0.875rem 1.75rem; font-size: 1rem; }
.cta-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(27,27,24,0.2);
  border-top-color: #1b1b18;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.cta-success { color: #1db954; font-size: 0.875rem; margin: 0.75rem 0 0; }
.cta-error { color: #e5484d; font-size: 0.875rem; margin: 0.75rem 0 0; }
.hero-note { font-size: 0.8125rem; color: #4a4a44; margin: 0.75rem 0 0; }

/* Hero card — matches the dark app dashboard */
.hero-card {
  background: #1b1b18; 
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.6);
}
.card-topbar {
  background: #232320;
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #22c55e; }
.card-title { flex: 1; text-align: center; font-size: 0.7rem; color: #8a8a80; font-family: 'DM Mono', monospace; }
.card-body { padding: 0.875rem; display: flex; flex-direction: column; gap: 0.5rem; }
.issue-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #232320;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 7px;
  padding: 0.6rem 0.875rem;
  font-size: 0.8rem;
}
.sev-tag {
  font-family: 'DM Mono', monospace;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  flex-shrink: 0;
}
.sev-tag.critical { background: rgba(220,38,38,0.15); color: #f87171; }
.sev-tag.high { background: rgba(217,119,6,0.15); color: #fbbf24; }
.sev-tag.medium { background: rgba(59,130,246,0.15); color: #60a5fa; }
.issue-text { flex: 1; color: #e8e6e0; font-weight: 500; text-align: left; }
.issue-status { font-size: 0.7rem; color: #8a8a80; white-space: nowrap; }

/* ── Sections shared ─────────────────────────── */
.section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 6rem 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.section-eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #e8e4dc;
  margin-bottom: 1.25rem;
}
.section-heading {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.1;
  color: #ffffff;
  margin: 0 0 3rem;
}

/* ── PS section ─────────────────────────────── */
.ps-section { text-align: center; }
.center-heading {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.01em;
  margin: 0 0 0.75rem;
}
.center-sub {
  font-size: 1rem;
  color: #6b6b64;
  max-width: 520px;
  margin: 0 auto 3rem;
  line-height: 1.7;
}
.ps-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: start;
  place-items: center;
  text-align: left;
}
@media (max-width: 640px) {
  .ps-grid { grid-template-columns: 1fr; }
  .ps-arrow { display: none; }
}
.ps-badge {
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 1rem;
}
.before-badge { background: rgba(229,72,77,0.08); color: #e5484d; }
.after-badge { background: rgba(255,255,255,0.05); color: #e8e4dc; }
.ps-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
.ps-list li { font-size: 0.9375rem; color: #8a8a80; line-height: 1.5; }
.ps-arrow { font-size: 1.5rem; color: rgba(255,255,255,0.12); align-self: center; }


/* ── Video section ───────────────────────────── */
.video-section {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 5rem 1.5rem 6rem;
  text-align: center;
}
.video-inner { max-width: 900px; margin: 0 auto; }
.video-heading {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: clamp(1.875rem, 4vw, 2.875rem);
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1.1;
  margin: 0 0 1rem;
}
.video-sub { font-size: 1rem; color: #6b6b64; max-width: 520px; margin: 0 auto 2.5rem; line-height: 1.65; }
.video-frame-wrapper { position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 14px; overflow: hidden; }
.video-iframe { width: 100%; height: 100%; display: block; cursor: pointer; }
.video-iframe::-webkit-media-controls-volume-slider,
.video-iframe::-webkit-media-controls-mute-button,
.video-iframe::-webkit-media-controls-volume-control-container,
.video-iframe::-webkit-media-controls-volume-slider-container {
  display: none !important;
}
.video-fs-btn {
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  background: rgba(0,0,0,0.6);
  color: white;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateY(10px);
}
.video-frame-wrapper:hover .video-fs-btn { opacity: 1; transform: translateY(0); }
.video-fs-btn:hover { background: rgba(0,0,0,0.8); border-color: rgba(255,255,255,0.4); transform: scale(1.05) !important; }
.video-fs-btn svg { width: 20px; height: 20px; }



/* ── Feature rows ───────────────────────────── */
.feature-list { display: flex; flex-direction: column; gap: 0; }
.feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 4rem 0;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.feature-row.feat-reverse { direction: rtl; }
.feature-row.feat-reverse > * { direction: ltr; }
@media (max-width: 768px) {
  .feature-row, .feature-row.feat-reverse { grid-template-columns: 1fr; direction: ltr; gap: 2rem; }
}
.feat-num {
  font-family: 'DM Mono', monospace;
  font-size: 0.875rem;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.625rem;
  border-radius: 99px;
  display: inline-block;
  margin-bottom: 0.875rem;
  letter-spacing: 0.05em;
}
.feat-title {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 1rem;
  line-height: 1.2;
}
.feat-desc {
  font-size: 1rem;
  color: #6b6b64;
  line-height: 1.7;
  margin: 0;
}

/* Feature mockup — dark card matching app */
.ui-card {
  background: #1b1b18;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.6);
}
.ui-card-bar {
  background: #232320;
  padding: 0.6rem 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.ui-bar-dot { width: 8px; height: 8px; border-radius: 50%; background: #4a4a44; }
.ui-card-label {
  flex: 1;
  text-align: center;
  font-size: 0.65rem;
  color: #8a8a80;
  font-family: 'DM Mono', monospace;
}
.ui-card-body { padding: 1.25rem; font-size: 0.8125rem; color: #e8e6e0; line-height: 1.5; }

/* ── How it works ───────────────────────────── */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}
@media (max-width: 768px) {
  .steps-grid { grid-template-columns: 1fr; }
}
.step-num {
  font-family: 'DM Mono', monospace;
  font-size: 2rem;
  font-weight: 400;
  color: rgba(255,255,255,0.06);
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}
.step-title { font-size: 1.125rem; font-weight: 700; color: #e8e6e0; margin: 0 0 0.5rem; }
.step-desc { font-size: 0.9375rem; color: #6b6b64; line-height: 1.65; margin: 0; }

/* ── Roadmap ─────────────────────────────────── */
.roadmap-rows { display: flex; flex-direction: column; gap: 0; }
.roadmap-item {
  padding: 1.75rem 0;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.roadmap-item.featured {
  border-left: 2px solid #e8e4dc;
  padding-left: 1.25rem;
  border-top: none;
  margin-bottom: 0.5rem;
}
.roadmap-tag {
  font-family: 'DM Mono', monospace;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #e8e4dc;
  margin-bottom: 0.5rem;
}
.roadmap-title { font-size: 1.0625rem; font-weight: 600; color: #e8e6e0; margin: 0 0 0.375rem; }
.roadmap-desc { font-size: 0.9rem; color: #6b6b64; line-height: 1.6; margin: 0; }

/* ── Final CTA ──────────────────────────────── */
.final-section { text-align: center; }
.final-heading {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1.1;
  margin: 0 0 1rem;
}
.final-sub { font-size: 1rem; color: #6b6b64; max-width: 460px; margin: 0 auto 2rem; line-height: 1.65; }
.final-form {
  display: flex;
  gap: 0.5rem;
  max-width: 440px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}

/* ── Footer ─────────────────────────────────── */
.landing-footer {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 2rem 1.5rem;
  text-align: center;
}
.footer-logo { font-weight: 700; font-size: 1rem; color: #e8e6e0; }
.footer-copy { font-size: 0.8125rem; color: #a1a1aa; margin: 0.375rem 0 0; }

/* ── Early Access Form ── */
.early-access-form {
  display: flex; gap: 0.5rem; margin-bottom: 0.5rem; max-width: 400px;
}
.ea-input {
  flex: 1; padding: 0.75rem 1rem; border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);
  color: #e8e6e0; font-size: 0.9375rem; transition: border-color 0.2s;
  min-width: 0;
}
.ea-input:focus { border-color: rgba(255,255,255,0.3); outline: none; }
.ea-input::placeholder { color: #6b6b64; }
.ea-message { font-size: 0.8125rem; margin-top: 0.5rem; }
.ea-message.success { color: #10b981; }
.ea-message.error { color: #ef4444; }

.cta-link-secondary {
  color: #a1a1aa; text-decoration: none; font-size: 0.9375rem;
  transition: color 0.2s;
}
.cta-link-secondary:hover { color: #e8e6e0; text-decoration: underline; }

/* ── Mockup inner elements ───────────────────── */
:deep(.m-row) { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; align-items: flex-start; }
:deep(.m-star) { color: #fbbf24; font-weight: 700; flex-shrink: 0; }
:deep(.m-stat) { font-size: 0.7rem; color: #6b6b64; margin-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.5rem; }
:deep(.m-label) { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b6b64; margin-bottom: 0.25rem; }
:deep(.m-label.mt) { margin-top: 0.875rem; }
:deep(.m-body) { color: #e8e6e0; margin-bottom: 0.5rem; line-height: 1.6; }
:deep(.m-issue) { display: flex; flex-direction: column; gap: 0.25rem; padding: 0.625rem; background: #232320; border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; margin-bottom: 0.375rem; }
:deep(.m-issue span:first-child) { font-size: 0.6rem; text-transform: uppercase; font-weight: 700; }
:deep(.m-crit span:first-child) { color: #f87171; }
:deep(.m-high span:first-child) { color: #fbbf24; }
:deep(.m-check) { color: #e8e6e0; margin-bottom: 0.375rem; font-family: 'DM Mono', monospace; font-size: 0.75rem; display: flex; align-items: center; gap: 0.375rem; }
</style>
