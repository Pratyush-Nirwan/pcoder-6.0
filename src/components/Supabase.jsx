import { createClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
            storage: isBrowser ? window.localStorage : undefined,
        },
        global: {
            headers: {
                'X-Client-Info': 'pcoder-guestbook/1.0.0',
            },
        },
    }
);

// OAuth login
export const signInWithGitHub = async () => {
    return await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: window.location.origin + '/guestbook',
            scopes: 'read:user user:email',
        },
    });
};

// Logout
export const signOut = async () => {
    return await supabase.auth.signOut();
};

// ✅ REQUIRED (your app expects this)
export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
};
