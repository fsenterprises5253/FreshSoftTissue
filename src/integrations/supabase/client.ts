import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types"; // ✅ Points to your generated Supabase types

// ✅ Load environment variables (from .env or .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Check if environment variables exist
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables!");
  throw new Error("Supabase URL or Anon Key is missing. Please check your .env file.");
}

// ✅ Create Supabase client with full typing
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // 🧩 Helps for OAuth redirects if used
  },
});

// ✅ Type helpers (for cleaner imports throughout your app)
export type SupabaseClient = typeof supabase;
export type Tables = Database["public"]["Tables"];
export type TablesInsert<K extends keyof Tables> = Tables[K]["Insert"];
export type TablesUpdate<K extends keyof Tables> = Tables[K]["Update"];
