-- Review2PRD Database Schema
-- Run this on your Railway Postgres instance

CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Keep UUID to match Supabase Auth IDs
    app_name TEXT NOT NULL,
    platform TEXT,
    input_value TEXT,
    input_mode TEXT,
    prd JSONB NOT NULL,
    issues JSONB DEFAULT '[]',
    ticket_cache JSONB DEFAULT '{}',
    analyzed_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
-- Index for recent analyses sorting
CREATE INDEX IF NOT EXISTS idx_analyses_analyzed_at ON analyses(analyzed_at DESC);
