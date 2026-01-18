// File: src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Inisialisasi Supabase client dengan type Database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export tipe untuk digunakan di seluruh aplikasi
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];
  
export type Insertable<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];
  
export type Updatable<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];