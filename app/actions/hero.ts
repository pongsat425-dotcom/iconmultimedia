'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth-guard'

export async function upsertHeroSlide(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()

  const id = formData.get('id') as string | null
  const title = (formData.get('title') as string) || null
  const subtitle = (formData.get('subtitle') as string) || null
  const description = (formData.get('description') as string) || null
  const button_text_1 = (formData.get('buttonText1') as string) || null
  const button_link_1 = (formData.get('buttonLink1') as string) || null
  const button_text_2 = (formData.get('buttonText2') as string) || null
  const button_link_2 = (formData.get('buttonLink2') as string) || null
  const image_url = formData.get('image') as string
  const order_index = parseInt(formData.get('orderIndex') as string, 10) || 0

  if (!image_url) {
    redirect('/admin/hero?error=missing_image')
  }

  const slideData = {
    title,
    subtitle,
    description,
    button_text_1,
    button_link_1,
    button_text_2,
    button_link_2,
    image_url,
    order_index,
  }

  if (id) {
    // Update existing slide
    const { error } = await supabase
      .from('hero_slides')
      .update(slideData)
      .eq('id', id)

    if (error) {
      console.error('Update hero slide error:', error)
      redirect('/admin/hero?error=update_failed')
    }
  } else {
    // Insert new slide
    const { error } = await supabase
      .from('hero_slides')
      .insert(slideData)

    if (error) {
      console.error('Create hero slide error:', error)
      redirect('/admin/hero?error=create_failed')
    }
  }

  revalidatePath('/')
  revalidatePath('/admin/hero')
  redirect('/admin/hero')
}

export async function deleteHeroSlide(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) {
    redirect('/admin/hero?error=missing_id')
  }

  const { error } = await supabase
    .from('hero_slides')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete hero slide error:', error)
    redirect('/admin/hero?error=delete_failed')
  }

  revalidatePath('/')
  revalidatePath('/admin/hero')
  redirect('/admin/hero')
}
