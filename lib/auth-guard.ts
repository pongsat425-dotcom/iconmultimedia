import 'server-only'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

/**
 * Verifies that the current user is authenticated.
 * Returns the user object if authenticated, otherwise returns an error.
 */
export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ (Authentication required)' }
  }

  return { user, error: null }
}

/**
 * Verifies that the current user is authenticated AND has admin role.
 * Uses service_role key to bypass RLS for role lookup (server-only, never exposed to client).
 * Returns the user object if admin, otherwise returns an error.
 */
export async function requireAdmin() {
  const { user, error: authError } = await requireAuth()

  if (authError || !user) {
    return { user: null, error: authError || 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }
  }

  // Use service_role to bypass RLS for role check
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: userData, error: roleError } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (roleError || !userData) {
    console.error('requireAdmin: Error fetching user role:', roleError)
    return { user: null, error: 'ไม่สามารถตรวจสอบสิทธิ์ผู้ดูแลระบบได้' }
  }

  if (userData.role !== 'admin') {
    return { user: null, error: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้ (Admin only)' }
  }

  return { user, error: null }
}
