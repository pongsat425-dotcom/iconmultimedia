'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth-guard'

export async function saveSectionBanner(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()

  const sectionId = formData.get('sectionId') as string // e.g. 'new-arrivals', 'laptops'
  const title = formData.get('title') as string || ''
  const image = formData.get('image') as string || '/placeholder-banner.jpg'
  const style = formData.get('style') as string || 'Simple' // Simple, Zoom Hover, Neon Glow, Multi-Image Grid
  const linkUrl = formData.get('linkUrl') as string || ''
  const isActive = formData.get('isActive') === 'true'

  // Additional Grid Images (up to 4 in total)
  const image2 = formData.get('image2') as string || ''
  const image3 = formData.get('image3') as string || ''
  const image4 = formData.get('image4') as string || ''
  const linkUrl2 = formData.get('linkUrl2') as string || ''
  const linkUrl3 = formData.get('linkUrl3') as string || ''
  const linkUrl4 = formData.get('linkUrl4') as string || ''

  if (!sectionId) {
    redirect('/admin/section-banners?error=missing_section')
  }

  // Check if a banner for this section already exists
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('category', 'section_banner')
    .eq('name', sectionId)
    .single()

  if (existing) {
    // Update existing banner
    const { error } = await supabase
      .from('products')
      .update({
        description: title,
        image,
        in_stock: isActive,
        specs: {
          'Style': style,
          'Link URL': linkUrl,
          'Is Active': isActive,
          'Image 2': image2,
          'Image 3': image3,
          'Image 4': image4,
          'Link URL 2': linkUrl2,
          'Link URL 3': linkUrl3,
          'Link URL 4': linkUrl4,
        },
      })
      .eq('id', existing.id)

    if (error) {
      console.error('Update section banner error:', error)
      redirect('/admin/section-banners?error=save_failed')
    }
  } else {
    // Insert new banner
    const slug = `section-banner-${sectionId}-${Date.now()}`
    const { error } = await supabase
      .from('products')
      .insert({
        name: sectionId,
        slug,
        description: title,
        price: 0,
        category: 'section_banner',
        stock: 9999,
        in_stock: isActive,
        image,
        rating: 0,
        reviews: 0,
        specs: {
          'Style': style,
          'Link URL': linkUrl,
          'Is Active': isActive,
          'Image 2': image2,
          'Image 3': image3,
          'Image 4': image4,
          'Link URL 2': linkUrl2,
          'Link URL 3': linkUrl3,
          'Link URL 4': linkUrl4,
        },
      })

    if (error) {
      console.error('Create section banner error:', error)
      redirect('/admin/section-banners?error=save_failed')
    }
  }

  revalidatePath('/')
  revalidatePath('/admin/section-banners')
  redirect('/admin/section-banners?success=saved')
}

export async function deleteSectionBanner(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) {
    redirect('/admin/section-banners?error=missing_id')
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('category', 'section_banner')

  if (error) {
    console.error('Delete section banner error:', error)
    redirect('/admin/section-banners?error=delete_failed')
  }

  revalidatePath('/')
  revalidatePath('/admin/section-banners')
  redirect('/admin/section-banners?success=deleted')
}
