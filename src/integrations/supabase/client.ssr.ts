// SSR-compatible Supabase client (no localStorage dependency)
// This file is used during server-side rendering / prerendering only
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iieethejhwfsyzhbweps.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_F0SI_-tK5Bp3bilh-daPFA_8xjC6om8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
