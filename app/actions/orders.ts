'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export async function updateOrderStatus(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = await createClient()

  const orderId = formData.get('orderId') as string
  const status = formData.get('status') as string

  if (!orderId || !status) {
    return { error: 'Order ID and status are required' }
  }

  const validStatuses = ['pending', 'processing', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) {
    return { error: 'Invalid status' }
  }

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) {
    console.error('Update order status error:', error)
    return { error: 'Failed to update order status' }
  }

  revalidatePath('/admin/orders')
  return { success: true }
}

export async function deleteOrder(orderId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = await createClient()

  if (!orderId) {
    return { error: 'Order ID is required' }
  }

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)

  if (error) {
    console.error('Delete order error:', error)
    return { error: 'Failed to delete order' }
  }

  revalidatePath('/admin/orders')
  return { success: true }
}

export async function updateRepairOrderDetails(
  orderId: string,
  totalAmount: number,
  technicianNotes: string
) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = await createClient()

  if (!orderId) {
    return { error: 'Order ID is required' }
  }

  // 1. Fetch current order to get current items array
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('items')
    .eq('id', orderId)
    .single()

  if (fetchError || !order) {
    console.error('Error fetching order for repair details update:', fetchError)
    return { error: 'Order not found' }
  }

  const items = (order.items as Array<any>) || []
  if (items.length > 0 && items[0]?.type === 'repair') {
    // 2. Update the technicianNotes in the first item
    items[0].technicianNotes = technicianNotes
  } else {
    return { error: 'This order is not a repair request' }
  }

  // 3. Update orders table (total_amount and items jsonb)
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      total_amount: totalAmount,
      items,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)

  if (updateError) {
    console.error('Error updating repair details:', updateError)
    return { error: 'Failed to update repair details' }
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

