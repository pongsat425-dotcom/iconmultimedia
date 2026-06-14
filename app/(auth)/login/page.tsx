'use client'

import { useState, Suspense, useEffect } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/lib/toast/toast-context'
import { Loader2 } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'
  const registered = searchParams.get('registered')
  const { error: toastError, success } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Show success toast only once on mount when ?registered=true is present
  // Putting this in render body causes it to fire on every re-render
  useEffect(() => {
    if (registered) {
      success('ลงทะเบียนสำเร็จแล้ว! กรุณาเข้าสู่ระบบเพื่อใช้งาน')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setErrorMsg('')
    
    const result = await login(formData)
    
    if (result?.error) {
      setErrorMsg(result.error)
      toastError(result.error)
      setLoading(false)
    } else if (result?.success) {
      // Force page reload redirect so AuthProvider context picks up the session cookie
      window.location.href = redirectUrl
    }
  }

  return (
    <>
      <form className="mt-8 space-y-6" action={handleSubmit}>
        {errorMsg && (
          <div className="p-3 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg">
            {errorMsg}
          </div>
        )}
        
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              อีเมล (Email Address)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              รหัสผ่าน (Password)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="relative block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
        </div>
      </form>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            เข้าสู่ระบบบัญชีของคุณ
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            หรือ{' '}
            <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400">
              สร้างบัญชีผู้ใช้งานใหม่
            </Link>
          </p>
        </div>
        
        <Suspense fallback={<div className="flex justify-center mt-8"><Loader2 className="animate-spin h-8 w-8 text-emerald-500" /></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
