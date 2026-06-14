import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Parse .env.local directly
const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
  const parts = line.split('=')
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  const filePath = path.join(process.cwd(), 'public', 'logo.png')
  const buffer = fs.readFileSync(filePath)
  
  console.log('Uploading logo.png to Supabase...')
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload('logo.png', buffer, {
      contentType: 'image/png',
      cacheControl: '0',
      upsert: true
    })

  if (error) {
    console.error('Error uploading logo:', error.message)
    process.exit(1)
  }

  console.log('Logo uploaded successfully!', data)
}

main()
