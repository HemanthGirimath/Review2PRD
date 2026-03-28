import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

import posthog from 'posthog-js'

const user = ref<User | null>(null)

// Bootstrap on import — listen to auth state changes
if (supabase) {
    supabase.auth.getUser().then(({ data }) => { 
        user.value = data.user ?? null 
        if (data.user) {
            posthog.identify(data.user.id, { email: data.user.email })
        }
    })
    supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
        if (session?.user) {
            posthog.identify(session.user.id, { email: session.user.email })
        } else {
            posthog.reset()
        }
    })
}

export function useAuth() {

    const router = useRouter()
    const loading = ref(false)
    const authError = ref<string | null>(null)

    async function login(email: string, password: string) {
        loading.value = true; authError.value = null
        try {
            const { error } = await signInWithEmail(email, password)
            if (error) { authError.value = error.message; return }
            posthog.capture('user_login', { email })
            router.push('/app')
        } catch (e: any) {
            authError.value = e.message
        } finally { loading.value = false }
    }

    async function signup(email: string, password: string) {
        loading.value = true; authError.value = null
        try {
            const { error } = await signUpWithEmail(email, password)
            if (error) { authError.value = error.message; return }
            posthog.capture('user_signup', { email })
            router.push('/app')
        } catch (e: any) {
            authError.value = e.message
        } finally { loading.value = false }
    }


    async function loginWithGoogle() {
        loading.value = true; authError.value = null
        try { await signInWithGoogle() }
        catch (e: any) { authError.value = e.message; loading.value = false }
    }

    async function logout() {
        await signOut()
        router.push('/')
    }

    return { user, loading, authError, login, signup, loginWithGoogle, logout }
}
