import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseServerEnv } from "./env";
import type { Database } from "./types";

export function createSupabaseServerClient() {
  const { url, serviceRoleKey } = getSupabaseServerEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}