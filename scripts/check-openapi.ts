import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lpurpvlrcmzwkdmojahy.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

async function run() {
  console.log('Fetching schema with URL:', SUPABASE_URL)
  console.log('SERVICE_ROLE_KEY length:', SERVICE_ROLE_KEY.length)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  })


  console.log('Status code:', res.status)
  const text = await res.text()
  console.log('Response length:', text.length)
  try {
    const schema = JSON.parse(text)
    console.log('Exposed definitions:', Object.keys(schema.definitions || {}))
    if (schema.definitions && schema.definitions.products) {
      console.log('Products columns:', Object.keys(schema.definitions.products.properties || {}))
    } else {
      console.log('No products definition found in parsed JSON')
    }
  } catch (e) {
    console.error('Failed to parse JSON:', e)
    console.log('Response content:', text.substring(0, 500))
  }
}

run()


