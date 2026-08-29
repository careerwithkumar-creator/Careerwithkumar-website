import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Cookie-free anon client for reads covered by the `job_posts_public_read`
// RLS policy (`status = 'published'`, no auth check). Unlike
// `@/lib/supabase/server`, this never touches `cookies()`, so callers can be
// wrapped in `unstable_cache` and routes that only use this client can be
// statically rendered / ISR'd instead of forced dynamic.
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
