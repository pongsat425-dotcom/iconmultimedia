'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Shield, Clock, Phone, ArrowRight, Laptop, Monitor, Wrench, RefreshCw, Printer, Play, X } from 'lucide-react'
import Image from 'next/image'

interface ServiceItem {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price?: number | null
  image?: string
  specs?: Record<string, any>
}

interface RepairsClientProps {
  initialServices: any[]
}

const CATEGORIES = [
  { id: 'All', name: 'บริการทั้งหมด', icon: Wrench },
  { id: 'Laptop', name: 'โน๊ตบุ๊ค / MacBook', icon: Laptop },
  { id: 'Desktop PC', name: 'คอมพิวเตอร์ตั้งโต๊ะ (PC)', icon: Monitor },
  { id: 'Printer', name: 'เครื่องพิมพ์ / ปริ้นเตอร์', icon: Printer }
]

export default function RepairsClient({ initialServices }: RepairsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  // Helper to extract TikTok Video ID from various URL formats
  const getTikTokVideoId = (url: string) => {
    if (!url) return null
    const cleaned = url.trim()
    
    // Match /video/12345
    const videoMatch = cleaned.match(/\/video\/(\d+)/)
    if (videoMatch && videoMatch[1]) return videoMatch[1]
    
    // Match /v/12345
    const vMatch = cleaned.match(/\/v\/(\d+)/)
    if (vMatch && vMatch[1]) return vMatch[1]
    
    // Match embed/12345 or embed/v2/12345
    const embedMatch = cleaned.match(/\/embed\/(?:v2\/)?(\d+)/)
    if (embedMatch && embedMatch[1]) return embedMatch[1]
    
    // Match numeric input
    if (/^\d+$/.test(cleaned)) return cleaned
    
    return null
  }

  // Filter logic
  const filteredServices = initialServices.filter((service) => {
    const specs = service.specs || {}
    const deviceType = specs['Device Type'] || ''
    
    // Category match
    const categoryMatch = 
      selectedCategory === 'All' || 
      deviceType.toLowerCase() === selectedCategory.toLowerCase()

    // Search match
    const searchMatch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviceType.toLowerCase().includes(searchQuery.toLowerCase())

    return categoryMatch && searchMatch
  })

  return (
    <div className="space-y-8">
      {/* Search & Filter Control Panel (Glassmorphic design with subtle glows) */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-7 rounded-3xl shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-700/80 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all duration-300"
              placeholder="ค้นหาบริการซ่อม เช่น เปลี่ยนหัวพิมพ์, เคลียร์ซับหมึก, ซ่อมบอร์ด..."
            />
          </div>

          {/* Categories Tab selector */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl font-bold text-xs sm:text-sm tracking-tight transition-all duration-300 transform cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/25 scale-105 border border-emerald-500/30'
                      : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white hover:scale-102 hover:border-slate-200 dark:hover:border-slate-800'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-transform duration-300 ${isActive ? 'rotate-12' : 'group-hover:rotate-6'}`} />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>

        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-xs">
          <Wrench className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">ไม่พบบริการซ่อมที่ท่านค้นหา</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 text-sm">
            ลองใช้คำค้นอื่น หรือติดต่อสอบถามอาการชำรุดกับทีมช่างของเราโดยตรงเพื่อรับการวินิจฉัยพิเศษ
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer text-sm"
          >
            <RefreshCw className="h-4 w-4" /> แสดงทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const specs = service.specs || {}
            const warranty = specs['Warranty'] || 'N/A'
            const repairTime = specs['Repair Time'] || 'N/A'
            const deviceType = specs['Device Type'] || 'Other'
            const tiktokUrl = specs['TikTok URL'] || ''
            const tiktokVideoId = getTikTokVideoId(tiktokUrl)

            // Pricing calculations
            const hasDiscount = service.original_price && Number(service.original_price) > Number(service.price)

            return (
              <div 
                key={service.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1.5 hover:border-emerald-500/30 dark:hover:border-emerald-400/20 transition-all duration-300 flex flex-col group"
              >
                {/* Service Image / Illustrative Header */}
                <div className="relative aspect-square p-4 bg-white dark:bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center border-b border-slate-100 dark:border-slate-900">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Wrench className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2" />
                      <span className="text-xs text-slate-400">Icon Multimedia Service</span>
                    </div>
                  )}
                  
                  {/* Hover Video Overlay */}
                  {tiktokVideoId && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveVideoId(tiktokVideoId)
                      }}
                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-5"
                    >
                      <div className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white rounded-full p-3.5 shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-rose-600 hover:text-white hover:scale-110">
                        <Play className="h-6 w-6 fill-current text-rose-600 hover:text-white transition-colors" />
                      </div>
                    </button>
                  )}

                  {/* Category Type Badge */}
                  <span className="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/80 border border-emerald-200/40 rounded-full backdrop-blur-xs z-10">
                    {deviceType}
                  </span>

                  {/* TikTok Video Play Badge */}
                  {tiktokVideoId && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setActiveVideoId(tiktokVideoId)
                      }}
                      className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2.5 py-1.2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-full shadow-lg border border-rose-500/30 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                      <Play className="h-3 w-3 fill-current animate-pulse" />
                      <span>ดูวิดีโอผลงาน</span>
                    </button>
                  )}
                </div>

                {/* Service Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {service.name}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Metadata Specs Badges */}
                  <div className="flex flex-wrap items-center gap-3 py-1.5 border-t border-b border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <span>ประกัน {warranty}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      <span>ใช้เวลา {repairTime}</span>
                    </div>
                  </div>

                  {/* Pricing and Action Button */}
                  <div className="flex items-center justify-between pt-2 shrink-0">
                    <div className="flex flex-col">
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                          ฿{Number(service.original_price).toLocaleString()}
                        </span>
                      )}
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                        ฿{Number(service.price).toLocaleString()}
                        <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 ml-1">เริ่มต้น</span>
                      </span>
                    </div>

                    <Link
                      href={`/contact?subject=สนใจบริการซ่อม: ${encodeURIComponent(service.name)}`}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs group-hover:translate-x-0.5 cursor-pointer"
                    >
                      <span>ส่งซ่อม / ติดต่อ</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* TikTok Video Modal */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setActiveVideoId(null)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl w-full max-w-[400px] aspect-[9/16] transition-all transform scale-100 flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoId(null)}
              className="absolute top-4 right-4 bg-slate-900/70 hover:bg-rose-600 text-white p-2.5 rounded-full transition-all z-20 cursor-pointer border border-slate-700/50 hover:scale-105 active:scale-95 shadow-md"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Video Iframe Container */}
            <div className="w-full h-full bg-black flex items-center justify-center relative">
              <iframe
                src={`https://www.tiktok.com/embed/v2/${activeVideoId}`}
                className="w-full h-full border-0 absolute inset-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
