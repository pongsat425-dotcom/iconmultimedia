'use client'

import { updateUserRole } from '@/app/actions/users'
import { useState } from 'react'

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  user: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
}

export default function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string
  currentRole: string
}) {
  const [role, setRole] = useState(currentRole)
  const [loading, setLoading] = useState(false)

  const handleChange = async (newRole: string) => {
    setLoading(true)
    setRole(newRole)

    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('role', newRole)

    const result = await updateUserRole(formData)

    if (result?.error) {
      setRole(currentRole) // revert on error
    }

    setLoading(false)
  }

  return (
    <select
      value={role}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-1 focus:ring-primary ${ROLE_COLORS[role] || ROLE_COLORS.user} ${loading ? 'opacity-50' : ''}`}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  )
}
