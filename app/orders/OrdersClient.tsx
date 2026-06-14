'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Package, Clock, CheckCircle, XCircle, ArrowRight, Wrench, Shield } from 'lucide-react'

interface OrdersClientProps {
  initialOrders: any[]
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string; labelRepair: string }> = {
  pending: {
    icon: <Clock className="h-4 w-4" />,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    label: 'Pending (รอยืนยัน)',
    labelRepair: 'Pending (รอตรวจเช็ค/ประเมินราคา)',
  },
  processing: {
    icon: <Package className="h-4 w-4" />,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
    label: 'Processing (กำลังจัดเตรียม)',
    labelRepair: 'Repairing (กำลังดำเนินการซ่อม)',
  },
  completed: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    label: 'Completed (จัดส่งสำเร็จ)',
    labelRepair: 'Completed (ซ่อมเสร็จสิ้น/รับเครื่องแล้ว)',
  },
  cancelled: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-500/10',
    label: 'Cancelled (ยกเลิก)',
    labelRepair: 'Cancelled (ยกเลิกรายการ)',
  },
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'repairs'>('products')

  // Separate orders based on items structure
  const productOrders = initialOrders.filter((order) => {
    const firstItem = order.items && order.items[0]
    return !firstItem || firstItem.type !== 'repair'
  })

  const repairOrders = initialOrders.filter((order) => {
    const firstItem = order.items && order.items[0]
    return firstItem && firstItem.type === 'repair'
  })

  const currentOrders = activeTab === 'products' ? productOrders : repairOrders

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 py-4 px-6 font-bold text-sm sm:text-base border-b-2 transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          <span>สถานะการสั่งซื้อสินค้า ({productOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('repairs')}
          className={`flex items-center gap-2 py-4 px-6 font-bold text-sm sm:text-base border-b-2 transition-all cursor-pointer ${
            activeTab === 'repairs'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wrench className="h-4.5 w-4.5" />
          <span>ประวัติงานแจ้งซ่อม ({repairOrders.length})</span>
        </button>
      </div>

      {currentOrders.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-800/60 rounded-full flex items-center justify-center mb-6">
            {activeTab === 'products' ? (
              <ShoppingBag className="h-12 w-12 text-slate-400" />
            ) : (
              <Wrench className="h-12 w-12 text-slate-400" />
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {activeTab === 'products' ? 'ยังไม่มีรายการคำสั่งซื้อ' : 'ยังไม่มีประวัติงานแจ้งซ่อม'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm sm:text-base">
            {activeTab === 'products' 
              ? 'คุณยังไม่มีประวัติการซื้อขายสินค้ากับเรา เริ่มช้อปปิ้งเลยเพื่อดูคำสั่งซื้อของคุณ!'
              : 'คุณยังไม่มีการส่งเรื่องแจ้งซ่อมอุปกรณ์ หากต้องการส่งซ่อม สามารถแจ้งผ่านหน้าติดต่อเราได้ทันที!'
            }
          </p>
          <Link
            href={activeTab === 'products' ? '/shop' : '/contact?subject=สนใจบริการซ่อม'}
            className={`inline-flex items-center gap-2 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer text-sm ${
              activeTab === 'products' ? 'bg-primary hover:bg-primary-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {activeTab === 'products' ? (
              <>เริ่มเลือกซื้อสินค้า <ArrowRight className="h-5 w-5" /></>
            ) : (
              <>ส่งคำขอแจ้งซ่อมอุปกรณ์ <ArrowRight className="h-5 w-5" /></>
            )}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {currentOrders.map((order) => {
            const firstItem = order.items && order.items[0]
            const status = STATUS_CONFIG[order.status || 'pending'] || STATUS_CONFIG.pending
            const dateText = order.created_at
              ? new Date(order.created_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''
            const itemsList = order.items || []

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 md:p-6 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 relative group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {activeTab === 'products' ? 'คำสั่งซื้อสินค้า' : 'ใบแจ้งซ่อมอุปกรณ์'}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        #{String(order.id).slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{dateText}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                      {status.icon}
                      {activeTab === 'products' ? status.label : status.labelRepair}
                    </span>
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {activeTab === 'repairs' && Number(order.total_amount) === 0 ? (
                        <span className="text-sm font-semibold text-amber-500 animate-pulse bg-amber-50 dark:bg-amber-950/20 border border-amber-200/20 px-2 py-0.5 rounded">
                          รอประเมินราคา
                        </span>
                      ) : (
                        `฿${Number(order.total_amount).toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                {activeTab === 'products' ? (
                  /* Product Items List */
                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2">
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {itemsList.slice(0, 3).map((item: any, i: number) => (
                        <span key={i}>
                          <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                          <span className="text-slate-400"> × {item.quantity}</span>
                          {i < Math.min(itemsList.length, 3) - 1 && ', '}
                        </span>
                      ))}
                      {itemsList.length > 3 && (
                        <span className="text-slate-400 font-medium"> และอีก {itemsList.length - 3} รายการ...</span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Repair Service Description */
                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/20 rounded">
                        {firstItem?.deviceType || 'Other'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {firstItem?.name}
                      </h3>
                    </div>
                    {firstItem?.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        <strong className="text-slate-700 dark:text-slate-300">อาการชำรุด:</strong> {firstItem.description}
                      </p>
                    )}
                    {firstItem?.technicianNotes && (
                      <div className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/40 dark:border-emerald-950/30 p-2.5 rounded-xl text-xs text-emerald-800 dark:text-emerald-350">
                        <strong>บันทึกจากช่าง:</strong> {firstItem.technicianNotes}
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors">
                    {activeTab === 'products' ? 'ชำระเงินโอนบัญชีธนาคาร' : 'รับส่งซ่อมหน้าร้าน / พัสดุ'}
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className={`inline-flex items-center gap-1 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      activeTab === 'products' ? 'text-primary hover:text-primary-700' : 'text-emerald-600 hover:text-emerald-700'
                    }`}
                  >
                    <span>ดูรายละเอียด</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
