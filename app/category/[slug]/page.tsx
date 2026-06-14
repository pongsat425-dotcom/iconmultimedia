import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Laptop, Monitor, Cpu, HardDrive, Printer, Layers, Tv, Zap, Wind, Keyboard, Headphones, Wifi } from 'lucide-react'
import ProductCard from '@/components/home/ProductCard'
import { getProductsByCategory } from '@/lib/supabase/queries'
import { CATEGORY_LIST } from '@/lib/mock-data'

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  laptops: Laptop,
  desktops: Monitor,
  components: Cpu,
  'external-devices': HardDrive,
  printers: Printer,
  mainboard: Layers,
  ram: Cpu,
  storage: HardDrive,
  gpu: Tv,
  'power-supply': Zap,
  cooling: Wind,
  monitor: Monitor,
  keyboard: Keyboard,
  headset: Headphones,
  router: Wifi,
}

const CATEGORY_COLORS: Record<string, string> = {
  laptops: 'bg-blue-500',
  desktops: 'bg-emerald-500',
  components: 'bg-purple-500',
  'external-devices': 'bg-rose-500',
  printers: 'bg-cyan-500',
  mainboard: 'bg-indigo-500',
  ram: 'bg-teal-500',
  storage: 'bg-slate-500',
  gpu: 'bg-orange-500',
  'power-supply': 'bg-yellow-500',
  cooling: 'bg-sky-500',
  monitor: 'bg-emerald-600',
  keyboard: 'bg-pink-500',
  headset: 'bg-purple-500',
  router: 'bg-rose-500',
}

function getCategoryBySlug(slug: string) {
  return CATEGORY_LIST.find(c => c.slug === slug)
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  const products = await getProductsByCategory(slug)
  const Icon = CATEGORY_ICONS[slug] || Cpu

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Category Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">The category you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/shop" className="text-primary font-medium hover:text-primary-700">
          Browse all products →
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 dark:text-white font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className={`w-16 h-16 rounded-2xl ${CATEGORY_COLORS[slug] || 'bg-slate-500'} text-white flex items-center justify-center shadow-lg`}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{category.name}</h1>
          {category.description && (
            <p className="text-slate-500 dark:text-slate-400 mt-1">{category.description}</p>
          )}
        </div>
        <span className="ml-auto text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full font-medium">
          {products.length} products
        </span>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400 mb-4">No products found in this category.</p>
          <Link href="/shop" className="text-primary font-medium hover:text-primary-700">
            Browse all products →
          </Link>
        </div>
      )}

      {/* Other Categories */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Other Categories</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_LIST.filter(c => c.slug !== slug).map(cat => {
            const CatIcon = CATEGORY_ICONS[cat.slug] || Cpu
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <CatIcon className="h-4 w-4" />
                {cat.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
