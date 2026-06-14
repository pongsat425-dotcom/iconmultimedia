'use client'

import { useState } from 'react'
import { updatePassword } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast/toast-context'
import { Loader2 } from 'lucide-react'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const { error: toastError, success } = useToast()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setErrorMsg('')
    
    const result = await updatePassword(formData)
    
    if (result?.error) {
      setErrorMsg(result.error)
      toastError(result.error)
      setLoading(false)
    } else {
      success('เปลี่ยนรหัสผ่านของคุณเรียบร้อยแล้ว! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            กำหนดรหัสผ่านใหม่
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            กรอกรหัสผ่านใหม่ที่คุณต้องการใช้งานสำหรับบัญชีนี้
          </p>
        </div>
        
        <form className="mt-8 space-y-6" action={handleSubmit}>
          {errorMsg && (
            <div className="p-3 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg">
              {errorMsg}
            </div>
          )}
          
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                รหัสผ่านใหม่ (New Password)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="relative block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'บันทึกรหัสผ่านใหม่'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
