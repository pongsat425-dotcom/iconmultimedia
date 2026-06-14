import { createClient } from '@/utils/supabase/server'
import MediaManagerClient from './MediaManagerClient'

export const metadata = {
  title: 'Media Gallery | Icon Multimedia Admin',
}

export const revalidate = 0 // Disable server caching for admin pages

export default async function AdminMediaPage() {
  const supabase = await createClient()

  // Fetch file list from product-images bucket
  const { data: files, error } = await supabase.storage
    .from('product-images')
    .list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  if (error) {
    console.error('Error listing storage files:', error)
  }

  // Filter and map to include public URL
  const mediaFiles = (files ?? [])
    .filter(file => file.name !== '.emptyFolderPlaceholder') // Filter system folder placeholders
    .map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(file.name)

      return {
        id: file.id || file.name,
        name: file.name,
        size: file.metadata?.size || 0,
        created_at: file.created_at || new Date().toISOString(),
        publicUrl
      }
    })

  return (
    <MediaManagerClient initialFiles={mediaFiles} />
  )
}
