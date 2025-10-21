/**
 * @file lib/supabase.js
 * @author Anshi
 * @description Initializes and exports the Supabase client for database and authentication interactions.
 * @lastUpdated 2025-10-14
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example user object structure (for reference)
export const User = {
  id: "",
  email: "",
  user_metadata: {
    full_name: "",
    avatar_url: ""
  }
};
