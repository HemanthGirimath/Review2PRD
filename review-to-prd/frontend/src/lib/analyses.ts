import axios from 'axios'
import { supabase } from './supabase'
import type { PRD, Issue, DevTicket, InputMode } from '../types'

const API_BASE = '/api/analyses'

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

async function getAuthHeader() {
    if (!supabase) return {}
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return {}
    return { Authorization: `Bearer ${session.access_token}` }
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
    try {
        const headers = await getAuthHeader()
        const res = await axios.post<{ success: boolean; id: string }>(API_BASE, params, { headers })
        return res.data.id
    } catch (err: any) {
        console.warn('[analyses] Save failed:', err.response?.data?.error || err.message)
        return null
    }
}

export async function listAnalyses(): Promise<SavedAnalysis[]> {
    try {
        const headers = await getAuthHeader()
        const res = await axios.get<{ success: boolean; data: any[] }>(API_BASE, { headers })
        return res.data.data ?? []
    } catch (err: any) {
        console.warn('[analyses] List failed:', err.response?.data?.error || err.message)
        return []
    }
}

export async function deleteAnalysis(id: string): Promise<void> {
    try {
        const headers = await getAuthHeader()
        await axios.delete(`${API_BASE}/${id}`, { headers })
    } catch (err: any) {
        console.warn('[analyses] Delete failed:', err.response?.data?.error || err.message)
    }
}
