import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://racltfpyfpinvchxfsmh.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2x0ZnB5ZnBpbnZjaHhmc21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTIzNjYsImV4cCI6MjEwMTU2ODM2Nn0.XYrnM7otDKmEnn785rZKk_Yvgq4KvmI_tSKSfJ2XS1o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
