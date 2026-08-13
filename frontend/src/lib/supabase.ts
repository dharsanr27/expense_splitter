import {createClient} from  '@supabase/supabase-js'//why createclient and why /


export  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)