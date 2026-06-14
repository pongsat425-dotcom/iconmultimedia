'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingBag, Search, Phone, User, MapPin, Clock, Package, 
  CheckCircle, XCircle, Copy, Trash2, Loader2, Check, ExternalLink,
  Mail, MessageSquare, Wrench
} from 'lucide-react'
import { updateOrderStatus, deleteOrder, updateRepairOrderDetails } from '@/app/actions/orders'
import { useToast } from '@/lib/toast/toast-context'
import Image from 'next/image'

interface OrdersManagerClientProps {
  initialOrders: any[]
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string; text: string }> = {
  pending: {
    icon: <Clock className="h-4 w-4" />,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    text: 'text-amber-800 dark:text-amber-300',
    label: 'Pending',
  },
  processing: {
    icon: <Package className="h-4 w-4" />,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
    text: 'text-blue-800 dark:text-blue-300',
    label: 'Processing',
  },
  completed: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    text: 'text-emerald-800 dark:text-emerald-300',
    label: 'Completed',
  },
  cancelled: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-500/10',
    text: 'text-red-800 dark:text-red-300',
    label: 'Cancelled',
  },
}

const REPAIR_STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string; text: string }> = {
  pending: {
    icon: <Clock className="h-4 w-4" />,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    text: 'text-amber-850 dark:text-amber-350',
    label: 'Pending (รอประเมิน)',
  },
  processing: {
    icon: <Wrench className="h-4 w-4" />,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/10',
    text: 'text-blue-850 dark:text-blue-350',
    label: 'Repairing (กำลังซ่อม)',
  },
  completed: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    text: 'text-emerald-850 dark:text-emerald-350',
    label: 'Completed (ซ่อมเสร็จสิ้น)',
  },
  cancelled: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-500/10',
    text: 'text-red-850 dark:text-red-350',
    label: 'Cancelled (ยกเลิก)',
  },
}

export default function OrdersManagerClient({ initialOrders }: OrdersManagerClientProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  
  // Main Tab State
  const [activeMainTab, setActiveMainTab] = useState<'products' | 'repairs'>('products')
  
  // Repair Fields State
  const [repairPrice, setRepairPrice] = useState<number | string>(0)
  const [technicianNotes, setTechnicianNotes] = useState<string>('')
  const [isSavingRepairDetails, setIsSavingRepairDetails] = useState(false)

  // States for selected order actions
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const { success, error: toastError } = useToast()

  // Sync state if initialOrders change
  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  // Reset selected order if it is no longer in the orders list (e.g. deleted)
  useEffect(() => {
    if (selectedOrderId && !orders.some(o => o.id === selectedOrderId)) {
      setSelectedOrderId(null)
    }
  }, [orders, selectedOrderId])

  // Filter based on products vs repairs
  const mainTabOrders = orders.filter((order) => {
    const isRepair = order.items?.[0]?.type === 'repair'
    return activeMainTab === 'repairs' ? isRepair : !isRepair
  })

  // Filter & Search Logic
  const filteredOrders = mainTabOrders.filter((order) => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    
    const idString = String(order.id).toLowerCase()
    const nameString = String(order.shipping_address?.fullName || '').toLowerCase()
    const phoneString = String(order.shipping_address?.phone || '').toLowerCase()
    const query = searchQuery.toLowerCase().trim()
    
    const matchesSearch = !query || 
      idString.includes(query) || 
      nameString.includes(query) || 
      phoneString.includes(query)

    return matchesStatus && matchesSearch
  })

  // Auto select first order on desktop if none selected or if active tab changes
  useEffect(() => {
    if (filteredOrders.length > 0) {
      const isStillInList = filteredOrders.some(o => o.id === selectedOrderId)
      if (!isStillInList) {
        setSelectedOrderId(filteredOrders[0].id)
      }
    } else {
      setSelectedOrderId(null)
    }
  }, [selectedStatus, activeMainTab, orders])

  // Selected Order
  const selectedOrder = orders.find(o => o.id === selectedOrderId)
  const isSelectedOrderRepair = selectedOrder?.items?.[0]?.type === 'repair'

  // Synchronize repair inputs when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      const isRepair = selectedOrder.items?.[0]?.type === 'repair'
      if (isRepair) {
        setRepairPrice(selectedOrder.total_amount || 0)
        setTechnicianNotes(selectedOrder.items?.[0]?.technicianNotes || '')
      }
    }
  }, [selectedOrderId, orders])

  // Handlers
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrderId) return
    setIsUpdatingStatus(true)

    const formData = new FormData()
    formData.append('orderId', selectedOrderId)
    formData.append('status', newStatus)

    const result = await updateOrderStatus(formData)

    if (result?.error) {
      toastError(result.error)
    } else {
      const label = activeMainTab === 'repairs'
        ? REPAIR_STATUS_CONFIG[newStatus]?.label
        : STATUS_CONFIG[newStatus]?.label
      success(`อัปเดตสถานะเป็น ${label || newStatus}`)
      // Update local state instantly
      setOrders(prev => prev.map(o => o.id === selectedOrderId ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o))
    }

    setIsUpdatingStatus(false)
  }

  const handleSaveRepairDetails = async () => {
    if (!selectedOrderId) return
    setIsSavingRepairDetails(true)

    const priceToSave = repairPrice === '' ? 0 : Number(repairPrice)
    const result = await updateRepairOrderDetails(selectedOrderId, priceToSave, technicianNotes)

    if (result?.error) {
      toastError(result.error)
    } else {
      success('บันทึกรายละเอียดงานซ่อมและราคาประเมินเรียบร้อยแล้ว')
      // Update local state instantly
      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrderId) {
          const updatedItems = [...(o.items || [])]
          if (updatedItems[0]) {
            updatedItems[0] = { ...updatedItems[0], technicianNotes }
          }
          return {
            ...o,
            total_amount: priceToSave,
            items: updatedItems,
            updated_at: new Date().toISOString()
          }
        }
        return o
      }))
    }

    setIsSavingRepairDetails(false)
  }

  const handleDelete = async () => {
    if (!selectedOrderId) return
    setIsDeleting(true)

    const result = await deleteOrder(selectedOrderId)

    if (result?.error) {
      toastError(result.error)
    } else {
      success('ลบรายการเรียบร้อยแล้ว')
      const deletedId = selectedOrderId
      setOrders(prev => prev.filter(o => o.id !== deletedId))
      setShowDeleteConfirm(false)
      setSelectedOrderId(null)
    }

    setIsDeleting(false)
  }

  const handleCopyAddress = (shipping: any) => {
    if (!shipping) return
    let textToCopy = `ชื่อผู้รับ: ${shipping.fullName}\nเบอร์โทรศัพท์: ${shipping.phone}`
    if (shipping.email) textToCopy += `\nอีเมล: ${shipping.email}`
    if (shipping.lineId) textToCopy += `\nLINE ID: ${shipping.lineId}`
    textToCopy += `\nที่อยู่: ${shipping.address} ${shipping.city} ${shipping.province} ${shipping.postalCode}`
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      success('คัดลอกข้อมูลลูกค้าเรียบร้อยแล้ว')
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => {
      console.error('Failed to copy text: ', err)
      toastError('ไม่สามารถคัดลอกข้อมูลได้')
    })
  }

  // Get status counts for filter buttons
  const getStatusCount = (status: 'all' | 'pending' | 'processing' | 'completed' | 'cancelled') => {
    if (status === 'all') return mainTabOrders.length
    return mainTabOrders.filter(o => o.status === status).length
  }

  const totalProductsCount = orders.filter(o => !o.items || !o.items[0] || o.items[0].type !== 'repair').length
  const totalRepairsCount = orders.filter(o => o.items && o.items[0] && o.items[0].type === 'repair').length

  return (
    <div className="space-y-6">
      {/* Page Title & KPI stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Orders & Repairs Manager</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            ระบบบริหารจัดการคำสั่งซื้อสินค้าและคำขอแจ้งซ่อมแซมอุปกรณ์ของลูกค้า iCON Multimedia
          </p>
        </div>
        
        {/* Simple count cards */}
        <div className="flex gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl h-fit">
          <div className="text-center pr-3 border-r border-slate-200 dark:border-slate-800">
            <span className="block text-xs font-semibold text-slate-400">
              {activeMainTab === 'repairs' ? 'งานซ่อมทั้งหมด' : 'ออเดอร์ทั้งหมด'}
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">{mainTabOrders.length}</span>
          </div>
          <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
            <span className="block text-xs font-semibold text-amber-500">
              {activeMainTab === 'repairs' ? 'รอประเมิน' : 'รอยืนยัน'}
            </span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{getStatusCount('pending')}</span>
          </div>
          <div className="text-center pl-3">
            <span className="block text-xs font-semibold text-blue-500">
              {activeMainTab === 'repairs' ? 'กำลังซ่อม' : 'กำลังจัดเตรียม'}
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{getStatusCount('processing')}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            setActiveMainTab('products')
            setSelectedStatus('all')
            setSelectedOrderId(null)
          }}
          className={`flex items-center gap-2 py-3 px-6 font-bold text-sm sm:text-base border-b-2 transition-all cursor-pointer ${
            activeMainTab === 'products'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          <span>คำสั่งซื้อสินค้า ({totalProductsCount})</span>
        </button>
        <button
          onClick={() => {
            setActiveMainTab('repairs')
            setSelectedStatus('all')
            setSelectedOrderId(null)
          }}
          className={`flex items-center gap-2 py-3 px-6 font-bold text-sm sm:text-base border-b-2 transition-all cursor-pointer ${
            activeMainTab === 'repairs'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <Wrench className="h-4.5 w-4.5" />
          <span>ใบแจ้งซ่อมอุปกรณ์ ({totalRepairsCount})</span>
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeMainTab === 'repairs' ? "ค้นหาใบแจ้งซ่อม เช่น รหัส, ชื่อลูกค้า, เบอร์โทร..." : "ค้นหาออเดอร์ เช่น รหัสออเดอร์, ชื่อลูกค้า, เบอร์โทร..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
          {(['all', 'pending', 'processing', 'completed', 'cancelled'] as const).map((status) => {
            const isActive = selectedStatus === status
            const label = status === 'all' 
              ? 'ทั้งหมด' 
              : activeMainTab === 'repairs' 
                ? REPAIR_STATUS_CONFIG[status]?.label 
                : STATUS_CONFIG[status]?.label
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {label} ({getStatusCount(status)})
              </button>
            )
          })}
        </div>
      </div>

      {/* Main master-detail view grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Column: Orders List (2/5 size) */}
        <div className="lg:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center rounded-2xl shadow-sm">
              {activeMainTab === 'repairs' ? (
                <Wrench className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              ) : (
                <ShoppingBag className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              )}
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {activeMainTab === 'repairs' ? 'ไม่พบรายการใบแจ้งซ่อมตามตัวกรองที่ระบุ' : 'ไม่พบรายการคำสั่งซื้อตามตัวกรองที่ระบุ'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrderId === order.id
              const isRepair = order.items?.[0]?.type === 'repair'
              
              const statusCfg = isRepair
                ? (REPAIR_STATUS_CONFIG[order.status || 'pending'] || REPAIR_STATUS_CONFIG.pending)
                : (STATUS_CONFIG[order.status || 'pending'] || STATUS_CONFIG.pending)
                
              const dateText = order.created_at
                ? new Date(order.created_at).toLocaleDateString('th-TH', {
                    day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit'
                  })
                : ''
              const itemCount = Array.isArray(order.items) 
                ? order.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) 
                : 0

              return (
                <button
                  key={order.id}
                  onClick={() => {
                    setSelectedOrderId(order.id)
                    setShowDeleteConfirm(false)
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-primary ring-1 ring-primary/20 shadow-sm' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      #{String(order.id).slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                      {statusCfg.icon}
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>{order.shipping_address?.fullName || 'ไม่ระบุชื่อ'}</span>
                    </div>
                    {order.shipping_address?.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3" />
                        <span>{order.shipping_address.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                      <span>{dateText} {isRepair ? '(แจ้งซ่อม)' : `(${itemCount} ชิ้น)`}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {isRepair && Number(order.total_amount) === 0 ? (
                          <span className="text-xs font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/20 px-2 py-0.5 rounded animate-pulse">
                            รอประเมิน
                          </span>
                        ) : (
                          `฿${Number(order.total_amount).toLocaleString()}`
                        )}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Right Column: Details Pane (3/5 size) */}
        <div className="lg:col-span-3">
          {!selectedOrder ? (
            <div className="bg-slate-50/50 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 p-24 text-center rounded-2xl">
              {activeMainTab === 'repairs' ? (
                <Wrench className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              ) : (
                <ShoppingBag className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              )}
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
                {activeMainTab === 'repairs' ? 'กรุณาเลือกใบแจ้งซ่อม' : 'กรุณาเลือกคำสั่งซื้อ'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {activeMainTab === 'repairs' 
                  ? 'คลิกเลือกรายการแจ้งซ่อมด้านซ้าย เพื่อจัดการรายละเอียดอุปกรณ์ อาการชำรุด และประเมินราคาพร้อมบันทึกช่าง' 
                  : 'คลิกเลือกรายการออเดอร์ในรายการฝั่งซ้าย เพื่อตรวจสอบและจัดการข้อมูลผู้รับสินค้า การชำระเงิน และการจัดส่ง'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Card Header */}
              <div className="p-6 bg-slate-50/50 dark:bg-slate-850/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">
                      {isSelectedOrderRepair ? 'เลขที่ใบแจ้งซ่อม' : 'เลขที่ใบสั่งซื้อ'}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                      #{selectedOrder.id}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      ทำรายการเมื่อ: {new Date(selectedOrder.created_at).toLocaleString('th-TH', { hour12: false })}
                    </p>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {isUpdatingStatus && <Loader2 className="absolute -left-6 top-2 h-4 w-4 animate-spin text-primary" />}
                      <select
                        value={selectedOrder.status || 'pending'}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={isUpdatingStatus}
                        className={`appearance-none pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold cursor-pointer shadow-sm focus:ring-1 focus:ring-primary focus:border-primary ${
                          isSelectedOrderRepair
                            ? (REPAIR_STATUS_CONFIG[selectedOrder.status || 'pending']?.bg || REPAIR_STATUS_CONFIG.pending.bg)
                            : (STATUS_CONFIG[selectedOrder.status || 'pending']?.bg || STATUS_CONFIG.pending.bg)
                        } ${
                          isSelectedOrderRepair
                            ? (REPAIR_STATUS_CONFIG[selectedOrder.status || 'pending']?.text || REPAIR_STATUS_CONFIG.pending.text)
                            : (STATUS_CONFIG[selectedOrder.status || 'pending']?.text || STATUS_CONFIG.pending.text)
                        }`}
                      >
                        {isSelectedOrderRepair ? (
                          <>
                            <option value="pending">⏳ Pending (รอตรวจประเมิน)</option>
                            <option value="processing">🛠️ Repairing (กำลังดำเนินการซ่อม)</option>
                            <option value="completed">✅ Completed (ซ่อมเสร็จสิ้น)</option>
                            <option value="cancelled">❌ Cancelled (ยกเลิกรายการ)</option>
                          </>
                        ) : (
                          <>
                            <option value="pending">⏳ Pending (รอยืนยัน)</option>
                            <option value="processing">📦 Processing (กำลังเตรียมจัดส่ง)</option>
                            <option value="completed">✅ Completed (จัดส่งสำเร็จ)</option>
                            <option value="cancelled">❌ Cancelled (ยกเลิกรายการ)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Customer Information */}
              <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4.5 w-4.5 text-primary" />
                  {isSelectedOrderRepair ? 'ข้อมูลลูกค้าและการติดต่อ (Customer & Contact)' : 'ข้อมูลลูกค้าและการจัดส่ง (Customer & Shipping)'}
                </h3>
                
                {selectedOrder.shipping_address ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-155 dark:border-slate-800/85">
                      <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                        <User className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-semibold">{selectedOrder.shipping_address.fullName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 pt-1">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <a href={`tel:${selectedOrder.shipping_address.phone}`} className="font-medium hover:text-primary hover:underline flex items-center gap-1">
                          {selectedOrder.shipping_address.phone}
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </a>
                      </div>

                      {selectedOrder.shipping_address.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 pt-1 border-t border-slate-150 dark:border-slate-800/50 mt-1">
                          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                          <a href={`mailto:${selectedOrder.shipping_address.email}`} className="font-medium hover:text-primary hover:underline flex items-center gap-1">
                            {selectedOrder.shipping_address.email}
                            <ExternalLink className="h-3 w-3 text-slate-400" />
                          </a>
                        </div>
                      )}
                      
                      {selectedOrder.shipping_address.lineId && (
                        <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 pt-1 border-t border-slate-150 dark:border-slate-800/50 mt-1">
                          <MessageSquare className="h-4 w-4 text-slate-400 shrink-0" />
                          <a 
                            href={`https://line.me/ti/p/~${selectedOrder.shipping_address.lineId.replace(/^@/, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-medium hover:text-primary hover:underline flex items-center gap-1"
                          >
                            LINE: {selectedOrder.shipping_address.lineId}
                            <ExternalLink className="h-3 w-3 text-slate-400" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 flex flex-col justify-between">
                      <div className="text-xs text-slate-650 dark:text-slate-400">
                        <p className="font-medium text-slate-800 dark:text-slate-200 mb-0.5">ที่อยู่ของลูกค้า/การรับกลับ:</p>
                        <p className="leading-relaxed">
                          {selectedOrder.shipping_address.address}
                        </p>
                        <p className="mt-0.5">
                          {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.province} {selectedOrder.shipping_address.postalCode}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopyAddress(selectedOrder.shipping_address)}
                        className="self-start inline-flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-855 shadow-sm transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อมูลลูกค้า/ที่อยู่'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-rose-500">ไม่มีข้อมูลติดต่อลูกค้า</p>
                )}
              </div>

              {/* Items List or Repair Detail Form */}
              {isSelectedOrderRepair ? (
                /* REPAIR DETAILS AND MANAGEMENT PANEL */
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Wrench className="h-4.5 w-4.5 text-emerald-500" />
                      รายละเอียดปัญหาและอุปกรณ์แจ้งซ่อม (Repair Details)
                    </h3>
                    
                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/50 pb-2">
                        <span className="text-xs font-semibold text-slate-450">ประเภทอุปกรณ์</span>
                        <span className="px-2.5 py-0.5 text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/20 rounded-lg">
                          {selectedOrder.items?.[0]?.deviceType || 'Other'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="block text-xs font-semibold text-slate-450 mb-1">หัวข้อ/อาการแจ้งซ่อม</span>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                          {selectedOrder.items?.[0]?.name}
                        </p>
                      </div>

                      <div className="border-t border-slate-200/40 dark:border-slate-800/50 pt-3">
                        <span className="block text-xs font-semibold text-slate-455 mb-1">รายละเอียดอาการชำรุดเพิ่มเติม</span>
                        <p className="text-sm text-slate-700 dark:text-slate-350 whitespace-pre-wrap leading-relaxed">
                          {selectedOrder.items?.[0]?.description || 'ไม่ได้ระบุ'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Technician Edit Sub-panel */}
                  <div className="p-6 space-y-4 bg-emerald-50/10 dark:bg-emerald-950/5">
                    <h3 className="text-sm font-bold text-emerald-750 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Wrench className="h-4.5 w-4.5 text-emerald-500" />
                      บันทึกและจัดการงานซ่อม (Technician Update Panel)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Price Field */}
                      <div className="md:col-span-1 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-750 dark:text-slate-350">
                          ราคาค่าซ่อมและอะไหล่ (฿)
                        </label>
                        <input
                          type="number"
                          value={repairPrice}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === '') {
                              setRepairPrice('')
                            } else {
                              const num = parseFloat(val)
                              setRepairPrice(isNaN(num) ? '' : Math.max(0, num))
                            }
                          }}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary font-mono font-bold"
                          placeholder="0"
                        />
                        <span className="text-[10px] text-slate-400 block leading-tight">
                          * ยอดเงินรวมทั้งหมด (ระบุ 0 เพื่อแสดงว่า "รอประเมินราคา")
                        </span>
                      </div>

                      {/* Notes Field */}
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-750 dark:text-slate-350">
                          บันทึก/คำแนะนำสำหรับช่าง (ลูกค้าจะเปิดอ่านได้ใน My Orders)
                        </label>
                        <textarea
                          rows={3}
                          value={technicianNotes}
                          onChange={(e) => setTechnicianNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary leading-relaxed"
                          placeholder="เช่น ได้ทำการบัดกรีเปลี่ยนชิปเซ็ตใหม่, รออะไหล่ประมาณ 3 วัน..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveRepairDetails}
                        disabled={isSavingRepairDetails}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-75"
                      >
                        {isSavingRepairDetails ? (
                          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> กำลังบันทึกข้อมูล...</>
                        ) : (
                          <><Wrench className="h-3.5 w-3.5" /> บันทึกข้อมูลงานซ่อม</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* STANDARD ITEMS LIST */
                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="h-4.5 w-4.5 text-primary" />
                    รายการสินค้าในตะกร้า (Items List)
                  </h3>
                  
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner bg-slate-50/30 dark:bg-slate-950/20">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {(selectedOrder.items as any[] || []).map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 items-center">
                          <div className="relative w-12 h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                            <Image
                              src={item.image || '/placeholder-product.svg'}
                              alt={item.name}
                              fill
                              className="object-contain"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            {item.productId ? (
                              <a 
                                href={`/product/${item.productId}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="font-semibold text-sm text-slate-900 dark:text-white hover:text-primary transition-colors flex items-center gap-1"
                              >
                                <span className="truncate">{item.name}</span>
                                <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0" />
                              </a>
                            ) : (
                              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.name}</p>
                            )}
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              ราคาต่อหน่วย: ฿{item.price?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-sm text-slate-900 dark:text-white">
                              ฿{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              จำนวน: × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary calculations inside the list */}
                    <div className="bg-slate-50/80 dark:bg-slate-950/40 p-4 border-t border-slate-150 dark:border-slate-800 flex justify-between items-center text-slate-800 dark:text-slate-200">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">ราคาสุทธิทั้งหมด (Total)</span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                        ฿{Number(selectedOrder.total_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Management tools section */}
              <div className="p-6 bg-slate-50/30 dark:bg-slate-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Status Logs / Info */}
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <p>
                    {isSelectedOrderRepair
                      ? 'หลังจากตรวจเช็คหรือดำเนินการซ่อมแล้ว กรุณาปรับเปลี่ยนสถานะตามจริง'
                      : 'หลังจากส่งของหรือตรวจสอบโอนเงินแล้ว กรุณาปรับเปลี่ยนสถานะตามจริง'}
                  </p>
                  <p className="mt-0.5 text-slate-400">
                    สถานะการทำงาน: {' '}
                    {isSelectedOrderRepair ? (
                      <span className="font-medium">Pending ➔ Repairing ➔ Completed</span>
                    ) : (
                      <span className="font-medium">Pending ➔ Processing ➔ Completed</span>
                    )}
                  </p>
                </div>

                {/* Quick actions buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/50 p-2 rounded-xl">
                      <span className="text-xs font-semibold text-rose-700 dark:text-rose-450 px-1">
                        {isSelectedOrderRepair ? 'ยืนยันการลบรายการแจ้งซ่อมนี้?' : 'ยืนยันการลบออเดอร์นี้?'}
                      </span>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isDeleting ? 'กำลังลบ...' : 'ใช่, ลบเลย'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                        className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-1.5 text-xs bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold px-4 py-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {isSelectedOrderRepair ? 'ลบรายการแจ้งซ่อมนี้ (Delete)' : 'ลบออเดอร์นี้ (Delete)'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

