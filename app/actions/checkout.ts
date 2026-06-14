'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createOrder(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to place an order' }
  }

  const itemsJson = formData.get('items') as string
  const fullName = formData.get('fullName') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const province = formData.get('province') as string
  const postalCode = formData.get('postalCode') as string
  const phone = formData.get('phone') as string
  const email = (formData.get('email') as string) || ''
  const lineId = (formData.get('lineId') as string) || ''

  if (!fullName || !address || !city || !province || !postalCode || !phone) {
    return { error: 'All shipping fields are required' }
  }

  if (!itemsJson) {
    return { error: 'Cart is empty' }
  }

  let items: Array<{ id?: string; productId?: string; name: string; price: number; quantity: number; image?: string }>
  try {
    items = JSON.parse(itemsJson)
  } catch {
    return { error: 'Invalid cart data' }
  }

  if (!items || items.length === 0) {
    return { error: 'Cart is empty' }
  }

  // ─────────────────────────────────────────────────────────────────
  // SECURITY FIX #3 & #4: Server-side stock validation & price check
  // Fetch actual product data from DB — never trust client prices
  // ─────────────────────────────────────────────────────────────────
  const productIds = items.map(item => item.productId || item.id).filter(Boolean) as string[]

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, stock, in_stock')
    .in('id', productIds)

  if (productsError || !products) {
    console.error('Error fetching products for validation:', productsError)
    return { error: 'ไม่สามารถตรวจสอบข้อมูลสินค้าได้ กรุณาลองอีกครั้ง' }
  }

  // Build a lookup map for quick access
  const productMap = new Map(products.map(p => [p.id, p]))

  // Validate stock for each item & compute real total from DB prices
  let serverTotalAmount = 0
  const validatedItems: Array<{ productId: string; name: string; price: number; quantity: number; image?: string }> = []

  for (const item of items) {
    const itemProductId = item.productId || item.id
    if (!itemProductId) {
      return { error: `สินค้าบางรายการไม่มี ID ที่ถูกต้อง` }
    }

    const product = productMap.get(itemProductId)
    if (!product) {
      return { error: `ไม่พบสินค้า "${item.name}" ในระบบ สินค้านี้อาจถูกลบออกไปแล้ว` }
    }

    const requestedQty = Number(item.quantity ?? 1)
    if (requestedQty <= 0) {
      return { error: `จำนวนสินค้า "${product.name}" ไม่ถูกต้อง` }
    }

    // Stock check
    const currentStock = Number(product.stock ?? 0)
    if (!product.in_stock || currentStock < requestedQty) {
      return {
        error: `สินค้า "${product.name}" มีสต็อกเหลือเพียง ${currentStock} ชิ้น (คุณสั่ง ${requestedQty} ชิ้น) กรุณาปรับจำนวนในตะกร้า`
      }
    }

    // Use server-side price (not client-provided)
    const serverPrice = Number(product.price)
    serverTotalAmount += serverPrice * requestedQty

    validatedItems.push({
      productId: itemProductId,
      name: product.name,
      price: serverPrice,
      quantity: requestedQty,
      image: item.image,
    })
  }

  // ─────────────────────────────────────────────────────────────────
  // Create the order with server-validated prices
  // ─────────────────────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      items: validatedItems,
      total_amount: serverTotalAmount,
      status: 'pending',
      shipping_address: {
        fullName,
        address,
        city,
        province,
        postalCode,
        phone,
        email,
        lineId,
      },
    })
    .select('id')
    .single()

  if (error) {
    console.error('Order creation error:', error)
    return { error: 'Failed to create order. Please try again.' }
  }

  // ─────────────────────────────────────────────────────────────────
  // Deduct stock AFTER successful order creation
  // ─────────────────────────────────────────────────────────────────
  try {
    for (const item of validatedItems) {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.productId)
        .single()

      if (!productError && productData) {
        const currentStock = Number(productData.stock ?? 0)
        const newStock = Math.max(0, currentStock - item.quantity)
        
        await supabase
          .from('products')
          .update({
            stock: newStock,
            in_stock: newStock > 0
          })
          .eq('id', item.productId)
      } else {
        console.error(`Could not fetch product ${item.productId} for stock update:`, productError)
      }
    }
  } catch (stockErr) {
    console.error('Stock decrement error:', stockErr)
  }

  revalidatePath('/orders')
  return { success: true }
}

export async function updateOrderShippingAddress(
  orderId: string,
  shippingAddress: {
    fullName: string
    address: string
    city: string
    province: string
    postalCode: string
    phone: string
    email?: string
    lineId?: string
  }
) {
  const supabase = await createClient()

  // 1. Get current logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to update your shipping address' }
  }

  // 2. Fetch the order to verify ownership and check status
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('user_id, status')
    .eq('id', orderId)
    .single()

  if (fetchError || !order) {
    console.error('Error fetching order for update:', fetchError)
    return { error: 'Order not found' }
  }

  // 3. Verify that the order belongs to the user
  if (order.user_id !== user.id) {
    return { error: 'Unauthorized. You can only edit your own orders.' }
  }

  // 4. Verify that the order status is still 'pending'
  if (order.status !== 'pending') {
    return { error: 'This order is already being processed or has been completed, and its shipping address can no longer be edited.' }
  }

  // 5. Basic field validations
  const { fullName, address, city, province, postalCode, phone, email, lineId } = shippingAddress
  if (!fullName || !address || !city || !province || !postalCode || !phone) {
    return { error: 'All shipping fields are required' }
  }

  // 6. Update shipping_address in database
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      shipping_address: {
        fullName,
        address,
        city,
        province,
        postalCode,
        phone,
        email: email || '',
        lineId: lineId || ''
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)

  if (updateError) {
    console.error('Error updating order shipping address:', updateError)
    return { error: 'Failed to update shipping address. Please try again.' }
  }

  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

