'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { useToast } from '@/lib/toast/toast-context'
import { Loader2, Save } from 'lucide-react'

interface ProfileFormProps {
  currentName: string
  email: string
}

export default function ProfileForm({ currentName, email }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const { success, error: toastError } = useToast()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await updateProfile(formData)

    if (result?.error) {
      toastError(result.error)
    } else {
      success('Profile updated successfully!')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Edit Profile</h2>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            defaultValue={currentName}
            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-500 text-sm cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
