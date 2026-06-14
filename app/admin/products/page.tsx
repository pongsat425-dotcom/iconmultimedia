import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Package, Edit, Trash2 } from 'lucide-react'
import { deleteProduct } from '@/app/actions/products'

export const metadata = {
  title: 'Manage Products | Icon Multimedia Admin',
}

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .neq('category', 'repair')
    .neq('category', 'homepage_tiktok')
    .neq('category', 'section_banner')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your product catalog ({products?.length || 0} products)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {error ? (
        <div className="p-4 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg">
          Error loading products: {error.message}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No products yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Get started by adding your first product.</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Stock</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: Record<string, unknown>) => (
                  <tr key={product.id as string} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white truncate max-w-[250px]">
                          {product.name as string}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 capitalize">
                      {product.category as string}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-white">
                      ฿{Number(product.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                      {product.stock as number}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.in_stock
                          ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-red-100 dark:bg-red-500/10 text-red-500'
                      }`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id as string} />
                          <button
                            type="submit"
                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
