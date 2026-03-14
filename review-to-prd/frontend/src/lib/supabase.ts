import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// If env vars are missing, the app still loads but auth won't work (dev mode)
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function getUser() {
    if (!supabase) return null
    const { data } = await supabase.auth.getUser()
    return data.user ?? null
}

export async function signInWithEmail(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
    return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured.')
    return supabase.auth.signUp({ email, password })
}

export async function signInWithGoogle() {
    if (!supabase) throw new Error('Supabase not configured.')
    return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/app` } })
}

export async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
}
