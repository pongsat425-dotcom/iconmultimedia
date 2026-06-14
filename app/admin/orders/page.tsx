import { createClient } from '@/utils/supabase/server'
import OrdersManagerClient from './OrdersManagerClient'

export const metadata = {
  title: 'Manage Orders | Icon Multimedia Admin',
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-4 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg">
        Error loading orders: {error.message}
      </div>
    )
  }

  return <OrdersManagerClient initialOrders={orders ?? []} />
}
