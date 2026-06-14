import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, Mail, Calendar, Shield } from 'lucide-react'
import ProfileForm from './ProfileForm'

export const metadata = {
  title: 'My Profile | Icon Multimedia',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/profile')
  }

  // Get user role from users table
  const { data: userData } = await supabase
    .from('users')
    .select('role, created_at')
    .eq('id', user.id)
    .single()

  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown'

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <User className="h-8 w-8 text-primary" />
        My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center">
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {user.user_metadata?.full_name || 'User'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>

            <div className="space-y-3 text-left border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300 truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300 capitalize">{userData?.role || 'user'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">Joined {createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <ProfileForm
            currentName={user.user_metadata?.full_name || ''}
            email={user.email || ''}
          />
        </div>
      </div>
    </div>
  )
}
