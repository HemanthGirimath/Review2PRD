import axios from 'axios'
import { supabase } from './supabase'

const API_BASE = '/api/settings'

export interface UserSettings {
    ai_provider: 'ollama' | 'openai' | 'groq' | 'deepseek' | 'ollama-cloud'
    ai_model: string
    api_key: string
    base_url: string
}

async function getAuthHeader() {
    if (!supabase) return {}
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return {}
    return { Authorization: `Bearer ${session.access_token}` }
}

export async function getSettings(): Promise<UserSettings | null> {
    try {
        const headers = await getAuthHeader()
        const res = await axios.get<{ success: boolean; data: UserSettings }>(API_BASE, { headers })
        return res.data.data
    } catch (err: any) {
        console.warn('[settings] Get failed:', err.response?.data?.error || err.message)
        return null
    }
}

export async function saveSettings(settings: UserSettings): Promise<boolean> {
    try {
        const headers = await getAuthHeader()
        await axios.post(API_BASE, settings, { headers })
        return true
    } catch (err: any) {
        console.warn('[settings] Save failed:', err.response?.data?.error || err.message)
        return false
    }
}

export async function testConnection(): Promise<{ success: boolean; message: string }> {
    try {
        const headers = await getAuthHeader()
        const res = await axios.get('/api/settings/test', { headers })
        return res.data
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message }
    }
}
