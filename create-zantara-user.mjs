// create-zantara-user.mjs
// Creates a Zantara client user directly — no email invites, no rate limits.
// Usage: node create-zantara-user.mjs <service-role-key> <email> <password>

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ubkomeuvbrhphmajeltl.supabase.co'
const [,, serviceKey, email, password] = process.argv

if (!serviceKey || !email || !password) {
  console.error('Usage: node create-zantara-user.mjs <service-role-key> <email> <password>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function run() {
  // Find Zantara client
  const { data: clients } = await supabase
    .from('clients').select('id').ilike('slug', '%zantara%')
  const clientId = clients?.[0]?.id
  if (!clientId) { console.error('❌ Zantara client not found. Run seed-zantara.mjs first.'); process.exit(1) }

  // Create the user with email + password directly (no email sent)
  const { data: created, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip email verification
    user_metadata: { full_name: 'Zantara Admin', role: 'client' },
  })
  if (error) { console.error('❌ Failed:', error.message); process.exit(1) }

  const userId = created.user.id

  // Link to Zantara client in profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: userId, email, full_name: 'Zantara Admin', role: 'client', client_id: clientId })
  if (profileError) { console.error('❌ Profile link failed:', profileError.message); process.exit(1) }

  console.log('\n✅ Done!')
  console.log(`   Email:    ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`   Log in at: https://cms.wilsoncreativeco.au/auth/login`)
}

run().catch(err => { console.error(err); process.exit(1) })
