import { createClient } from '@supabase/supabase-js';

// Default Supabase project configuration (Can be overridden via VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY env vars)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qzwgqmlrqwvhjxltptmw.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6d2dxbWxycXd2aGp4bHRwdG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkyODEyMDAsImV4cCI6MjAyNDg1NzIwMH0.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
