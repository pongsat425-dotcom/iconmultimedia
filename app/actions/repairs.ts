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

export async function createRepair(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
  const deviceType = formData.get('deviceType') as string
  const warranty = formData.get('warranty') as string
  const repairTime = formData.get('repairTime') as string
  const rawTiktokUrl = formData.get('tiktokUrl') as string
  const image = (formData.get('image') as string) || '/placeholder-product.svg'

  if (!name || !slug || !description || !price || !deviceType) {
    redirect('/admin/repairs/new?error=missing_fields')
  }

  const tiktokUrl = await resolveTikTokUrl(rawTiktokUrl)

  const { error } = await supabase
     .from('products')
     .insert({
       name,
       slug,
       description,
       price,
       original_price: originalPrice,
       category: 'repair',
       stock: 9999,
       in_stock: true,
       image,
       rating: 0,
       reviews: 0,
       specs: {
         'Device Type': deviceType,
         'Warranty': warranty || 'N/A',
         'Repair Time': repairTime || 'N/A',
         'TikTok URL': tiktokUrl || '',
       },
     })

  if (error) {
    console.error('Create repair service error:', error)
    redirect('/admin/repairs/new?error=create_failed')
  }

  revalidatePath('/admin/repairs')
  revalidatePath('/repairs')
  redirect('/admin/repairs')
}

export async function updateRepair(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
  const deviceType = formData.get('deviceType') as string
  const warranty = formData.get('warranty') as string
  const repairTime = formData.get('repairTime') as string
  const rawTiktokUrl = formData.get('tiktokUrl') as string
  const image = (formData.get('image') as string) || '/placeholder-product.svg'

  if (!id || !name || !slug || !description || !price || !deviceType) {
    redirect(`/admin/repairs/${id}/edit?error=missing_fields`)
  }

  const tiktokUrl = await resolveTikTokUrl(rawTiktokUrl)

  const { error } = await supabase
    .from('products')
    .update({
      name,
      slug,
      description,
      price,
      original_price: originalPrice,
      image,
      specs: {
        'Device Type': deviceType,
        'Warranty': warranty || 'N/A',
        'Repair Time': repairTime || 'N/A',
        'TikTok URL': tiktokUrl || '',
      },
    })
    .eq('id', id)
    .eq('category', 'repair')

  if (error) {
    console.error('Update repair service error:', error)
    redirect(`/admin/repairs/${id}/edit?error=update_failed`)
  }

  revalidatePath('/admin/repairs')
  revalidatePath('/repairs')
  redirect('/admin/repairs')
}

export async function deleteRepair(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) {
    redirect('/admin/repairs?error=missing_id')
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('category', 'repair')

  if (error) {
    console.error('Delete repair service error:', error)
    redirect('/admin/repairs?error=delete_failed')
  }

  revalidatePath('/admin/repairs')
  revalidatePath('/repairs')
  redirect('/admin/repairs')
}

export async function submitRepairRequest(formData: FormData) {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'กรุณาเข้าสู่ระบบเพื่อดำเนินการแจ้งซ่อม' }
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string
  const deviceType = formData.get('deviceType') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const province = formData.get('province') as string
  const postalCode = formData.get('postalCode') as string
  const lineId = (formData.get('lineId') as string) || ''

  if (!name || !email || !phone || !subject || !message || !deviceType || !address || !city || !province || !postalCode) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่องที่มีเครื่องหมาย *' }
  }

  // Create order item structure for repair
  const items = [
    {
      productId: 'repair-request',
      type: 'repair',
      name: subject,
      description: message,
      deviceType: deviceType,
      technicianNotes: '',
      price: 0,
      quantity: 1,
      image: '/placeholder-product.svg'
    }
  ]

  // Insert into orders table
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      items,
      total_amount: 0, // initially 0, admin will update this
      status: 'pending',
      shipping_address: {
        fullName: name,
        address,
        city,
        province,
        postalCode,
        phone,
        email,
        lineId,
      }
    })
    .select('id')
    .single()

  if (error) {
    console.error('Submit repair request error:', error)
    return { error: 'ไม่สามารถส่งข้อมูลแจ้งซ่อมได้ กรุณาลองใหม่อีกครั้ง' }
  }

  revalidatePath('/orders')
  revalidatePath('/admin/orders')
  return { success: true, orderId: data.id }
}
