// lib/supabase/client.js

import { createBrowserClient } from "@supabase/ssr";

// Creates a Supabase client for browser components.
// The browser client uses the public project configuration.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}