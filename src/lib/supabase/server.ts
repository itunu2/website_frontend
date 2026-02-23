import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

export const createServerSupabaseClient = () => {
  const supabaseUrl = env.server.SUPABASE_URL;
  const supabaseServiceRoleKey = env.server.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for newsletter subscription API");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
