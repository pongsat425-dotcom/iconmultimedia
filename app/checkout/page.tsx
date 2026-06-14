'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, Loader2, MessageSquare, Phone, Info } from 'lucide-react'
import { useCart } from '@/lib/cart/cart-context'
import { useAuth } from '@/lib/supabase/auth-context'
import { useToast } from '@/lib/toast/toast-context'
import { createOrder } from '@/app/actions/checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useCart()
  const { user } = useAuth()
  const { error: toastError } = useToast()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">ไม่มีสินค้าในตะกร้าของคุณ</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">กรุณาเลือกสินค้าใส่ตะกร้าก่อนดำเนินการชำระเงิน</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" /> เริ่มเลือกซื้อสินค้า
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setErrorMsg('')

    formData.append('items', JSON.stringify(state.items))
    formData.append('totalAmount', state.totalPrice.toString())

    const result = await createOrder(formData)

    if (result?.error) {
      setErrorMsg(result.error)
      toastError(result.error)
      setLoading(false)
    } else {
      clearCart()
      router.push('/orders')
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> กลับไปยังตะกร้า
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-primary" />
        ชำระเงิน
      </h1>

      <form action={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            {errorMsg && (
              <div className="p-3 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Direct Contact Payment Info Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/80 rounded-xl p-5 flex gap-4 shadow-sm">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg h-fit shrink-0">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">
                  การชำระเงินโดยติดต่อทางร้านโดยตรง (Payment via Contact)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  ทางร้านให้บริการสั่งซื้อแบบสั่งของล่วงหน้า (Pre-order) หรือติดต่อโอนเงินผ่านบัญชีธนาคาร 
                  <strong className="text-emerald-700 dark:text-emerald-400"> หลังจากกรอกข้อมูลการจัดส่งและคลิกปุ่มส่งคำสั่งซื้อเรียบร้อยแล้ว</strong> กรุณาแอดไลน์หรือโทรศัพท์เพื่อแจ้งเลขคำสั่งซื้อและยืนยันการชำระเงิน/รับของกับทางร้านโดยตรงครับ
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                ที่อยู่จัดส่ง / Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ชื่อ-นามสกุล / Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    defaultValue={user?.user_metadata?.full_name || ''}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="เช่น สมชาย ใจดี"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ที่อยู่ / Address</label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={2}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="เช่น 123/4 หมู่บ้านสุขสบาย ถนนสุขุมวิท"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">เขต/อำเภอ (City)</label>
                  <input id="city" name="city" type="text" required className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="เช่น เขตปทุมวัน / อำเภอเมือง" />
                </div>
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">จังหวัด (Province)</label>
                  <input id="province" name="province" type="text" required className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="เช่น กรุงเทพมหานคร" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">รหัสไปรษณีย์ (Postal Code)</label>
                  <input id="postalCode" name="postalCode" type="text" required className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="เช่น 10110" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">เบอร์โทรศัพท์ (Phone)</label>
                  <input id="phone" name="phone" type="tel" required className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="เช่น 0812345678" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">อีเมล / Email (ถ้ามี)</label>
                  <input id="email" name="email" type="email" defaultValue={user?.email || ''} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="เช่น example@email.com" />
                </div>
                <div>
                  <label htmlFor="lineId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ไลน์ไอดี / LINE ID (ถ้ามี)</label>
                  <input id="lineId" name="lineId" type="text" className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="เช่น line_id_123" />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">สรุปรายการสั่งซื้อ / Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {state.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400 truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">ยอดรวม / Subtotal</span>
                  <span className="font-medium text-slate-900 dark:text-white">฿{state.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">ค่าจัดส่ง / Shipping</span>
                  <span className="font-medium text-primary">จัดส่งฟรี</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between">
                  <span className="text-base font-bold text-slate-900 dark:text-white">ยอดรวมสุทธิ / Total</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">฿{state.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-primary hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> กำลังทำรายการสั่งซื้อ...</>
                ) : (
                  'สั่งซื้อและติดต่อร้านค้า / Place Order'
                )}
              </button>

              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-250">ติดต่อร้านค้าโดยตรงได้ที่:</p>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <MessageSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>LINE: <a href="https://line.me/ti/p/~icon0815971155" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-450 font-bold hover:underline">icon0815971155</a></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>โทร: <a href="tel:0815971155" className="font-semibold hover:underline">081 597 1155</a></span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                การสั่งซื้อสินค้านี้ถือว่าคุณยอมรับข้อตกลงการให้บริการของเรา
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
