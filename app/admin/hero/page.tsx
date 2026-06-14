import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import HeroManagerClient from './HeroManagerClient'

export const metadata = {
  title: 'Manage Hero Slides | Icon Multimedia Admin',
}

export const revalidate = 0 // Disable cache for admin page to ensure latest data is loaded

export default async function AdminHeroPage() {
  const supabase = await createClient()
  const { data: slides, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching hero slides:', error)
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <HeroManagerClient initialSlides={slides || []} />
    </Suspense>
  )
}
