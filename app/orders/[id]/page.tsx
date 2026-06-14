import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, MapPin, Phone, User, MessageSquare, Wrench } from 'lucide-react'
import EditShippingAddressCard from './EditShippingAddressCard'

export const metadata = {
  title: 'Order Details | iCON Multimedia',
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string; bg: string }> = {
  pending: {
    icon: <Clock className="h-5 w-5" />,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    label: 'Pending',
  },
  processing: {
    icon: <Package className="h-5 w-5" />,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
    label: 'Processing',
  },
  completed: {
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    label: 'Completed',
  },
  cancelled: {
    icon: <XCircle className="h-5 w-5" />,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-500/10',
    label: 'Cancelled',
  },
}

const REPAIR_STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string; bg: string }> = {
  pending: {
    icon: <Clock className="h-5 w-5" />,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    label: 'Pending (รอตรวจเช็ค/ประเมินราคา)',
  },
  processing: {
    icon: <Wrench className="h-5 w-5" />,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
    label: 'Repairing (กำลังดำเนินการซ่อม)',
  },
  completed: {
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    label: 'Completed (ซ่อมเสร็จสิ้น/รับเครื่องแล้ว)',
  },
  cancelled: {
    icon: <XCircle className="h-5 w-5" />,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-500/10',
    label: 'Cancelled (ยกเลิกรายการ)',
  },
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?redirect=/orders')
  }

  // Fetch order
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !order) {
    notFound()
  }

  const items = (order.items as Array<any>) || []
  const isRepair = items.length > 0 && items[0]?.type === 'repair'
  const repairItem = isRepair ? items[0] : null

  const status = isRepair
    ? (REPAIR_STATUS_CONFIG[(order.status as string) || 'pending'] || REPAIR_STATUS_CONFIG.pending)
    : (STATUS_CONFIG[(order.status as string) || 'pending'] || STATUS_CONFIG.pending)

  const shipping = order.shipping_address as Record<string, string> | null
  const createdAt = order.created_at
    ? new Date(order.created_at as string).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''
  const updatedAt = order.updated_at
    ? new Date(order.updated_at as string).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> {isRepair ? 'ย้อนกลับไปหน้าแจ้งซ่อม' : 'ย้อนกลับไปหน้าการสั่งซื้อ'}
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            {isRepair ? (
              <>
                <Wrench className="h-7 w-7 text-emerald-500" />
                ใบส่งซ่อม #{String(order.id).slice(0, 8).toUpperCase()}
              </>
            ) : (
              `คำสั่งซื้อ #${String(order.id).slice(0, 8).toUpperCase()}`
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isRepair ? 'ส่งคำขอแจ้งซ่อมเมื่อ' : 'สั่งซื้อเมื่อ'} {createdAt}
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${status.bg} ${status.color}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* Contact Shop Prominent Box */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              {isRepair ? 'ติดต่อเราเพื่ออัปเดตและยืนยันงานซ่อม' : 'กรุณาติดต่อทางร้านเพื่อยืนยันคำสั่งซื้อ'}
            </h2>
            <p className="text-sm text-slate-650 dark:text-slate-450 max-w-2xl leading-relaxed">
              {isRepair ? (
                <>
                  ท่านส่งรายละเอียดคำขอส่งซ่อมอุปกรณ์เรียบร้อยแล้ว เพื่อความสะดวกรวดเร็วในการประเมินและให้บริการซ่อม <strong>กรุณาติดต่อเราโดยแจ้งเลขใบแจ้งซ่อม #{String(order.id).slice(0, 8).toUpperCase()}</strong> ผ่านช่องทางด้านล่างนี้ หรือนำอุปกรณ์มาส่งที่หน้าร้านได้เลยครับ
                </>
              ) : (
                <>
                  คำสั่งซื้อของคุณได้รับการบันทึกเรียบร้อยแล้ว เพื่อความรวดเร็วในการตรวจสอบสต็อกและการจัดส่ง/ชำระเงิน <strong>กรุณาติดต่อร้านโดยแจ้งเลขที่คำสั่งซื้อ #{String(order.id).slice(0, 8).toUpperCase()}</strong> ผ่านช่องทางด้านล่างนี้ได้เลยครับ
                </>
              )}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a 
              href="https://line.me/ti/p/~icon0815971155" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              แชทผ่าน LINE
            </a>
            <a 
              href="tel:0815971155" 
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold px-5 py-2.5 rounded-xl transition-all border border-slate-200 dark:border-slate-700 text-sm"
            >
              <Phone className="h-4 w-4" />
              โทรหาเรา: 081-597-1155
            </a>
            <a 
              href="https://www.facebook.com/iconnakhon/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 text-sm"
            >
              Facebook Page
            </a>
          </div>
        </div>
      </div>

      {isRepair ? (
        /* REPAIR LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repair Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-emerald-500" />
                  รายละเอียดงานแจ้งซ่อม
                </h2>
                <span className="px-2.5 py-1 text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/20 rounded-lg">
                  {repairItem?.deviceType || 'Other'}
                </span>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">หัวข้อ / Subject</h3>
                  <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                    {repairItem?.name}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">รายละเอียดอาการชำรุด / Description</h3>
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
                    {repairItem?.description}
                  </div>
                </div>

                {repairItem?.technicianNotes ? (
                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5" />
                      บันทึกและข้อเสนอแนะจากช่าง / Technician Notes
                    </h3>
                    <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/40 dark:border-emerald-950/30 p-4 rounded-xl text-sm text-emerald-950 dark:text-emerald-300 leading-relaxed whitespace-pre-wrap font-medium">
                      {repairItem.technicianNotes}
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <div className="bg-amber-50/30 dark:bg-amber-950/5 border border-amber-100/30 dark:border-amber-950/10 p-4 rounded-xl text-xs text-amber-850 dark:text-amber-450 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500 animate-pulse flex-shrink-0" />
                      <span>ยังไม่มีบันทึกหรือการอัปเดตจากช่างในขณะนี้ ช่างจะกรอกบันทึกแนะนำหลังจากตรวจสอบอาการของเครื่องเรียบร้อยแล้ว</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">ประวัติการดำเนินงาน (Timeline)</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">ส่งคำร้องแจ้งซ่อมเรียบร้อย</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{createdAt}</p>
                  </div>
                </div>
                {updatedAt && order.status !== 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${status.bg} ${status.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {status.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        อัปเดตสถานะงานซ่อม: {status.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{updatedAt}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">สรุปค่าใช้จ่าย / Cost Summary</h2>
              
              {Number(order.total_amount) === 0 ? (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/20 rounded-xl text-center">
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400 animate-pulse block">
                      รอประเมินราคา
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                      อยู่ระหว่างช่างวิเคราะห์อาการชำรุด
                    </span>
                  </div>
                  <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed text-center">
                    เมื่อช่างประเมินราคาและตรวจสอบเสร็จสิ้น ยอดค่าบริการจะปรากฏที่นี่ และระบบจะอัปเดตบันทึกคำแนะนำจากช่างให้ท่านทราบ
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400">ประมาณการค่าใช้จ่ายทั้งหมด</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">
                      ฿{Number(order.total_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900 dark:text-white">ยอดสุทธิ (Net Total)</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                      ฿{Number(order.total_amount).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/25 p-2 rounded-lg leading-relaxed text-center font-medium">
                    * ราคาข้างต้นรวมค่าบริการตรวจประเมิน และอะไหล่ทั้งหมดแล้ว
                  </p>
                </div>
              )}
            </div>

            {/* Customer Details */}
            {shipping && (
              <EditShippingAddressCard
                orderId={order.id}
                shippingAddress={{
                  fullName: shipping.fullName || '',
                  address: shipping.address || '',
                  city: shipping.city || '',
                  province: shipping.province || '',
                  postalCode: shipping.postalCode || '',
                  phone: shipping.phone || '',
                  email: shipping.email || '',
                  lineId: shipping.lineId || '',
                }}
                isEditable={order.status === 'pending'}
              />
            )}
          </div>
        </div>
      ) : (
        /* NORMAL ORDER LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  สินค้าในคำสั่งซื้อ ({items.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-5">
                    <div className="relative w-20 h-20 bg-slate-100 dark:bg-slate-850 rounded-lg flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image || '/placeholder-product.svg'}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.productId ? (
                        <Link href={`/product/${item.productId}`} className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors line-clamp-2 text-sm">
                          {item.name}
                        </Link>
                      ) : (
                        <p className="font-bold text-slate-900 dark:text-white line-clamp-2 text-sm">{item.name}</p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        จำนวน: {item.quantity} × ฿{item.price?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                        ฿{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">ประวัติรายการ (Timeline)</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">สร้างคำสั่งซื้อแล้ว</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{createdAt}</p>
                  </div>
                </div>
                {updatedAt && order.status !== 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${status.bg} ${status.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {status.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        เปลี่ยนสถานะเป็น: {status.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{updatedAt}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Summary + Shipping */}
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">ยอดสรุปคำสั่งซื้อ</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    ยอดรวม ({items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0)} ชิ้น)
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">
                    ฿{Number(order.total_amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">ค่าจัดส่ง</span>
                  <span className="font-semibold text-emerald-600">ฟรี</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900 dark:text-white">ยอดสุทธิ</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                    ฿{Number(order.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {shipping && (
              <EditShippingAddressCard
                orderId={order.id}
                shippingAddress={{
                  fullName: shipping.fullName || '',
                  address: shipping.address || '',
                  city: shipping.city || '',
                  province: shipping.province || '',
                  postalCode: shipping.postalCode || '',
                  phone: shipping.phone || '',
                  email: shipping.email || '',
                  lineId: shipping.lineId || '',
                }}
                isEditable={order.status === 'pending'}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

