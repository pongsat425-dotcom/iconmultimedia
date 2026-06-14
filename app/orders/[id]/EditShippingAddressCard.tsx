'use client'

import { useState } from 'react'
import { MapPin, Phone, User, Edit, Loader2, Save, X, Mail, MessageSquare } from 'lucide-react'
import { updateOrderShippingAddress } from '@/app/actions/checkout'
import { useToast } from '@/lib/toast/toast-context'

interface ShippingAddress {
  fullName: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
  email?: string
  lineId?: string
}

interface EditShippingAddressCardProps {
  orderId: string
  shippingAddress: ShippingAddress
  isEditable: boolean
}

export default function EditShippingAddressCard({
  orderId,
  shippingAddress,
  isEditable,
}: EditShippingAddressCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ShippingAddress>({
    email: '',
    lineId: '',
    ...shippingAddress
  })
  const [validationError, setValidationError] = useState('')

  const { success, error: toastError } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setValidationError('') // Clear error on edit
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // Basic Validations
    if (!form.fullName.trim() || !form.address.trim() || !form.city.trim() || !form.province.trim() || !form.postalCode.trim() || !form.phone.trim()) {
      setValidationError('กรุณากรอกข้อมูลให้ครบทุกช่อง')
      return
    }

    // Name Validation
    if (form.fullName.trim().length < 4 || !form.fullName.trim().includes(' ')) {
      setValidationError('กรุณากรอกชื่อและนามสกุลจริง โดยมีเว้นวรรคคั่นกลาง')
      return
    }

    // Address length check
    if (form.address.trim().length < 10) {
      setValidationError('กรุณากรอกที่อยู่จัดส่งให้ละเอียดครบถ้วน (อย่างน้อย 10 ตัวอักษร)')
      return
    }

    // Thai Phone Validation (10 digits starting with 06, 08, 09)
    const cleanPhone = form.phone.replace(/[-\s]/g, '')
    const thaiPhoneRegex = /^0[689]\d{8}$/
    if (!thaiPhoneRegex.test(cleanPhone)) {
      setValidationError('กรุณากรอกเบอร์โทรศัพท์มือถือที่ถูกต้อง (10 หลัก ขึ้นต้นด้วย 06, 08, 09)')
      return
    }

    // Email Validation (optional)
    if (form.email && form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email.trim())) {
        setValidationError('กรุณากรอกอีเมลที่ถูกต้อง')
        return
      }
    }

    setLoading(true)

    const result = await updateOrderShippingAddress(orderId, {
      ...form,
      phone: cleanPhone // Save sanitized phone number
    })

    if (result?.error) {
      toastError(result.error)
      setValidationError(result.error)
    } else {
      success('แก้ไขที่อยู่จัดส่งเรียบร้อยแล้ว')
      setIsEditing(false)
    }

    setLoading(false)
  }

  const handleCancel = () => {
    setForm({
      email: '',
      lineId: '',
      ...shippingAddress
    })
    setValidationError('')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-md">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <MapPin className="h-5 w-5 text-primary" />
          แก้ไขที่อยู่จัดส่ง / Edit Shipping Address
        </h2>

        {validationError && (
          <div className="p-3 text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg mb-4">
            ⚠️ {validationError}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ชื่อ-นามสกุลผู้รับ *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={form.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="ชื่อ และ นามสกุลจริง"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ที่อยู่จัดส่ง (บ้านเลขที่/ซอย/ถนน) *
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={2}
              value={form.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="บ้านเลขที่ หมู่บ้าน ซอย ถนน..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                เขต/อำเภอ *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={form.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="เช่น เขตปทุมวัน / อำเภอเมือง"
              />
            </div>

            <div>
              <label htmlFor="province" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                จังหวัด *
              </label>
              <input
                id="province"
                name="province"
                type="text"
                required
                value={form.province}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="เช่น กรุงเทพมหานคร"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="postalCode" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                รหัสไปรษณีย์ *
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                required
                value={form.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="เช่น 10110"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                เบอร์โทรศัพท์มือถือ *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="เช่น 0812345678"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                อีเมล (Email)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="เช่น name@example.com"
              />
            </div>

            <div>
              <label htmlFor="lineId" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                LINE ID
              </label>
              <input
                id="lineId"
                name="lineId"
                type="text"
                value={form.lineId || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="เช่น line_username"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex justify-center items-center gap-1.5 bg-primary hover:bg-primary-700 text-white font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> กำลังบันทึก...</>
              ) : (
                <><Save className="h-3.5 w-3.5" /> บันทึกข้อมูล</>
              )}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleCancel}
              className="inline-flex justify-center items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-70"
            >
              <X className="h-3.5 w-3.5" /> ยกเลิก
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          ที่อยู่จัดส่ง / Shipping Address
        </h2>

        {isEditable && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary font-semibold text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-sm"
          >
            <Edit className="h-3.5 w-3.5" />
            แก้ไขที่อยู่ / Edit
          </button>
        )}
      </div>

      <div className="space-y-2.5 text-sm text-slate-650 dark:text-slate-300">
        <div className="flex items-center gap-2.5">
          <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white">{shippingAddress.fullName}</span>
        </div>
        
        <p className="pl-6.5 leading-relaxed">{shippingAddress.address}</p>
        <p className="pl-6.5 leading-relaxed">
          {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
        </p>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-850 mt-2 space-y-2">
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {shippingAddress.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
            </span>
          </div>

          {shippingAddress.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {shippingAddress.email}
              </span>
            </div>
          )}

          {shippingAddress.lineId && (
            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                LINE: {shippingAddress.lineId}
              </span>
            </div>
          )}
        </div>
      </div>

      {isEditable && (
        <div className="mt-4 p-2.5 bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/35 rounded-lg">
          <p className="text-[11px] text-amber-700 dark:text-amber-450 leading-relaxed">
            * คุณกรอกที่อยู่ผิดหรือไม่? ในขณะที่สถานะยังเป็น <strong>Pending</strong> คุณสามารถกดปุ่ม <strong>แก้ไขที่อยู่ / Edit</strong> ด้านบนเพื่อแก้ไขข้อมูลให้ถูกต้องได้ครับ
          </p>
        </div>
      )}
    </div>
  )
}
