'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const fullName = formData.get('fullName') as string

  if (!fullName || fullName.trim().length === 0) {
    return { error: 'Full name is required' }
  }

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName.trim() },
  })

  if (error) {
    return { error: error.message }
  }

  // Also update the users table
  await supabase
    .from('users')
    .update({ full_name: fullName.trim() })
    .eq('id', user.id)

  revalidatePath('/profile')
  return { success: true }
}
