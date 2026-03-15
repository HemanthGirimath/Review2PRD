-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY, -- Matches Supabase user ID
    ai_provider VARCHAR(50) DEFAULT 'ollama', -- 'ollama', 'openai', 'groq'
    ai_model VARCHAR(100) DEFAULT 'llama3',
    api_key TEXT, -- Encrypted at rest is better, but start with raw for prototype
    base_url TEXT, -- For Ollama or custom OpenAI endpoints
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_settings_user ON user_settings(user_id);
