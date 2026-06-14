import { Suspense } from 'react'
import LogoManagerClient from './LogoManagerClient'

export const metadata = {
  title: 'Logo Settings | Icon Multimedia Admin',
}

export const revalidate = 0 // Disable server caching for admin pages

export default function AdminLogoPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <LogoManagerClient />
    </Suspense>
  )
}
