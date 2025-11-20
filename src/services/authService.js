import { supabase } from "../supabase/supabaseClient.js";

// Email + Password Sign Up
export async function signUp(email, password) {
  return await supabase.auth.signUp({ email, password });
}

// Email + Password Login
export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

// Google Login
export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

// Logout
export async function logout() {
  return await supabase.auth.signOut();
}

// Current User
export async function getCurrentUser() {
  return await supabase.auth.getUser();
}
