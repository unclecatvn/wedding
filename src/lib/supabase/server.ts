import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
export const supabaseStorageBucket =
  process.env.SUPABASE_STORAGE_BUCKET || "wedding-media";

export const hasSupabaseStorageConfig = Boolean(
  supabaseUrl && supabasePublishableKey,
);

export function getSupabaseStorage() {
  if (!hasSupabaseStorageConfig) {
    return null;
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
