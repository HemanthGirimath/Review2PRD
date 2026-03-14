import { supabase } from './supabase'
import type { PRD, Issue, DevTicket, InputMode } from '../types'

// Table: public.analyses
// Run this SQL once in your Supabase SQL Editor:
//
// create table public.analyses (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid references auth.users(id) on delete cascade not null,
//   app_name text not null,
//   platform text,
//   input_value text,
//   input_mode text,
//   prd jsonb not null,
//   issues jsonb default '[]',
//   ticket_cache jsonb default '{}',
//   analyzed_at timestamptz default now()
// );
// alter table public.analyses enable row level security;
// create policy "own" on public.analyses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

export interface SavedAnalysis {
    id: string
    app_name: string
    platform: string | null
    input_value: string | null
    input_mode: string | null
    prd: PRD
    issues: Issue[]
    ticket_cache: Record<string, DevTicket>
    analyzed_at: string
}

export async function saveAnalysis(params: {
    appName: string
    platform: string
    inputValue: string
    inputMode: InputMode
    prd: PRD
    issues: Issue[]
    ticketCache: Record<string, DevTicket>
}): Promise<string | null> {
    if (!supabase) return null
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('analyses')
        .insert({
            user_id: user.id,
            app_name: params.appName,
            platform: params.platform,
            input_value: params.inputValue,
            input_mode: params.inputMode,
            prd: params.prd,
            issues: params.issues,
            ticket_cache: params.ticketCache,
        })
        .select('id')
        .single()

    if (error) {
        console.warn('[analyses] Save failed:', error.message)
        return null
    }
    return data.id
}

export async function listAnalyses(): Promise<SavedAnalysis[]> {
    if (!supabase) return []
    const { data, error } = await supabase
        .from('analyses')
        .select('id, app_name, platform, input_value, input_mode, prd, issues, ticket_cache, analyzed_at')
        .order('analyzed_at', { ascending: false })
        .limit(20)

    if (error) {
        console.warn('[analyses] List failed:', error.message)
        return []
    }
    return data ?? []
}

export async function deleteAnalysis(id: string): Promise<void> {
    if (!supabase) return
    await supabase.from('analyses').delete().eq('id', id)
}
