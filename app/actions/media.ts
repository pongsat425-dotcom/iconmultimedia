'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export async function deleteMediaFile(fileName: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = await createClient()

  const { error } = await supabase.storage
    .from('product-images')
    .remove([fileName])

  if (error) {
    console.error('Error deleting media file:', error)
    return { error: error.message || 'ไม่สามารถลบไฟล์รูปภาพจากคลังได้' }
  }

  revalidatePath('/admin/media')
  return { success: true }
}
