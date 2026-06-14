'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth-guard'

export async function createProduct(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
  const category = formData.get('category') as string
  const stock = parseInt(formData.get('stock') as string, 10)
  const rating = formData.get('rating') ? parseFloat(formData.get('rating') as string) : 0
  const reviews = formData.get('reviews') ? parseInt(formData.get('reviews') as string, 10) : 0
  const image = (formData.get('image') as string) || '/placeholder.jpg'
  const imagesRaw = formData.get('images') as string
  const images = imagesRaw ? JSON.parse(imagesRaw) : []

  if (!name || !slug || !description || !price || !category) {
    redirect('/admin/products/new?error=missing_fields')
  }

  const { error } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      description,
      price,
      original_price: originalPrice,
      category,
      stock: stock || 0,
      in_stock: (stock || 0) > 0,
      image,
      images,
      rating: Math.min(5, Math.max(0, rating || 0)),
      reviews: Math.max(0, reviews || 0),
    })

  if (error) {
    console.error('Create product error:', error)
    redirect('/admin/products/new?error=create_failed')
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function updateProduct(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
  const category = formData.get('category') as string
  const stock = parseInt(formData.get('stock') as string, 10)
  const rating = formData.get('rating') ? parseFloat(formData.get('rating') as string) : 0
  const reviews = formData.get('reviews') ? parseInt(formData.get('reviews') as string, 10) : 0
  const image = (formData.get('image') as string) || '/placeholder.jpg'
  const imagesRaw = formData.get('images') as string
  const images = imagesRaw ? JSON.parse(imagesRaw) : []

  if (!id || !name || !slug || !description || !price || !category) {
    redirect(`/admin/products/${id}/edit?error=missing_fields`)
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      slug,
      description,
      price,
      original_price: originalPrice,
      category,
      stock: stock || 0,
      in_stock: (stock || 0) > 0,
      image,
      images,
      rating: Math.min(5, Math.max(0, rating || 0)),
      reviews: Math.max(0, reviews || 0),
    })
    .eq('id', id)

  if (error) {
    console.error('Update product error:', error)
    redirect(`/admin/products/${id}/edit?error=update_failed`)
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) redirect('/')

  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) {
    redirect('/admin/products?error=missing_id')
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete product error:', error)
    redirect('/admin/products?error=delete_failed')
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}
