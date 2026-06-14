import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lpurpvlrcmzwkdmojahy.supabase.co'
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(SUPABASE_URL, ANON_KEY)

async function run() {
  console.log('Testing SELECT query with ANON_KEY...')
  const { data, error } = await supabase.from('products').select('id, name')
  if (error) {
    console.error('Error with ANON_KEY:', error)
  } else {
    console.log('Successfully fetched rows with ANON_KEY:', data.length)
    if (data.length > 0) {
      console.log('First row:', data[0])
    }
  }
}

run()
