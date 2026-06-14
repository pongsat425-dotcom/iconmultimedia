'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export async function addProductReview(formData: FormData) {
  try {
    const supabase = await createClient()

    const productId = formData.get('productId') as string
    const authorName = formData.get('authorName') as string
    const rating = parseFloat(formData.get('rating') as string)
    const comment = formData.get('comment') as string

    if (!productId || !authorName || isNaN(rating) || !comment) {
      return { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }
    }

    const { error } = await supabase
      .from('product_reviews')
      .insert({
        product_id: productId,
        author_name: authorName,
        rating: rating,
        comment: comment
      })

    if (error) {
      console.error('Add review error:', error)
      return { error: error.message || 'ไม่สามารถเพิ่มรีวิวได้' }
    }

    revalidatePath(`/product/${productId}`)
    revalidatePath(`/admin/products/${productId}/edit`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ' }
  }
}

export async function deleteProductReview(reviewId: string, productId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  try {
    const supabase = await createClient()

    if (!reviewId) {
      return { error: 'ไม่พบคิวรีวิวที่ต้องการลบ' }
    }

    const { error } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', reviewId)

    if (error) {
      console.error('Delete review error:', error)
      return { error: error.message || 'ไม่สามารถลบรีวิวได้' }
    }

    revalidatePath(`/product/${productId}`)
    revalidatePath(`/admin/products/${productId}/edit`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ' }
  }
}
