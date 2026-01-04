// SSR-compatible Supabase client (no localStorage dependency)
// This file is used during server-side rendering / prerendering only
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iieethejhwfsyzhbweps.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZWV0aGVqaHdmc3l6aGJ3ZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTkyMTcsImV4cCI6MjA4MDI3NTIxN30.s6hsm234IxF3NbYc2oNCjWZ28huDNSt588WLDxlV1hM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
