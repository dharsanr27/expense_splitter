import 'dotenv/config';

// test-login.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
async function main() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'dharsanr27@gmail.com',
    password: '1234',
  });

  if (error) {
    console.error('Login failed:', error.message);
    return;
  }

  // console.log(data.session?.access_token);
}

main();