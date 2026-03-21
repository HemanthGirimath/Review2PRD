# Review2PRD

**The fastest way to turn App Store complaints into a developer-ready product roadmap.**

---

## What is Review2PRD?

Every day, your users are writing detailed bug reports, feature requests, and frustration logs — and posting them as one-star reviews on the App Store and Google Play. Most product teams never systematically read them. The ones who do spend hours copying and pasting, arguing about priorities, and trying to translate raw emotion into actionable engineering work.

Review2PRD eliminates that entire process.

You paste an app store link. Within two minutes, you have a structured Product Requirements Document, a prioritized Issue Board, and developer-ready tickets — generated automatically by AI that actually read the reviews so you don't have to.

---

## Who is it for?

**Product Managers** who are tired of writing PRDs from scratch and want their backlog grounded in real user evidence.

**Startup Founders** who wear multiple hats and need to move fast — from "users are complaining about X" to "here's the ticket for engineering" in minutes, not days.

**Product Teams** who want a single source of truth that shows exactly what users are struggling with, ranked by severity, with quotes to back it up.

---

## How does it work?

### Step 1 — Paste a link
Drop in any Google Play or Apple App Store URL. For example:
`https://play.google.com/store/apps/details?id=com.spotify.music`

Review2PRD fetches hundreds of real negative reviews — the one-star and two-star complaints where users tell you exactly what is broken.

### Step 2 — AI generates your PRD
Your local AI (running on Ollama, so your data never leaves your machine) reads through all the complaints, clusters them into themes, and writes a complete Product Requirements Document that includes:

- A plain-English problem statement summarizing what users are experiencing
- The top pain points, ranked by how often they appear
- Direct quotes from real users to support each finding
- Functional requirements — what exactly needs to be built to fix this
- Success metrics — how you'll know when the problem is solved
- An effort estimate and confidence score

### Step 3 — Review your Issue Board
Every major problem from the PRD becomes a card on your Issue Board. Each card shows you:

- Severity (Critical, High, Medium, Low)
- How many users are affected
- The estimated engineering effort
- A real user quote as evidence
- A space for your own PM notes

You can drag cards to reorder them, mark issues as "In Sprint", "Won't Fix", or "Done", and filter by severity or status.

### Step 4 — Generate developer tickets
Click "Dev Ticket" on any issue and the AI generates a complete engineering specification:

- **User's Perspective** — what the user is experiencing and why it matters
- **What to Build** — a concrete, bulleted list of changes needed
- **Acceptance Criteria** — checkable conditions that define "done"
- **Edge Cases** — things that could go wrong and need handling
- **Out of Scope** — what this ticket deliberately does not cover
- **Technical Notes** — any implementation hints from the reviews themselves

Copy each ticket as Markdown (for Notion, Confluence, Jira) or as JSON (for any integration tool).

### Step 5 — Export and ship
- **Sprint Pack** — export all "In Sprint" tickets as a single Markdown file, ready to paste into your sprint planning document
- **Full Report** — export a complete PRD + issue breakdown for stakeholder review
- **Raw JSON** — machine-readable output compatible with any project management integration

---

## Key features

- **Works with any public app** — Google Play and Apple App Store both supported
- **Fully local AI** — runs on Ollama on your own machine; no data sent to cloud AI services, no per-token API costs
- **Session persistence** — your analysis is automatically saved; come back days later and pick up exactly where you left off
- **Analysis history** — every analysis you run is saved to your account so you can revisit Spotify last week or Duolingo from last month whenever you need to
- **Mobile friendly** — the Issue Board and all core features work on phones and tablets

## Roadmap / Coming Soon

We are actively developing Review2PRD based on user feedback. Here is what's coming next:

- **Competitor Gap Analysis**: In-depth comparison by scraping competitor reviews to find what they do better and where they fail.
- **Sentiment Timeline**: Visual charts showing how user satisfaction shifts after specific app updates.
- **1-Click Sync Integrations**: Push your generated tickets directly into Jira, Linear, and Trello.
- **Custom Review Filtering**: Allow users to configure exactly how many reviews to analyze and how far back (in days) to fetch them.
- **Team Workspaces**: Shared history and collaborative PRD editing for product organizations.

---

## What it is not

Review2PRD is not a replacement for talking to users. Reviews are a signal, not a conversation. The AI helps you process that signal at scale — but the judgment calls, the prioritization decisions, and the "is this really the right thing to build" conversations still belong to you.

It is also not a magic wand that writes perfectly scoped requirements. It gives you a well-structured starting point that you can edit, refine, and push back on. Think of it as a first draft written by an analyst who just speed-read 300 user reviews.

---

## Privacy

Your reviews are fetched directly from public app store APIs. Your AI analysis runs entirely on your local machine via Ollama. Review2PRD does not send your review data or your PRDs to any external AI provider.

Your saved analyses and account information are stored in Supabase (a secure, open-source database platform) under your personal account and are only accessible to you.

---

## Getting started

Visit the app, create a free account, and paste your first app store URL. Your first PRD takes about two minutes to generate.

If you have a local Ollama instance with a compatible model installed, the app will connect to it automatically. No additional configuration is needed.

---

*Built for product people who believe that shipping the right thing matters more than shipping fast.*