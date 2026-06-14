'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, Check, ChevronRight, Heart, MessageSquare, Calendar, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '@/lib/cart/cart-context'
import { useToast } from '@/lib/toast/toast-context'
import { useFavorites } from '@/lib/favorites/favorites-context'
import { useState, useEffect } from 'react'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/home/ProductCard'

interface ProductDetailClientProps {
  product: Product
  categoryName: string
  relatedProducts: Product[]
}

export default function ProductDetailClient({
  product,
  categoryName,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart()
  const { success } = useToast()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [justAdded, setJustAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product.image || '/placeholder-product.svg')

  const actualDiscount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const allImages = Array.from(new Set([
    product.image || '/placeholder-product.svg',
    ...(product.images || [])
  ])).filter(Boolean)

  useEffect(() => {
    setActiveImage(product.image || '/placeholder-product.svg')
  }, [product.image])

  const handleAddToCart = () => {
    if (!product.inStock) return
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })
    success(`${product.name.length > 40 ? product.name.substring(0, 40) + '…' : product.name} added to cart`)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  // Use product reviews count directly from products table
  const totalReviews = product.reviews || 0

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/category/${product.category}`} className="hover:text-primary transition-colors font-semibold capitalize">{categoryName}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 dark:text-white truncate max-w-[200px] font-medium">{product.name}</span>
      </nav>

      {/* Product Detail Main Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        
        {/* Left: Images Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-center overflow-hidden group/gallery shadow-sm dark:shadow-2xl dark:shadow-slate-950/50">
            {actualDiscount > 0 && (
              <div className="absolute top-5 left-5 z-10 bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg uppercase tracking-wider animate-bounce">
                -{actualDiscount}% OFF
              </div>
            )}
            <button
              onClick={() => {
                toggleFavorite({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.image,
                  inStock: product.inStock,
                  rating: product.rating,
                  reviews: product.reviews
                });
              }}
              className="absolute top-5 right-5 z-10 p-3 bg-white/80 dark:bg-slate-955/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-rose-500 rounded-2xl shadow transition-all duration-300 cursor-pointer"
            >
              <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <div className="relative w-full h-full p-8 transition-transform duration-500 group-hover/gallery:scale-105">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {allImages.map((img, idx) => (
                <button
                  key={img + idx}
                  type="button"
                  onMouseEnter={() => setActiveImage(img)}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden p-1 transition-all duration-300 cursor-pointer ${
                    activeImage === img
                      ? 'border-primary ring-2 ring-primary/20 scale-95 shadow-md shadow-primary/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:scale-105'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`${product.name} gallery image ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="80px"
                      unoptimized
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details Info */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {categoryName}
              </span>
              <div className="flex items-center gap-1.5 text-sm">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-350 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">{product.rating}</span>
                <span className="text-slate-400">({totalReviews} reviews)</span>
              </div>
              
              {/* Stock status indicator */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                product.inStock
                  ? 'bg-emerald-550 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-100 dark:border-rose-500/25'
              }`}>
                <span className={`h-2 w-2 rounded-full ${product.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                {product.inStock ? `In Stock (มีจำหน่าย ${product.stock} ชิ้น)` : 'Out of Stock (สินค้าหมด)'}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Pricing Section */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">ราคาพิเศษ</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    ฿{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-slate-400 dark:text-slate-500 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {actualDiscount > 0 && (
                <div className="bg-red-500/10 dark:bg-red-500/20 text-red-500 border border-red-500/20 px-3.5 py-1.5 rounded-xl text-center">
                  <span className="text-xs block font-bold">ประหยัดไป</span>
                  <span className="font-extrabold text-lg">-{actualDiscount}%</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">รายละเอียดสินค้า</h3>
              <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Shop features highlight */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-200 dark:border-slate-800 py-4 my-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-650 dark:text-slate-400">
                <div className="p-2 bg-primary/10 rounded-xl text-primary"><ShieldCheck className="h-5 w-5" /></div>
                <span>รับประกันแท้ 100% (Genuine Guarantee)</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-650 dark:text-slate-400">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500"><Truck className="h-5 w-5" /></div>
                <span>จัดส่งรวดเร็วทันใจ (Fast Shipping)</span>
              </div>
            </div>

          </div>

          {/* Action Box: Quantity + Add to Cart */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Quantity */}
              <div className="flex items-center justify-between border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-2 bg-white dark:bg-slate-950 sm:w-fit gap-8">
                <span className="text-xs font-bold text-slate-400 uppercase sm:hidden">จำนวน</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !product.inStock}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-base font-bold text-slate-900 dark:text-white min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || !product.inStock}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-bold text-white text-base transition-all duration-300 cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 scale-[1.02]'
                    : product.inStock
                      ? 'bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01]'
                      : 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed text-slate-600'
                }`}
              >
                {justAdded ? (
                  <><Check className="h-5 w-5 text-white" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="h-5 w-5" /> Add to Cart (หยิบใส่ตะกร้า)</>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Specifications details */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 mb-16 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            ข้อมูลจำเพาะ (Specifications)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 text-sm">
                <span className="font-semibold text-slate-550 dark:text-slate-400">{key}</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Detail Images Gallery (Vertical list for product presentation) */}
      {product.images && product.images.filter(img => img !== product.image).length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 mb-16 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            รายละเอียดสินค้าเพิ่มเติม (Product Details)
          </h2>
          <div className="flex flex-col items-center gap-6">
            {product.images.filter(img => img !== product.image).map((img, idx) => (
              <div key={img + idx} className="relative w-full max-w-3xl aspect-[16/10] bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center p-2">
                <Image
                  src={img}
                  alt={`${product.name} detail image ${idx + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            สินค้าที่เกี่ยวข้อง (Related Products)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
