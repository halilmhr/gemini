import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('🔑 Supabase Configuration:');
console.log('  URL:', supabaseUrl);
console.log('  Anon Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
console.log('  Is Configured:', Boolean(supabaseUrl && supabaseAnonKey));

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are not set. The app will continue with localStorage fallback.');
} else {
  console.log('✅ Supabase client initialized successfully');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
