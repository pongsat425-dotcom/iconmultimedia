'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const ICONS = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 text-rose-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type }]
      // Max 5 toasts
      if (newToasts.length > 5) return newToasts.slice(newToasts.length - 5)
      return newToasts
    })

    // Auto dismiss
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }, [removeToast])

  const contextValue = {
    toast: addToast,
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
    warning: (msg: string) => addToast(msg, 'warning'),
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className="pointer-events-auto flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg p-4 min-w-[300px] max-w-md animate-in slide-in-from-right-8 fade-in duration-300"
          >
            <div className="shrink-0">{ICONS[toast.type]}</div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    // Return a safe fallback to prevent runtime crashes (e.g. under duplicate Turbopack contexts or pre-rendering)
    return {
      toast: (message: string) => console.log('[Toast Info]:', message),
      success: (message: string) => console.log('[Toast Success]:', message),
      error: (message: string) => console.error('[Toast Error]:', message),
      info: (message: string) => console.log('[Toast Info]:', message),
      warning: (message: string) => console.warn('[Toast Warning]:', message),
    }
  }
  return context
}
