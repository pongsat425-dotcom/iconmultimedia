import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Wrench, Edit, Trash2 } from 'lucide-react'
import { deleteRepair } from '@/app/actions/repairs'

export const metadata = {
  title: 'Manage Repair Services | Icon Multimedia Admin',
}

export default async function AdminRepairsPage() {
  const supabase = await createClient()

  const { data: repairs, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'repair')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Repair Services</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your repair service listings ({repairs?.length || 0} services)
          </p>
        </div>
        <Link
          href="/admin/repairs/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Repair Service
        </Link>
      </div>

      {error ? (
        <div className="p-4 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg">
          Error loading repair services: {error.message}
        </div>
      ) : !repairs || repairs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Wrench className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No repair services yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Get started by adding your first repair service.</p>
          <Link
            href="/admin/repairs/new"
            className="inline-flex items-center gap-2 bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Repair Service
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Service Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Device Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Warranty</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Repair Time</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Base Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((repair: Record<string, any>) => {
                  const specs = repair.specs || {}
                  const deviceType = specs['Device Type'] || 'N/A'
                  const warranty = specs['Warranty'] || 'N/A'
                  const repairTime = specs['Repair Time'] || 'N/A'

                  return (
                    <tr key={repair.id as string} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            {repair.image ? (
                              <img src={repair.image} alt={repair.name} className="w-8 h-8 object-contain rounded" />
                            ) : (
                              <Wrench className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white truncate max-w-[250px]">
                            {repair.name as string}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {deviceType}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {warranty}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {repairTime}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-white">
                        ฿{Number(repair.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/repairs/${repair.id}/edit`}
                            className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <form action={deleteRepair}>
                            <input type="hidden" name="id" value={repair.id as string} />
                            <button
                              type="submit"
                              className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
