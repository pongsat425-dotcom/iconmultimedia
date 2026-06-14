import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lpurpvlrcmzwkdmojahy.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdXJwdmxyY216d2tkbW9qYWh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQ1NzI2NCwiZXhwIjoyMDk1MDMzMjY0fQ.9JFZWp3qW8UnKDGJ9BLDv35sD3PFMCQieerRr8yNgvA'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function run() {
  console.log('Promoting pongsat425@gmail.com to admin...')
  const { data, error } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('email', 'pongsat425@gmail.com')
    .select()

  if (error) {
    console.error('❌ Error setting admin role:', error)
    process.exit(1)
  } else {
    console.log('✅ ตั้งค่า Admin สำเร็จ! Data updated:', data)
    process.exit(0)
  }
}

run()
