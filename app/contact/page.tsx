'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, Globe, Wrench } from 'lucide-react'
import { useAuth } from '@/lib/supabase/auth-context'
import { useToast } from '@/lib/toast/toast-context'
import { submitRepairRequest } from '@/app/actions/repairs'
import Link from 'next/link'

function ContactPageContent() {
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get('subject') || ''
  const router = useRouter()
  const { user } = useAuth()
  const { error: toastError, success: toastSuccess } = useToast()

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [contactType, setContactType] = useState<'general' | 'repair'>('general')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  // Additional fields for repair
  const [phone, setPhone] = useState('')
  const [deviceType, setDeviceType] = useState('Laptop')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [lineId, setLineId] = useState('')

  // Prefill user name/email if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.user_metadata?.full_name || '',
        email: prev.email || user.email || ''
      }))
    }
  }, [user])

  // Prefill the subject if it exists in the query parameters
  useEffect(() => {
    if (subjectParam) {
      setFormData((prev) => ({ ...prev, subject: subjectParam }))
      if (subjectParam.includes('สนใจบริการซ่อม')) {
        setContactType('repair')
      }
    }
  }, [subjectParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    if (contactType === 'repair') {
      if (!user) {
        toastError('กรุณาเข้าสู่ระบบก่อนดำเนินการแจ้งซ่อม')
        setErrorMsg('กรุณาเข้าสู่ระบบก่อนเพื่อดำเนินการแจ้งซ่อมสินค้าและติดตามสถานะงานซ่อมของคุณ')
        setLoading(false)
        return
      }

      const repairData = new FormData()
      repairData.append('name', formData.name)
      repairData.append('email', formData.email)
      repairData.append('subject', formData.subject)
      repairData.append('message', formData.message)
      repairData.append('phone', phone)
      repairData.append('deviceType', deviceType)
      repairData.append('address', address)
      repairData.append('city', city)
      repairData.append('province', province)
      repairData.append('postalCode', postalCode)
      repairData.append('lineId', lineId)

      const res = await submitRepairRequest(repairData)
      if (res?.error) {
        toastError(res.error)
        setErrorMsg(res.error)
        setLoading(false)
      } else {
        toastSuccess('ส่งคำขอแจ้งซ่อมสำเร็จเรียบร้อยแล้ว!')
        setSubmitted(true)
        // Keep name and email prefilled for user convenience
        setFormData(prev => ({ ...prev, subject: '', message: '' }))
        setPhone('')
        setAddress('')
        setCity('')
        setProvince('')
        setPostalCode('')
        setLineId('')
        setLoading(false)
      }
    } else {
      // General Inquiry mockup flow
      setTimeout(() => {
        setLoading(false)
        setSubmitted(true)
        setFormData(prev => ({ ...prev, subject: '', message: '' }))
      }, 1200)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
          <span className="w-2.5 h-10 bg-primary rounded-full"></span>
          ติดต่อเรา
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg">
          มีข้อสงสัยเกี่ยวกับสินค้า สถานะสต็อก หรือต้องการคำแนะนำสำหรับงานซ่อมและการเคลมประกัน? ติดต่อทีมงานของเราได้โดยตรง
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Contact info column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 p-8 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              ร้าน Icon Multimedia
            </h2>

            <div className="flex gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 text-primary rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">โทรหาเรา</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">081 597 1155</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 text-primary rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">LINE ID</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <a href="https://line.me/ti/p/~icon0815971155" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-450 font-bold hover:underline">
                    icon0815971155
                  </a>
                </p>
                <p className="text-xs text-slate-400 mt-1">แอดไลน์คุยสอบถามกับช่างได้โดยตรง</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 text-primary rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Facebook Page</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <a href="https://www.facebook.com/iconnakhon/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-450 font-bold hover:underline">
                    Icon Multimedia
                  </a>
                </p>
                <p className="text-xs text-slate-400 mt-1">แชทคุยผ่านอินบ็อกซ์เพจได้ 24 ชั่วโมง</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 text-primary rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">อีเมลติดต่อ</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">iconmu@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 text-primary rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">ที่อยู่ร้าน</h3>
                <a 
                  href="https://maps.app.goo.gl/HwGJ1R3Y4WVEHqcZA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-500 dark:text-slate-400 text-sm mt-1 hover:text-primary transition-colors"
                >
                  <p>82/50 ถ.บ่ออ่าง ต.คลัง</p>
                  <p>Nakhon Si Thammarat, Thailand, Nakhon Si Thammarat 80000</p>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
          {submitted ? (
            <div className="py-12 text-center max-w-sm mx-auto animate-fade-in">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 className="h-8 w-8" />
                </div>
                {contactType === 'repair' ? (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">ส่งคำขอแจ้งซ่อมเรียบร้อย!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                      ระบบได้บันทึกประวัติการส่งซ่อมอุปกรณ์ของคุณแล้ว คุณสามารถเข้าไปติดตามสถานะการซ่อม ราคาประเมิน และบันทึกของช่างได้ที่หน้าประวัติคำสั่งซื้อ
                    </p>
                    <Link
                      href="/orders"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all cursor-pointer inline-block"
                    >
                      ไปที่ประวัติงานซ่อม / My Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">ส่งข้อความเรียบร้อย!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                      ขอบคุณที่ติดต่อเรา ทีมงานได้รับข้อความของคุณแล้ว และจะตอบกลับไปยังอีเมลของคุณภายใน 24 ชั่วโมง
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-primary hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all cursor-pointer animate-fade-in"
                    >
                      ส่งข้อความอีกครั้ง
                    </button>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">ส่งข้อความหาเรา</h2>
                  {contactType === 'repair' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-450 border border-emerald-200/40">
                      <Wrench className="h-3 w-3" />
                      แจ้งซ่อม
                    </span>
                  )}
                </div>

                {/* Contact Type Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => { setContactType('general'); setErrorMsg(''); }}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      contactType === 'general'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    💬 สอบถามทั่วไป (General)
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactType('repair')}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      contactType === 'repair'
                        ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-450 shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    🔧 แจ้งซ่อม/บริการ (Repair)
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg">
                    {errorMsg}
                  </div>
                )}

                {contactType === 'repair' && !user && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-4 text-amber-800 dark:text-amber-300 text-xs sm:text-sm mb-4 leading-relaxed">
                    กรุณา <Link href="/login?redirect=/contact" className="underline font-bold hover:text-amber-900 dark:hover:text-white text-emerald-600">เข้าสู่ระบบ (Login)</Link> ก่อนส่งเรื่องแจ้งซ่อม เพื่อที่คุณจะสามารถติดตามความคืบหน้า รายการราคาประเมิน และบันทึกของช่างในระบบหลังบ้านได้ครับ
                  </div>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  ช่องที่มีเครื่องหมาย * จำเป็นต้องระบุข้อมูล
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="ระบุชื่อของคุณ"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      อีเมลติดต่อ *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    หัวข้อเรื่อง *
                    {subjectParam && <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded ml-2">Prefilled from service catalog</span>}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="เช่น สอบถามสถานะสต็อกสินค้า หรือการซ่อมปริ้นเตอร์"
                  />
                </div>

                {contactType === 'repair' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 animate-fade-in">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        เบอร์โทรศัพท์ติดต่อ *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required={contactType === 'repair'}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="ระบุเบอร์โทรศัพท์ของคุณ"
                      />
                    </div>
                    <div>
                      <label htmlFor="deviceType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        ประเภทอุปกรณ์ที่แจ้งซ่อม *
                      </label>
                      <select
                        id="deviceType"
                        value={deviceType}
                        onChange={(e) => setDeviceType(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                      >
                        <option value="Laptop">โน๊ตบุ๊ค / MacBook</option>
                        <option value="Desktop PC">คอมพิวเตอร์ตั้งโต๊ะ (PC)</option>
                        <option value="Printer">เครื่องพิมพ์ / ปริ้นเตอร์</option>
                        <option value="Other">อุปกรณ์ไอทีอื่น ๆ</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        ที่อยู่ในการจัดส่ง/รับเครื่องซ่อม *
                      </label>
                      <textarea
                        id="address"
                        required={contactType === 'repair'}
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="ระบุบ้านเลขที่ ซอย ถนน ตำบล..."
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        อำเภอ/เขต *
                      </label>
                      <input
                        id="city"
                        type="text"
                        required={contactType === 'repair'}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="เช่น เมืองนครศรีธรรมราช"
                      />
                    </div>
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        จังหวัด *
                      </label>
                      <input
                        id="province"
                        type="text"
                        required={contactType === 'repair'}
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="เช่น นครศรีธรรมราช"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        รหัสไปรษณีย์ *
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        required={contactType === 'repair'}
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-955 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="เช่น 80000"
                      />
                    </div>
                    <div>
                      <label htmlFor="lineId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        ไลน์ไอดี / LINE ID (ถ้ามี)
                      </label>
                      <input
                        id="lineId"
                        type="text"
                        value={lineId}
                        onChange={(e) => setLineId(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        placeholder="เช่น line_id_123"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {contactType === 'repair' ? 'รายละเอียดอาการชำรุดเพิ่มเติม *' : 'รายละเอียดข้อความ *'}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder={contactType === 'repair' ? 'เช่น เครื่องเปิดติดแต่หน้าจอไม่แสดงผลกระพริบไฟสีแดง หรืออาการเสียอื่นๆ...' : 'กรอกรายละเอียดคำถามหรือข้อความ...'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm ${
                    contactType === 'repair'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      : 'bg-primary hover:bg-primary-700 shadow-primary/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> กำลังส่งข้อมูล...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> {contactType === 'repair' ? 'ส่งคำขอแจ้งซ่อม' : 'ส่งข้อความ'}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      {/* Google Maps Embed Section */}
      <div className="mt-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-3xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            แผนที่ร้าน (Shop Location)
          </h2>
          <a
            href="https://maps.app.goo.gl/HwGJ1R3Y4WVEHqcZA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-md shadow-primary/20 text-xs sm:text-sm cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            <span>ดูเส้นทางนำทาง (Get Directions)</span>
          </a>
        </div>
        <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
          <iframe
            src="https://maps.google.com/maps?q=8.4387248,99.9699179&hl=th&z=17&output=embed"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}


function Loader2({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        role="presentation"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center text-slate-500 animate-pulse">กำลังโหลดข้อมูล...</div>}>
      <ContactPageContent />
    </Suspense>
  )
}
