'use client'

import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { useFavorites } from '@/lib/favorites/favorites-context'
import ProductCard from '@/components/home/ProductCard'

export default function FavoritesPage() {
  const { items } = useFavorites()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Heart className="h-10 w-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">ไม่มีสินค้าในรายการโปรด</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
            คุณยังไม่มีรายการสินค้าที่ถูกใจ กดไอคอนรูปหัวใจที่ตัวสินค้าที่ต้องการเพื่อบันทึกไว้ในหน้านี้
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer shadow-md shadow-primary/20"
          >
            <ArrowLeft className="h-5 w-5" />
            กลับไปช้อปปิ้งต่อ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8 border-b border-slate-200/50 dark:border-slate-850 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
          รายการโปรดของฉัน
          <span className="text-base font-normal text-slate-400 dark:text-slate-550">({items.length} รายการ)</span>
        </h1>
        <Link 
          href="/" 
          className="text-sm font-semibold text-primary hover:text-primary-700 flex items-center gap-1.5 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" /> 
          <span>กลับไปเลือกสินค้าต่อ</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}
