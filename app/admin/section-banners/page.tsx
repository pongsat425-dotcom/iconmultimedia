import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, ImageIcon, Layout, Eye, Play, Sparkles } from 'lucide-react'
import SectionBannerForm from '@/components/admin/SectionBannerForm'
import DeleteBannerButton from '@/components/admin/DeleteBannerButton'

export const metadata = {
  title: 'Manage Section Banners | Icon Multimedia Admin',
}

const SECTIONS = [
  { id: 'new-arrivals', name: 'New Arrivals (สินค้ามาใหม่)' },
  { id: 'best-sellers', name: 'Best Sellers (สินค้าขายดี)' },
  { id: 'laptops', name: 'Laptops (โน๊ตบุ๊ค / MacBook)' },
  { id: 'desktops', name: 'Desktops (คอมพิวเตอร์ตั้งโต๊ะ)' },
  { id: 'components', name: 'CPU (ซีพียู)' },
  { id: 'external-devices', name: 'External Devices (อุปกรณ์ต่อพ่วง)' },
  { id: 'printers', name: 'Printers (เครื่องพิมพ์ / ปริ้นเตอร์)' },
  { id: 'mainboard', name: 'Mainboard (เมนบอร์ด)' },
  { id: 'ram', name: 'RAM (หน่วยความจำ RAM)' },
  { id: 'storage', name: 'Storage (อุปกรณ์เก็บข้อมูล)' },
  { id: 'gpu', name: 'GPU (การ์ดจอ)' },
  { id: 'power-supply', name: 'Power Supply (แหล่งจ่ายไฟ)' },
  { id: 'cooling', name: 'Cooling (ระบบระบายความร้อน)' },
  { id: 'monitor', name: 'Monitor (จอภาพ)' },
  { id: 'keyboard', name: 'Keyboard (คีย์บอร์ด)' },
  { id: 'headset', name: 'Headset (หูฟัง)' },
  { id: 'router', name: 'Router (อุปกรณ์เน็ตเวิร์ก)' },
]

const STYLES = [
  { id: 'Simple', name: 'Simple (ธรรมดา คลาสสิก)' },
  { id: 'Zoom Hover', name: 'Zoom Hover (ซูมขยายและยกลอยเมื่อชี้เมาส์)' },
  { id: 'Neon Glow', name: 'Neon Glow (เรืองแสงสีชมพู/เขียวสไตล์นีออน)' },
  { id: 'Pulse Outline', name: 'Pulse Outline (กรอบกระพริบนำสายตา)' },
  { id: 'Multi-Image Grid', name: '4 รูป (ตาราง 4 ช่อง)' },
  { id: '4 รูป', name: '4 รูป (ตาราง 4 ช่อง)' },
]

export default async function AdminSectionBannersPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; error?: string; success?: string }>
}) {
  const params = await searchParams
  const editId = params.edit
  const error = params.error
  const success = params.success

  const supabase = await createClient()

  // Fetch all saved banners
  const { data: rawBanners = [] } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'section_banner')

  const banners = rawBanners || []

  // If in edit mode, find the banner
  let editBanner = null
  if (editId) {
    editBanner = banners.find((b: any) => b.id === editId) || null
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">จัดการแบนเนอร์แยกตามหมวดหมู่</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            เพิ่มป้ายรูปตกแต่งและเลือกเอฟเฟกต์ (ลูกเล่น) แสดงบนหัวข้อหมวดหมู่ต่างๆ ในหน้าแรก
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-emerald-600 dark:text-emerald-450 text-sm">
          {success === 'saved' && 'บันทึกการตั้งค่าแบนเนอร์เรียบร้อยแล้ว'}
          {success === 'deleted' && 'ลบแบนเนอร์เรียบร้อยแล้ว'}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error === 'missing_section' && 'กรุณาเลือกหัวข้อหมวดหมู่ที่ต้องการ'}
          {error === 'save_failed' && 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองอีกครั้ง'}
          {error === 'delete_failed' && 'ไม่สามารถลบแบนเนอร์ได้ กรุณาลองอีกครั้ง'}
          {error === 'missing_id' && 'ไม่พบข้อมูลแบนเนอร์ที่ต้องการลบ'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-1 space-y-6">
          <SectionBannerForm editBanner={editBanner} />
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">รายการแบนเนอร์หมวดหมู่ที่ตั้งค่า ({banners.length})</h2>

            {banners.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                ยังไม่มีการติดตั้งแบนเนอร์หมวดหมู่ในขณะนี้
              </div>
            ) : (
              <div className="space-y-4">
                {banners.map((ban: any) => {
                  const sectionInfo = SECTIONS.find(s => s.id === ban.name)
                  const styleInfo = STYLES.find(st => st.id === ban.specs?.['Style'])
                  const link = ban.specs?.['Link URL'] || 'ไม่มี'
                  const styleClass = ban.specs?.['Style'] || 'Simple'

                  return (
                    <div
                      key={ban.id}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-955/20"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          {ban.image ? (
                            <img src={ban.image} alt={ban.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {sectionInfo?.name || ban.name}
                            </h3>
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                                ban.in_stock
                                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-450'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              {ban.in_stock ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                          {ban.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400">คำโปรย: {ban.description}</p>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Layout className="h-3.5 w-3.5 text-emerald-500" />
                            <span>ลูกเล่น: <strong>{styleInfo?.name || styleClass}</strong></span>
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-550">ลิ้งค์ปลายทาง: {link}</p>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/50 dark:border-slate-800/50">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/section-banners?edit=${ban.id}`}
                            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          
                          <DeleteBannerButton id={ban.id} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
