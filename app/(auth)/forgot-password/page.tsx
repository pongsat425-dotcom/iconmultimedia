'use client'

import { useState } from 'react'
import { resetPassword } from '@/app/actions/auth'
import Link from 'next/link'
import { useToast } from '@/lib/toast/toast-context'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { error: toastError, success } = useToast()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setErrorMsg('')
    
    // We get origin dynamically
    const origin = window.location.origin
    const result = await resetPassword(formData, origin)
    
    if (result?.error) {
      setErrorMsg(result.error)
      toastError(result.error)
      setLoading(false)
    } else {
      setSubmitted(true)
      success('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว!')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            รีเซ็ตรหัสผ่านของคุณ
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่
          </p>
        </div>
        
        {submitted ? (
          <div className="text-center space-y-6">
            <div className="p-4 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
              ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านเรียบร้อยแล้ว กรุณาตรวจสอบในกล่องข้อความของอีเมลคุณ (รวมถึงในกล่อง Junk/Spam)
            </div>
            <Link href="/login" className="inline-block font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer">
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" action={handleSubmit}>
            {errorMsg && (
              <div className="p-3 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg">
                {errorMsg}
              </div>
            )}
            
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  อีเมลของคุณ (Email Address)
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
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'ส่งลิงก์รีเซ็ตรหัสผ่าน'
                )}
              </button>
              
              <div className="text-center text-sm">
                <Link href="/login" className="font-medium text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-350 cursor-pointer">
                  ย้อนกลับ
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
