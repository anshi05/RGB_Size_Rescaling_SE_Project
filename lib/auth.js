/**
 * @file lib/auth.js
 * @author Anshi
 * @description Provides functions for user authentication, including sign-up, sign-in, sign-out, and password reset.
 * @lastUpdated 2025-10-14
 */
import { supabase } from "./supabase";

/**
 * @overview Registers a new user with the provided email, password, and full name using Supabase authentication.
 * Upon successful registration, a confirmation email is sent to the user.
 * 
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user's account.
 * @param {string} fullName - The full name of the new user, stored in user metadata.
 * 
 * @returns {Promise<{data: object | null, error: Error | null}>} An object containing either the user data upon success
 * or an error object if registration fails.
 */
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  return { data, error };
};

/**
 * @overview Authenticates an existing user with their email and password using Supabase.
 * 
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * 
 * @returns {Promise<{data: object | null, error: Error | null}>} An object containing either the session data upon success
 * or an error object if authentication fails.
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

/**
 * @overview Logs out the current authenticated user from the Supabase session.
 * 
 * @returns {Promise<{error: Error | null}>} An object containing an error object if logout fails, or null on success.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * @overview Retrieves the currently authenticated user's session data from Supabase.
 * 
 * @returns {Promise<{user: object | null, error: Error | null}>} An object containing either the user object upon success
 * or an error object if retrieval fails.
 */
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
};

/**
 * @overview Initiates the password reset process for a given email address via Supabase.
 * A password reset link will be sent to the user's email.
 * 
 * @param {string} email - The email address for which to send a password reset link.
 * 
 * @returns {Promise<{data: object | null, error: Error | null}>} An object containing data upon success
 * (which might be null if no user found with that email, but a link is still sent to prevent enumeration)
 * or an error object if the request fails.
 */
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`, // URL to redirect to after password reset
  });
  return { data, error };
};
