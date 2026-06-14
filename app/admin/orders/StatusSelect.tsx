'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/app/actions/orders'
import { useToast } from '@/lib/toast/toast-context'
import { Loader2 } from 'lucide-react'

interface StatusSelectProps {
  orderId: string
  currentStatus: string
}

export default function StatusSelect({ orderId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const { success, error: toastError } = useToast()

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    setLoading(true)

    const formData = new FormData()
    formData.append('orderId', orderId)
    formData.append('status', newStatus)

    const result = await updateOrderStatus(formData)

    if (result?.error) {
      toastError(result.error)
      setStatus(currentStatus) // revert
    } else {
      success(`Order status updated to ${newStatus}`)
    }

    setLoading(false)
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    }
  }

  return (
    <div className="relative flex items-center">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={loading}
        className={`appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-medium cursor-pointer border-0 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary ${getStatusColor(status)} ${loading ? 'opacity-50' : ''}`}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {loading && <Loader2 className="absolute right-2 h-3 w-3 animate-spin text-slate-500" />}
    </div>
  )
}
