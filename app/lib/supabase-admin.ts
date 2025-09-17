import 'server-only';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// This is a server-only module.
// It is safe to use the service role key here.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Only create the admin client on the server side
const createAdminClient = () => {
  if (supabaseServiceRoleKey) {
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  // In a real app, you might want to throw an error here
  // if the service role key is not available.
  // For this example, we return null.
  return null;
};

export const supabaseAdmin = createAdminClient();
