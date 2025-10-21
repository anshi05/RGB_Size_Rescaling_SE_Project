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

/**
 * @overview Defines an example structure for a user object, useful for type hinting and understanding expected data shape.
 * This object is not a function but a constant representing a data structure.
 * 
 * @constant {object} User - An example user object structure.
 * @property {string} id - The user's unique ID.
 * @property {string} email - The user's email address.
 * @property {object} user_metadata - Metadata associated with the user.
 * @property {string} user_metadata.full_name - The user's full name.
 * @property {string} user_metadata.avatar_url - URL to the user's avatar.
 */
export const User = {
  id: "",
  email: "",
  user_metadata: {
    full_name: "",
    avatar_url: ""
  }
};
