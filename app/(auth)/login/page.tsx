'use client'

import { useState, Suspense, useEffect } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/lib/toast/toast-context'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'
  const registered = searchParams.get('registered')
  const errorParam = searchParams.get('error')
  const { error: toastError, success } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Show toast on mount when ?registered=true or ?error=auth_failed is present
  useEffect(() => {
    if (registered) {
      success('ลงทะเบียนสำเร็จแล้ว! กรุณาเข้าสู่ระบบเพื่อใช้งาน')
    }
    if (errorParam === 'auth_failed') {
      toastError('เข้าสู่ระบบด้วย Google ล้มเหลว กรุณาลองใหม่อีกครั้ง')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registered, errorParam])

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

  async function handleGoogleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
      },
    })
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
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                รหัสผ่าน (Password)
              </label>
              <Link href="/forgot-password" className="text-xs font-medium text-emerald-605 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer">
                ลืมรหัสผ่าน?
              </Link>
            </div>
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

        <div className="space-y-4">
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

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs">หรือ</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center gap-2 rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6-4.53z"
                />
              </svg>
              <span>เข้าสู่ระบบด้วย Google</span>
            </button>
          </div>
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
