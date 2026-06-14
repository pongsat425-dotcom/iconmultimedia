import 'server-only'

import { createClient } from '@/utils/supabase/server'
import type { Product, HeroSlide, ProductReview } from '@/lib/types'
import { CATEGORY_LIST } from '@/lib/mock-data'

// ─── Helpers ───────────────────────────────────────────

/** Map a Supabase product row (snake_case) to frontend Product type (camelCase) */
function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    image: (row.image as string) || '/placeholder-product.svg',
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    category: row.category as string,
    inStock: row.in_stock as boolean,
    stock: Number(row.stock ?? 0),
    rating: Number(row.rating ?? 0),
    reviews: Number(row.reviews ?? 0),
    specs: row.specs as Record<string, string> | undefined,
  }
}

// ─── Product Queries ───────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('category', 'repair')
    .neq('category', 'homepage_tiktok')
    .neq('category', 'section_banner')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllProducts error:', error)
    return []
  }

  return (data ?? []).map(mapProduct)
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return mapProduct(data)
}

export async function getProductsByCategory(categorySlug: string, limit?: number): Promise<Product[]> {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('category', categorySlug)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('getProductsByCategory error:', error)
    return []
  }

  return (data ?? []).map(mapProduct)
}

export async function getNewArrivals(limit = 5): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('category', 'repair')
    .neq('category', 'homepage_tiktok')
    .neq('category', 'section_banner')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getNewArrivals error:', error)
    return []
  }

  return (data ?? []).map(mapProduct)
}

export async function getBestSellers(limit = 5): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('category', 'repair')
    .neq('category', 'homepage_tiktok')
    .neq('category', 'section_banner')
    .order('reviews', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getBestSellers error:', error)
    return []
  }

  return (data ?? []).map(mapProduct)
}

export async function getDiscountedProducts(limit = 10): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('category', 'repair')
    .neq('category', 'homepage_tiktok')
    .neq('category', 'section_banner')
    .not('original_price', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getDiscountedProducts error:', error)
    return []
  }

  return (data ?? []).filter(
    (row) => row.original_price && Number(row.original_price) > Number(row.price)
  ).map(mapProduct)
}

// ─── Low Stock (Admin) ─────────────────────────────────

export async function getLowStockProducts(threshold = 10): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('category', 'repair')
    .neq('category', 'homepage_tiktok')
    .neq('category', 'section_banner')
    .lte('stock', threshold)
    .gt('stock', 0)
    .order('stock', { ascending: true })
    .limit(10)

  if (error) {
    console.error('getLowStockProducts error:', error)
    return []
  }

  return (data ?? []).map(mapProduct)
}

// ─── Order Queries ─────────────────────────────────────

export async function getRecentOrders(limit = 5) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getRecentOrders error:', error)
    return []
  }

  return data ?? []
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !data) return null
  return data
}

// ─── User Queries (Admin) ──────────────────────────────

export async function getUsersList() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getUsersList error:', error)
    return []
  }

  return data ?? []
}

// ─── Hero Slides Queries ───────────────────────────────

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('getHeroSlides error:', error)
    return []
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title || undefined,
    subtitle: row.subtitle || undefined,
    description: row.description || undefined,
    buttonText1: row.button_text_1 || undefined,
    buttonLink1: row.button_link_1 || undefined,
    buttonText2: row.button_text_2 || undefined,
    buttonLink2: row.button_link_2 || undefined,
    imageUrl: row.image_url,
    orderIndex: row.order_index ?? 0,
    createdAt: row.created_at,
  }))
}

export async function getHomepageSettings(): Promise<{
  show_new_arrivals: boolean
  show_best_sellers: boolean
  visible_categories: string[]
}> {
  const supabase = await createClient()
  
  const defaultSettings = {
    show_new_arrivals: true,
    show_best_sellers: true,
    visible_categories: CATEGORY_LIST.map(c => c.slug)
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'homepage_sections')
      .single()

    if (error || !data) {
      if (error && error.code !== 'PGRST116') {
        console.warn('getHomepageSettings warning:', error.message)
      }
      return defaultSettings
    }

    const value = data.value as any
    return {
      show_new_arrivals: value?.show_new_arrivals !== false,
      show_best_sellers: value?.show_best_sellers !== false,
      visible_categories: Array.isArray(value?.visible_categories)
        ? value.visible_categories
        : defaultSettings.visible_categories
    }
  } catch (err) {
    console.warn('getHomepageSettings error-fallback:', err)
    return defaultSettings
  }
}

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getProductReviews error:', error)
    return []
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    productId: row.product_id,
    authorName: row.author_name,
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: row.created_at,
  }))
}


