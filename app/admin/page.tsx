import { Package, Users, ShoppingCart, DollarSign, AlertTriangle, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getRecentOrders, getLowStockProducts } from "@/lib/supabase/queries";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | Icon Multimedia",
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  processing: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  completed: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  cancelled: 'bg-red-100 dark:bg-red-500/10 text-red-500',
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats, recent orders & low stock in parallel to maximize concurrency
  const [
    productCountResult,
    orderCountResult,
    userCountResult,
    completedOrdersResult,
    recentOrders,
    lowStockProducts
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .neq('category', 'repair')
      .neq('category', 'homepage_tiktok')
      .neq('category', 'section_banner'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').eq('status', 'completed'),
    getRecentOrders(5),
    getLowStockProducts(10),
  ]);

  const productCount = productCountResult.count;
  const orderCount = orderCountResult.count;
  const userCount = userCountResult.count;
  const completedOrders = completedOrdersResult.data;

  const totalRevenue = completedOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

  const stats = [
    {
      name: "Total Revenue",
      value: `฿${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      change: `${orderCount || 0} orders`,
      changeType: "positive",
    },
    {
      name: "Total Orders",
      value: orderCount || 0,
      icon: <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      change: `${recentOrders.filter((o: Record<string, unknown>) => o.status === 'pending').length} pending`,
      changeType: "neutral",
    },
    {
      name: "Total Products",
      value: productCount || 0,
      icon: <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      change: `${lowStockProducts.length} low stock`,
      changeType: lowStockProducts.length > 0 ? "negative" : "positive",
    },
    {
      name: "Total Customers",
      value: userCount || 0,
      icon: <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
      change: "Registered",
      changeType: "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome to the Icon Multimedia admin control panel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                {stat.icon}
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.name}
                  </dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center text-sm">
                <span className={`font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 
                  stat.changeType === 'negative' ? 'text-rose-600 dark:text-rose-400' : 
                  'text-slate-500 dark:text-slate-400'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left py-2 px-6 font-medium text-slate-500 dark:text-slate-400">Order</th>
                    <th className="text-left py-2 px-4 font-medium text-slate-500 dark:text-slate-400">Customer</th>
                    <th className="text-right py-2 px-4 font-medium text-slate-500 dark:text-slate-400">Total</th>
                    <th className="text-center py-2 px-6 font-medium text-slate-500 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: Record<string, unknown>) => {
                    const status = (order.status as string) || 'pending'
                    const shipping = order.shipping_address as Record<string, string> | null
                    return (
                      <tr key={order.id as string} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                        <td className="py-2.5 px-6 font-medium text-slate-900 dark:text-white">
                          #{String(order.id).slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                          {shipping?.fullName || 'Unknown'}
                        </td>
                        <td className="py-2.5 px-4 text-right font-medium text-slate-900 dark:text-white">
                          ฿{Number(order.total_amount).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-6 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || STATUS_COLORS.pending}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              No orders yet.
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alerts
            </h2>
            <Link href="/admin/products" className="text-sm text-primary hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>
          {lowStockProducts.length > 0 ? (
            <div className="px-6 pb-6 space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{product.category}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    product.stock <= 3
                      ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                      : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              ✓ All products are sufficiently stocked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
