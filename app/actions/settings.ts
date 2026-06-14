'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateHomepageSettings(settings: {
  show_new_arrivals: boolean
  show_best_sellers: boolean
  visible_categories: string[]
}) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }
  }

  // 2. Authorize as admin
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'admin') {
    return { error: 'คุณไม่มีสิทธิ์ในการจัดการการตั้งค่านี้' }
  }

  // 3. Upsert settings in database
  const { error: upsertError } = await supabase
    .from('site_settings')
    .upsert({
      key: 'homepage_sections',
      value: settings,
      updated_at: new Date().toISOString()
    })

  if (upsertError) {
    console.error('Error updating homepage settings:', upsertError)
    return { error: 'ไม่สามารถบันทึกการตั้งค่าได้ กรุณารัน SQL Script บนระบบ Supabase หรือลองใหม่อีกครั้ง' }
  }

  // 4. Revalidate homepage
  revalidatePath('/')
  return { success: true }
}

export async function getLogoSettings(): Promise<{
  width: number
  height: number
}> {
  const supabase = await createClient()
  const defaultSettings = { width: 160, height: 40 }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'logo_settings')
      .single()

    if (error || !data) {
      return defaultSettings
    }

    const value = data.value as any
    return {
      width: Number(value?.width ?? defaultSettings.width),
      height: Number(value?.height ?? defaultSettings.height)
    }
  } catch (err) {
    return defaultSettings
  }
}

export async function updateLogoSettings(settings: {
  width: number
  height: number
}) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }
  }

  // 2. Authorize as admin
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'admin') {
    return { error: 'คุณไม่มีสิทธิ์ในการจัดการการตั้งค่านี้' }
  }

  // 3. Upsert settings in database
  const { error: upsertError } = await supabase
    .from('site_settings')
    .upsert({
      key: 'logo_settings',
      value: settings,
      updated_at: new Date().toISOString()
    })

  if (upsertError) {
    console.error('Error updating logo settings:', upsertError)
    return { error: 'ไม่สามารถบันทึกการตั้งค่าได้ กรุณาลองใหม่อีกครั้ง' }
  }

  // 4. Revalidate layout so logo size updates everywhere
  revalidatePath('/', 'layout')
  return { success: true }
}

