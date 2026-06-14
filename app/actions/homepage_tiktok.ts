'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth-guard'

async function resolveTikTokUrl(url: string): Promise<string> {
  if (!url) return ''
  const cleanedUrl = url.trim()
  
  if (
    cleanedUrl.includes('vt.tiktok.com') || 
    cleanedUrl.includes('vm.tiktok.com') || 
    cleanedUrl.includes('/t/')
  ) {
    try {
      const res = await fetch(cleanedUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        redirect: 'follow',
      })
      if (res.url) {
        return res.url
      }
    } catch (e) {
      console.error('Failed to resolve TikTok short URL:', e)
    }
  }
  return cleanedUrl
}

export async function createTikTokVideo(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()

  const name = formData.get('name') as string || 'แนะนำร้าน'
  const description = formData.get('description') as string || ''
  const rawTiktokUrl = formData.get('tiktokUrl') as string

  if (!rawTiktokUrl) {
    redirect('/admin/tiktok?error=missing_url')
  }

  const tiktokUrl = await resolveTikTokUrl(rawTiktokUrl)
  const slug = `homepage-tiktok-${Date.now()}`

  const { error } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      description,
      price: 0,
      category: 'homepage_tiktok',
      stock: 9999,
      in_stock: true,
      image: '/placeholder-product.svg',
      rating: 0,
      reviews: 0,
      specs: {
        'TikTok URL': tiktokUrl,
      },
    })

  if (error) {
    console.error('Create homepage TikTok error:', error)
    redirect('/admin/tiktok?error=create_failed')
  }

  revalidatePath('/')
  revalidatePath('/admin/tiktok')
  redirect('/admin/tiktok')
}

export async function updateTikTokVideo(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string || 'แนะนำร้าน'
  const description = formData.get('description') as string || ''
  const rawTiktokUrl = formData.get('tiktokUrl') as string

  if (!id || !rawTiktokUrl) {
    redirect('/admin/tiktok?error=missing_fields')
  }

  const tiktokUrl = await resolveTikTokUrl(rawTiktokUrl)

  const { error } = await supabase
    .from('products')
    .update({
      name,
      description,
      specs: {
        'TikTok URL': tiktokUrl,
      },
    })
    .eq('id', id)
    .eq('category', 'homepage_tiktok')

  if (error) {
    console.error('Update homepage TikTok error:', error)
    redirect('/admin/tiktok?error=update_failed')
  }

  revalidatePath('/')
  revalidatePath('/admin/tiktok')
  redirect('/admin/tiktok')
}

export async function deleteTikTokVideo(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) {
    redirect('/admin/tiktok?error=missing_id')
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('category', 'homepage_tiktok')

  if (error) {
    console.error('Delete homepage TikTok error:', error)
    redirect('/admin/tiktok?error=delete_failed')
  }

  revalidatePath('/')
  revalidatePath('/admin/tiktok')
  redirect('/admin/tiktok')
}
