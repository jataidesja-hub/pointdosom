import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Safety check — logs warning but doesn't crash the app
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Variáveis de ambiente ausentes. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseKey ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
);
