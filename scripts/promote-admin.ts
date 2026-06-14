import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Simple env parser
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    env[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function promoteFirstUser() {
  const { data: users, error } = await supabase.from('users').select('*').limit(1)
  
  if (error || !users || users.length === 0) {
    console.log('No users found in public.users table. Please register an account first on http://localhost:3000/register')
    return
  }

  const user = users[0]
  console.log(`Found user: ${user.email}`)
  
  const { error: updateError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating role:', updateError)
  } else {
    console.log(`Successfully promoted ${user.email} to admin!`)
    console.log('You can now log in at http://localhost:3000/login and access the Admin dashboard.')
  }
}

promoteFirstUser()
