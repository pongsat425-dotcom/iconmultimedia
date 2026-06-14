'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { saveSectionBanner } from '@/app/actions/section_banners'
import ImageUpload from './ImageUpload'

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
]

interface SectionBannerFormProps {
  editBanner: any
}

export default function SectionBannerForm({ editBanner }: SectionBannerFormProps) {
  const [selectedStyle, setSelectedStyle] = useState('Simple')

  // Sync state with editBanner's loaded style on load or change
  useEffect(() => {
    if (editBanner?.specs?.['Style']) {
      setSelectedStyle(editBanner.specs['Style'])
    } else {
      setSelectedStyle('Simple')
    }
  }, [editBanner])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-500" />
        {editBanner ? 'แก้ไขแบนเนอร์' : 'เพิ่ม/ตั้งค่าแบนเนอร์'}
      </h2>

      <form key={editBanner ? editBanner.id : 'new'} action={saveSectionBanner} className="space-y-4">
        <div>
          <label htmlFor="sectionId" className="block text-xs font-semibold text-slate-700 dark:text-slate-355 mb-1">
            เลือกหมวดหมู่หน้าแรก *
          </label>
          {editBanner ? (
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-lg text-slate-800 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-slate-700">
              <input type="hidden" name="sectionId" value={editBanner.name} />
              {SECTIONS.find(s => s.id === editBanner.name)?.name || editBanner.name}
            </div>
          ) : (
            <select
              id="sectionId"
              name="sectionId"
              required
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="">-- เลือกหัวข้อที่ต้องการติดป้าย --</option>
              {SECTIONS.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-slate-700 dark:text-slate-355 mb-1">
            คำอธิบายเพิ่มเติมหรือหัวข้อในป้าย (ไม่บังคับ)
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={editBanner?.description || ''}
            placeholder="เช่น โปรโมชั่นต้อนรับเปิดเทอม!"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div>
          <label htmlFor="style" className="block text-xs font-semibold text-slate-700 dark:text-slate-355 mb-1">
            รูปแบบเอฟเฟกต์ (ลูกเล่นแบนเนอร์) *
          </label>
          <select
            id="style"
            name="style"
            required
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          >
            {STYLES.map(sty => (
              <option key={sty.id} value={sty.id}>{sty.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="linkUrl" className="block text-xs font-semibold text-slate-700 dark:text-slate-355 mb-1">
            ลิ้งค์ปลายทางเมื่อคลิกป้าย (ไม่บังคับ)
          </label>
          <input
            id="linkUrl"
            name="linkUrl"
            type="text"
            defaultValue={editBanner?.specs?.['Link URL'] || ''}
            placeholder="เช่น /category/laptops หรือเว็บภายนอก..."
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div>
          <label htmlFor="isActive" className="block text-xs font-semibold text-slate-700 dark:text-slate-355 mb-1">
            สถานะการเปิดใช้งาน *
          </label>
          <select
            id="isActive"
            name="isActive"
            required
            defaultValue={editBanner ? (editBanner.in_stock ? 'true' : 'false') : 'true'}
            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          >
            <option value="true">เปิดใช้งาน (Active)</option>
            <option value="false">ปิดใช้งานชั่วคราว (Disabled)</option>
          </select>
        </div>

        <ImageUpload defaultValue={editBanner?.image || ''} label="รูปภาพแบนเนอร์ที่ 1 (หลัก) *" />

        {/* Show additional image slots ONLY when Multi-Image Grid is selected */}
        {(selectedStyle === 'Multi-Image Grid' || selectedStyle === '4 รูป') && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4 animate-fade-in">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">ตั้งค่ารูปภาพเพิ่มเติม (รูปที่ 2-4 สำหรับกริดหลายรูป)</h3>
            
            <div className="space-y-4">
              {/* Image 2 & Link 2 */}
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <ImageUpload defaultValue={editBanner?.specs?.['Image 2'] || ''} name="image2" label="รูปภาพที่ 2 (Image 2)" />
                <div>
                  <label htmlFor="linkUrl2" className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    ลิ้งค์ปลายทางรูปที่ 2
                  </label>
                  <input
                    id="linkUrl2"
                    name="linkUrl2"
                    type="text"
                    defaultValue={editBanner?.specs?.['Link URL 2'] || ''}
                    placeholder="เช่น /category/desktops"
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Image 3 & Link 3 */}
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <ImageUpload defaultValue={editBanner?.specs?.['Image 3'] || ''} name="image3" label="รูปภาพที่ 3 (Image 3)" />
                <div>
                  <label htmlFor="linkUrl3" className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    ลิ้งค์ปลายทางรูปที่ 3
                  </label>
                  <input
                    id="linkUrl3"
                    name="linkUrl3"
                    type="text"
                    defaultValue={editBanner?.specs?.['Link URL 3'] || ''}
                    placeholder="เช่น /category/components"
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Image 4 & Link 4 */}
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <ImageUpload defaultValue={editBanner?.specs?.['Image 4'] || ''} name="image4" label="รูปภาพที่ 4 (Image 4)" />
                <div>
                  <label htmlFor="linkUrl4" className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    ลิ้งค์ปลายทางรูปที่ 4
                  </label>
                  <input
                    id="linkUrl4"
                    name="linkUrl4"
                    type="text"
                    defaultValue={editBanner?.specs?.['Link URL 4'] || ''}
                    placeholder="เช่น /category/keyboard"
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer text-center"
          >
            {editBanner ? 'บันทึกการแก้ไข' : 'บันทึกแบนเนอร์'}
          </button>
          {editBanner && (
            <Link
              href="/admin/section-banners"
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors"
            >
              ยกเลิก
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}
