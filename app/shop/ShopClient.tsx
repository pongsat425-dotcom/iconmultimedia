'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { SlidersHorizontal, ChevronDown, X, Search } from 'lucide-react'
import ProductCard from '@/components/home/ProductCard'
import type { Product } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Category {
  id: string
  slug: string
  name: string
  description?: string
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'ใหม่ล่าสุด' },
  { value: 'price-asc', label: 'ราคา: ต่ำไปสูง' },
  { value: 'price-desc', label: 'ราคา: สูงไปต่ำ' },
  { value: 'bestselling', label: 'สินค้าขายดี' },
  { value: 'rating', label: 'คะแนนเฉลี่ยสูงสุด' },
]

const ITEMS_PER_PAGE = 12

function ShopContent({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams()
  const initialSort = searchParams.get('sort') || 'newest'
  const initialCategory = searchParams.get('category') || ''
  const initialQuery = searchParams.get('q') || ''

  const [sort, setSort] = useState(initialSort)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock)
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'bestselling':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    return filtered
  }, [products, searchQuery, selectedCategory, inStockOnly, sort])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <span className="w-2 h-10 bg-primary rounded-full"></span>
          สินค้าทั้งหมด
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          พบสินค้าทั้งหมด {filteredProducts.length} รายการ
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">ค้นหา</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                  placeholder="ค้นหาชื่อสินค้า แบรนด์..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">หมวดหมู่สินค้า</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(''); setPage(1) }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  หมวดหมู่ทั้งหมด
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => { setSelectedCategory(cat.slug); setPage(1) }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => { setInStockOnly(e.target.checked); setPage(1) }}
                  className="w-4 h-4 text-primary border-slate-300 dark:border-slate-600 rounded focus:ring-primary"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">แสดงเฉพาะสินค้าที่มีของ</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Top bar: sort + mobile filter button */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              ตัวกรอง
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-slate-500 hidden sm:inline">เรียงตาม:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active filters */}
          {(selectedCategory || searchQuery || inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-slate-500">ตัวกรอง:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {categories.find(c => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  มีสินค้าในสต็อก
                  <button onClick={() => setInStockOnly(false)}><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">ไม่พบสินค้าที่ตรงตามเงื่อนไข</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">ลองปรับเปลี่ยนตัวเลือกตัวกรองหรือล้างตัวกรองทั้งหมด</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); setInStockOnly(false) }}
                className="text-sm font-medium text-primary hover:text-primary-700"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ก่อนหน้า
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${p === page ? 'bg-primary text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ถัดไป
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 p-6 overflow-y-auto shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">ตัวกรองสินค้า</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">ค้นหา</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                placeholder="ค้นหาชื่อสินค้า แบรนด์..."
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">หมวดหมู่</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(''); setPage(1) }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${!selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  หมวดหมู่ทั้งหมด
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => { setSelectedCategory(cat.slug); setPage(1) }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <label className="flex items-center gap-2 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => { setInStockOnly(e.target.checked); setPage(1) }}
                className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">แสดงเฉพาะสินค้าที่มีของ</span>
            </label>

            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-primary-700 transition-colors"
            >
              ใช้ตัวกรอง
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ShopClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48 mx-auto" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ShopContent products={products} categories={categories} />
    </Suspense>
  )
}
