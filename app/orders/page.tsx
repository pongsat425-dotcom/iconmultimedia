import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OrdersClient from './OrdersClient'

export const metadata = {
  title: 'ประวัติการสั่งซื้อและแจ้งซ่อม | Icon Multimedia',
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/orders')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <span className="w-2.5 h-10 bg-primary rounded-full"></span>
        ประวัติรายการคำสั่งซื้อและการแจ้งซ่อม
      </h1>

      <OrdersClient initialOrders={orders ?? []} />
    </div>
  )
}
