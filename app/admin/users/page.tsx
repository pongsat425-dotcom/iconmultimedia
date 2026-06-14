import { getUsersList } from '@/lib/supabase/queries'
import { Users, Mail, Calendar, Shield } from 'lucide-react'
import RoleSelect from './RoleSelect'

export const metadata = {
  title: 'Manage Customers | Icon Multimedia Admin',
}

export default async function AdminUsersPage() {
  const users = await getUsersList()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Customers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage customer accounts and roles ({users.length} users)
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Users className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No customers yet</h3>
          <p className="text-slate-500 dark:text-slate-400">When customers register, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Email</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: Record<string, unknown>) => {
                  const createdAt = user.created_at
                    ? new Date(user.created_at as string).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''

                  return (
                    <tr
                      key={user.id as string}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold">
                              {((user.full_name as string) || (user.email as string) || '?').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                            {(user.full_name as string) || 'Unnamed User'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{user.email as string}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <RoleSelect userId={user.id as string} currentRole={(user.role as string) || 'user'} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                          {createdAt}
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
