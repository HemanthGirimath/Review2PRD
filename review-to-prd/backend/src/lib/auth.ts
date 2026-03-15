import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[auth] Supabase environment variables missing. Auth will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserIdFromToken(authHeader: string | undefined): Promise<string | null> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
        console.warn('[auth] Token verification failed:', error?.message);
        return null;
    }
    
    return user.id;
}
