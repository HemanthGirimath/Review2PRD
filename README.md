# Cold Email Outreach Agent

An AI-powered, quality-assured cold email outreach agent built with **LangGraph** and **LangChain**. It reads prospects from a CSV, tracks status in a local SQLite database, drafts personalized emails based on project info, passes drafts through a QA validator loop, and delivers emails via **Resend.com**.

---

## 🛠️ Setup & Installation

The project uses `uv` for python package and environment management.

1. **Install dependencies and activate the virtual environment:**
   ```bash
   uv sync
   source .venv/bin/activate
   ```

2. **Configure your environment:**
   Copy the example environment file and fill in your keys:
   ```bash
   cp .env.example .env
   ```

---

## ⚙️ Configuration (.env)

Open `.env` to configure your LLM provider and email sender:

### 1. LLM Provider Options
- **OpenAI (Default):**
  ```env
  LLM_PROVIDER=openai
  LLM_MODEL=gpt-4o-mini
  OPENAI_API_KEY=your-api-key
  ```
- **Ollama (Local):**
  ```env
  LLM_PROVIDER=ollama
  LLM_MODEL=llama3.2:latest
  OLLAMA_BASE_URL=http://localhost:11434
  ```
- **Anthropic:**
  ```env
  LLM_PROVIDER=anthropic
  LLM_MODEL=claude-3-haiku-20240307
  ANTHROPIC_API_KEY=your-api-key
  ```

### 2. Email Sender (Resend.com)
Set up your Resend details:
```env
RESEND_API_KEY=re_your_api_key
SENDER_EMAIL=you@yourdomain.com
SENDER_NAME="Your Name"
```

---

## 🚀 How to Run

### 1. Test / Dry-Run Mode (Safe Mode)
By default, the application runs in dry-run mode to prevent accidentally blasting emails.
Make sure your `.env` contains:
```env
DRY_RUN=true
```
Run the agent:
```bash
uv run python main.py
```
- It will load prospects, draft emails, ask for your manual review on the **first email**, run the QA check, simulate sending (printing the text to your console), and log the result to the local SQLite database.

### 2. Production / Live Send Mode
When you are ready to send real emails to your contacts:
Change your `.env` setting:
```env
DRY_RUN=false
```
Run the agent:
```bash
uv run python main.py
```

---

## 📋 Prospect Configuration (CSV)

Place your prospect list inside `data/prospects.csv` using the following column headers:
```csv
name,email,company,role,country,notes
```
*Note: If you export prospects from Apollo.io or other sources, you can map the column headers directly inside [tools/csv_loader.py](tools/csv_loader.py) under the `COLUMN_MAP` dictionary.*

---
