import { getProductById, getProductsByCategory } from '@/lib/supabase/queries'
import { CATEGORY_LIST } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-md">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">ไม่พบสินค้านี้ (Product Not Found)</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">ขออภัย สินค้าที่คุณกำลังค้นหาไม่มีอยู่ในระบบหรืออาจถูกถอนออกจากร้านค้าชั่วคราว</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> กลับไปหน้าสินค้าทั้งหมด
          </Link>
        </div>
      </div>
    )
  }

  const categoryName = CATEGORY_LIST.find(c => c.slug === product.category)?.name || product.category
  const relatedProducts = (await getProductsByCategory(product.category))
    .filter(p => p.id !== product.id)
    .slice(0, 4)

  return (
    <ProductDetailClient
      product={product}
      categoryName={categoryName}
      relatedProducts={relatedProducts}
    />
  )
}
