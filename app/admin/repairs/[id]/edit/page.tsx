import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { updateRepair } from '@/app/actions/repairs'
import { notFound } from 'next/navigation'
import ImageUpload from '@/components/admin/ImageUpload'

export const metadata = {
  title: 'Edit Repair Service | Icon Multimedia Admin',
}

const DEVICE_TYPES = ['Laptop', 'Desktop PC', 'Printer', 'Gaming Console', 'Other']

export default async function EditRepairPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: repair, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('category', 'repair')
    .single()

  if (error || !repair) {
    notFound()
  }

  const specs = repair.specs || {}
  const deviceType = specs['Device Type'] || ''
  const warranty = specs['Warranty'] || ''
  const repairTime = specs['Repair Time'] || ''
  const tiktokUrl = specs['TikTok URL'] || ''

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/repairs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Repair Services
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Repair Service</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{repair.name}</p>
      </div>

      <form action={updateRepair} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
        <input type="hidden" name="id" value={repair.id} />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Name *</label>
          <input id="name" name="name" type="text" required defaultValue={repair.name} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Slug *</label>
          <input id="slug" name="slug" type="text" required defaultValue={repair.slug} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
          <textarea id="description" name="description" required rows={4} defaultValue={repair.description || ''} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base Price (฿) *</label>
            <input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={repair.price} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Original Price (฿) (Optional)</label>
            <input id="originalPrice" name="originalPrice" type="number" step="0.01" min="0" defaultValue={repair.original_price || ''} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="deviceType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Device Type *</label>
            <select id="deviceType" name="deviceType" required defaultValue={deviceType} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary">
              <option value="">Select type</option>
              {DEVICE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="warranty" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Warranty Period</label>
            <input id="warranty" name="warranty" type="text" defaultValue={warranty} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="repairTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Repair Time</label>
            <input id="repairTime" name="repairTime" type="text" defaultValue={repairTime} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="e.g. 1-2 hours" />
          </div>
        </div>

        <div>
          <label htmlFor="tiktokUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">TikTok Video URL (Optional)</label>
          <input id="tiktokUrl" name="tiktokUrl" type="url" defaultValue={tiktokUrl} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="e.g. https://www.tiktok.com/@username/video/1234567890" />
        </div>

        <ImageUpload defaultValue={repair.image || ''} label="Repair Illustration/Icon Image" />

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="bg-primary hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors cursor-pointer">
            Update Repair Service
          </button>
          <Link href="/admin/repairs" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
