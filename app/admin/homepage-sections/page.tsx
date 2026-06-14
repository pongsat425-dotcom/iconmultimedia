import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getHomepageSettings } from '@/lib/supabase/queries'
import HomepageSectionsClient from './HomepageSectionsClient'

export const metadata = {
  title: 'Homepage Sections | Icon Multimedia Admin',
}

export default async function HomepageSectionsPage() {
  const supabase = await createClient()

  // 1. Verify user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?redirect=/admin/homepage-sections')
  }

  // 2. Verify user is an admin
  const { data: profile, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !profile || profile.role !== 'admin') {
    redirect('/')
  }

  // 3. Get layout settings
  const settings = await getHomepageSettings()

  return <HomepageSectionsClient initialSettings={settings} />
}
