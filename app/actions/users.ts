'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export async function updateUserRole(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const supabase = await createClient()

  const userId = formData.get('userId') as string
  const role = formData.get('role') as string

  if (!userId || !role) {
    return { error: 'User ID and role are required' }
  }

  const validRoles = ['user', 'admin']
  if (!validRoles.includes(role)) {
    return { error: 'Invalid role' }
  }

  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)

  if (error) {
    console.error('Update user role error:', error)
    return { error: 'Failed to update user role' }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
