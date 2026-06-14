'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export async function uploadLogo(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const file = formData.get('logo') as File | null
  
  if (!file || file.size === 0) {
    return { error: 'กรุณาเลือกไฟล์ภาพโลโก้' }
  }

  // Allow only images
  if (!file.type.startsWith('image/')) {
    return { error: 'กรุณาเลือกไฟล์ภาพที่ถูกต้อง (เช่น PNG, JPG, WebP)' }
  }

  try {
    const supabase = await createClient()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to public 'product-images' bucket under key 'logo.png'
    const { error } = await supabase.storage
      .from('product-images')
      .upload('logo.png', buffer, {
        contentType: file.type,
        cacheControl: '0', // Set cache to 0 so it updates immediately
        upsert: true       // Overwrite existing logo.png
      })

    if (error) {
      throw error
    }

    // Revalidate storefront and layout
    revalidatePath('/', 'layout')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error uploading logo to Supabase storage:', error)
    return { error: error.message || 'เกิดข้อผิดพลาดในการบันทึกรูปภาพโลโก้ไปยังระบบคลาวด์' }
  }
}

export async function setLogoFromGallery(fileName: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  try {
    const supabase = await createClient()

    // Copy the selected file to logo.png, overwriting it
    const { error } = await supabase.storage
      .from('product-images')
      .copy(fileName, 'logo.png')

    if (error) {
      throw error
    }

    // Revalidate storefront and layout
    revalidatePath('/', 'layout')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error setting logo from gallery:', error)
    return { error: error.message || 'เกิดข้อผิดพลาดในการตั้งค่าโลโก้จากคลังรูปภาพ' }
  }
}

