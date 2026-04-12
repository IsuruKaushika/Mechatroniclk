import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
// Use service role key for backend (full access, bypasses RLS)
// Falls back to publishable key if service role not available
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials: SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_PUBLISHABLE_KEY)",
  );
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "⚠️  Using public key for Supabase. For production, add SUPABASE_SERVICE_ROLE_KEY to .env for RLS enforcement",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
