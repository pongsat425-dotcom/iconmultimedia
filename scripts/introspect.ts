import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lpurpvlrcmzwkdmojahy.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function run() {
  console.log('Querying hero_slides...')
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
  
  if (error) {
    console.error('Error fetching hero_slides:', error)
  } else {
    console.log('Hero slides:', JSON.stringify(data, null, 2))
  }
}

run()




