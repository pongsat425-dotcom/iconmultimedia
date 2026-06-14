import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createProduct } from '@/app/actions/products'
import { CATEGORY_LIST } from '@/lib/mock-data'
import ImageUpload from '@/components/admin/ImageUpload'
import MultiImageUpload from '@/components/admin/MultiImageUpload'

export const metadata = {
  title: 'Add New Product | Icon Multimedia Admin',
}

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Add New Product</h1>
      </div>

      <form action={createProduct} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name *</label>
          <input id="name" name="name" type="text" required className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="e.g. MacBook Pro 16-inch" />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slug *</label>
          <input id="slug" name="slug" type="text" required className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="e.g. macbook-pro-16" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
          <textarea id="description" name="description" required rows={4} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Product description..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (฿) *</label>
            <input id="price" name="price" type="number" step="0.01" min="0" required className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="0.00" />
          </div>
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Original Price (฿)</label>
            <input id="originalPrice" name="originalPrice" type="number" step="0.01" min="0" className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Leave blank if no discount" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
            <select id="category" name="category" required className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary">
              <option value="">Select category</option>
              {CATEGORY_LIST.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Quantity</label>
            <input id="stock" name="stock" type="number" min="0" defaultValue="0" className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rating (คะแนน 0-5)</label>
            <input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue="0" className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="0.0 - 5.0" />
          </div>
          <div>
            <label htmlFor="reviews" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reviews Count (จำนวนคนรีวิว)</label>
            <input id="reviews" name="reviews" type="number" min="0" defaultValue="0" className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        <ImageUpload />
        <MultiImageUpload />


        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="bg-primary hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
            Create Product
          </button>
          <Link href="/admin/products" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
