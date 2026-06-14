import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lpurpvlrcmzwkdmojahy.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function run() {
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
  if (authError) {
    console.error('Error fetching auth users:', authError)
  } else {
    console.log('Auth Users count:', authUsers?.users?.length)
    authUsers?.users?.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}`))
  }

  const { data: dbUsers, error: dbError } = await supabase.from('users').select('*')
  if (dbError) {
    console.error('Error fetching db users:', dbError)
  } else {
    console.log('Database Users (users table):')
    dbUsers?.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}`))
  }
}

run()
