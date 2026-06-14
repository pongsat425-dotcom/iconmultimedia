'use client'

import { useState, useMemo } from 'react'
import { 
  Sliders, Save, Loader2, Eye, EyeOff, Info, Search, 
  Sparkles, RefreshCw, Layers, CheckSquare, Square, 
  Laptop, Monitor, Cpu, HardDrive, Printer, Tv, Zap, Wind, 
  Keyboard, Headphones, Wifi, HelpCircle 
} from 'lucide-react'
import { updateHomepageSettings } from '@/app/actions/settings'
import { useToast } from '@/lib/toast/toast-context'
import { CATEGORY_LIST } from '@/lib/mock-data'

interface HomepageSectionsClientProps {
  initialSettings: {
    show_new_arrivals: boolean
    show_best_sellers: boolean
    visible_categories: string[]
  }
}

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

export default function HomepageSectionsClient({ initialSettings }: HomepageSectionsClientProps) {
  const [showNewArrivals, setShowNewArrivals] = useState(initialSettings.show_new_arrivals)
  const [showBestSellers, setShowBestSellers] = useState(initialSettings.show_best_sellers)
  const [visibleCategories, setVisibleCategories] = useState<string[]>(initialSettings.visible_categories)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { success, error } = useToast()

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return CATEGORY_LIST.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleToggleCategory = (slug: string) => {
    setVisibleCategories(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug) 
        : [...prev, slug]
    )
  }

  const handleToggleAllCategories = (enable: boolean) => {
    if (enable) {
      setVisibleCategories(CATEGORY_LIST.map(c => c.slug))
    } else {
      setVisibleCategories([])
    }
  }

  const handleInvertSelection = () => {
    setVisibleCategories(prev => 
      CATEGORY_LIST.map(c => c.slug).filter(slug => !prev.includes(slug))
    )
  }

  const handleReset = () => {
    setShowNewArrivals(initialSettings.show_new_arrivals)
    setShowBestSellers(initialSettings.show_best_sellers)
    setVisibleCategories(initialSettings.visible_categories)
    success('รีเซ็ตการตั้งค่ากลับเป็นค่าดั้งเดิมแล้ว')
  }

  const handleSave = async () => {
    setLoading(true)
    const result = await updateHomepageSettings({
      show_new_arrivals: showNewArrivals,
      show_best_sellers: showBestSellers,
      visible_categories: visibleCategories
    })

    if (result?.error) {
      error(result.error)
    } else {
      success('บันทึกการตั้งค่าการแสดงผลหน้าแรกเรียบร้อยแล้ว')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-500">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-widest bg-primary/5 dark:bg-primary/10 px-3 py-1.5 rounded-full w-fit mb-2">
            <Sparkles className="h-3 w-3" />
            Admin Settings Surface
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="h-7 w-7 text-primary" />
            Homepage Sections Layout
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            สลับเปิด-ปิด ดึงเซกชัน และปรับปรุงหน้าร้านค้าออนไลน์ให้ตอบโจทย์แคมเปญ
          </p>
        </div>
        
        {/* Actions Button Group */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50 select-none shadow-sm"
            title="Reset to initial values"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            รีเซ็ตค่าเดิม
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/20 hover:shadow-primary/30 disabled:opacity-75 relative overflow-hidden group select-none"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> กำลังบันทึก...</>
            ) : (
              <><Save className="h-4 w-4" /> บันทึกการตั้งค่า</>
            )}
          </button>
        </div>
      </div>

      {/* Info Alert Box */}
      <div className="bg-slate-900/5 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-3 text-sm text-slate-700 dark:text-slate-350 shadow-inner">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">การจัดการ Layout หน้าแรก</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            คุณสามารถเลือกปิดฟิลด์ที่ไม่ต้องการแสดงชั่วคราวได้ การตั้งค่านี้จะปรับแต่งหน้าสรุปสินค้าและโครงหมวดหมู่ของหน้าร้านหลักแบบเรียลไทม์ โดยหน้าจอฝั่งขวาจะแสดงจำลอง (Mockup Preview) ให้เห็นผลลัพธ์ทันที
          </p>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Setup Forms (7/12 size) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Core Toggles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
            
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <span>เซกชันหลักของร้านค้า (Core Sections)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Arrivals Toggle */}
              <div 
                onClick={() => setShowNewArrivals(!showNewArrivals)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between h-28 select-none ${
                  showNewArrivals 
                    ? 'bg-slate-50/80 dark:bg-slate-950/20 border-primary shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 opacity-60 hover:opacity-90 hover:border-slate-350'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">New Arrivals</h3>
                    <p className="text-[10px] text-slate-400">แสดงรายการสินค้ามาใหม่ล่าสุด</p>
                  </div>
                  <span className={`p-1.5 rounded-lg ${showNewArrivals ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {showNewArrivals ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </span>
                </div>
                
                {/* Toggle Pill */}
                <div className="flex justify-end">
                  <div className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out ${
                    showNewArrivals ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                      showNewArrivals ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              </div>

              {/* Best Sellers Toggle */}
              <div 
                onClick={() => setShowBestSellers(!showBestSellers)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between h-28 select-none ${
                  showBestSellers 
                    ? 'bg-slate-50/80 dark:bg-slate-950/20 border-primary shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 opacity-60 hover:opacity-90 hover:border-slate-350'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Best Sellers</h3>
                    <p className="text-[10px] text-slate-400">แสดงสินค้าขายดีจากการรีวิวสูงสุด</p>
                  </div>
                  <span className={`p-1.5 rounded-lg ${showBestSellers ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {showBestSellers ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </span>
                </div>
                
                {/* Toggle Pill */}
                <div className="flex justify-end">
                  <div className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out ${
                    showBestSellers ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                      showBestSellers ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Category Switches */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 relative">
            
            {/* Title & Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                หมวดหมู่การแสดงผลย่อย (Category Showcase)
              </h2>
              
              {/* Quick Actions Buttons */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => handleToggleAllCategories(true)}
                  className="inline-flex items-center gap-1 text-primary hover:underline hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <CheckSquare className="h-3.5 w-3.5" /> เปิดทั้งหมด
                </button>
                <span className="text-slate-200 dark:text-slate-800">|</span>
                <button
                  onClick={() => handleToggleAllCategories(false)}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 hover:underline hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Square className="h-3.5 w-3.5" /> ปิดทั้งหมด
                </button>
                <span className="text-slate-200 dark:text-slate-800">|</span>
                <button
                  onClick={handleInvertSelection}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-primary hover:underline hover:scale-[1.02] transition-all cursor-pointer"
                >
                  สลับตัวเลือก
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาหมวดหมู่ เช่น Laptops, GPU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-400"
              />
            </div>

            {/* Category Items List */}
            {filteredCategories.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-950/10">
                <p className="text-xs text-slate-400">ไม่พบหมวดหมู่สินค้า &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredCategories.map((category) => {
                  const isVisible = visibleCategories.includes(category.slug)
                  const Icon = CATEGORY_ICONS[category.slug] || Cpu
                  return (
                    <div
                      key={category.slug}
                      onClick={() => handleToggleCategory(category.slug)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none group ${
                        isVisible
                          ? 'bg-emerald-500/[0.03] border-emerald-500/35 hover:border-emerald-500/50 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 opacity-60 hover:opacity-90 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-all ${
                          isVisible 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 scale-105 shadow-sm' 
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500'
                        }`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block transition-colors group-hover:text-primary">
                            {category.name}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-mono">
                            {category.slug}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleCategory(category.slug)
                        }}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          isVisible ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            isVisible ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="pt-3 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>หมวดหมู่ทั้งหมด: <strong>{visibleCategories.length}</strong> จาก {CATEGORY_LIST.length} ส่วน</span>
            </div>
          </div>
        </div>

        {/* Right Side: Live Mockup Preview (5/12 size) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden space-y-4 relative">
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              Live Preview
            </div>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                หน้าแรกจำลอง (Home Mockup)
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">
                การจำลองการจัดเรียงเซกชันและลำดับการเปิดหน้าจอจริง
              </p>
            </div>

            {/* Simulated Mobile Mockup Screen */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 max-h-[500px] overflow-y-auto select-none scrollbar-thin scrollbar-thumb-slate-800">
              
              {/* Header Bar */}
              <div className="h-6 bg-slate-900 rounded-lg flex items-center justify-between px-3 border border-slate-800/60">
                <span className="text-[9px] font-bold text-slate-400">🌐 Icon Multimedia</span>
                <span className="text-[8px] text-slate-500">🛒 Cart (0)</span>
              </div>

              {/* Slider Showcase (Always Visible) */}
              <div className="h-14 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-0.5">
                  <p className="text-[8px] uppercase tracking-widest text-emerald-500 font-bold">Slide Display</p>
                  <p className="text-[9px] text-slate-300 font-semibold">⚡ Hero Banner Slider</p>
                </div>
              </div>

              {/* Category Grid Indicator (Always Visible) */}
              <div className="h-10 bg-slate-900/50 rounded-lg border border-slate-800/60 flex items-center justify-center">
                <span className="text-[9px] text-slate-500">📂 Categories Showcase Circle Grid</span>
              </div>

              {/* Dynamic Section: New Arrivals */}
              <div className={`p-3 rounded-lg border transition-all duration-350 flex items-center justify-between ${
                showNewArrivals
                  ? 'bg-slate-900/80 border-primary/40 text-slate-200'
                  : 'bg-slate-950/20 border-slate-900/80 text-slate-600 opacity-25 line-through'
              }`}>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold">🆕 NEW ARRIVALS</p>
                  <p className="text-[8px] text-slate-500">แสดงรายการสินค้ามาใหม่ 5 รายการแรก</p>
                </div>
                <span className="text-[8px] font-bold uppercase">{showNewArrivals ? 'Active' : 'Hidden'}</span>
              </div>

              {/* Dynamic Section: Best Sellers */}
              <div className={`p-3 rounded-lg border transition-all duration-350 flex items-center justify-between ${
                showBestSellers
                  ? 'bg-slate-900/80 border-primary/40 text-slate-200'
                  : 'bg-slate-950/20 border-slate-900/80 text-slate-600 opacity-25 line-through'
              }`}>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold">🔥 BEST SELLERS</p>
                  <p className="text-[8px] text-slate-500">แสดงสินค้าขายดีตามรีวิว 5 รายการแรก</p>
                </div>
                <span className="text-[8px] font-bold uppercase">{showBestSellers ? 'Active' : 'Hidden'}</span>
              </div>

              {/* Category Showcases Dynamic Loop */}
              <div className="space-y-1.5 pt-1 border-t border-slate-900">
                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Category Rows</p>
                
                {CATEGORY_LIST.map((c) => {
                  const isCatVisible = visibleCategories.includes(c.slug)
                  return (
                    <div 
                      key={c.slug}
                      className={`py-1.5 px-3 rounded-md border text-[8px] flex items-center justify-between transition-all ${
                        isCatVisible
                          ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                          : 'bg-slate-950/20 border-slate-900/80 text-slate-700 opacity-15'
                      }`}
                    >
                      <span className="font-medium">📦 {c.name} Grid</span>
                      <span className="font-mono text-[7px] text-slate-500">{isCatVisible ? 'แสดง' : 'ซ่อน'}</span>
                    </div>
                  )
                })}
              </div>

              {/* TikTok Showcase (Always Visible) */}
              <div className="h-10 bg-slate-900/50 rounded-lg border border-slate-800/60 flex items-center justify-center">
                <span className="text-[9px] text-slate-500">🎬 TikTok Video Showcase Section</span>
              </div>

              {/* Empty State Mock */}
              {!showNewArrivals && !showBestSellers && visibleCategories.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-red-500/20 rounded-lg bg-red-500/[0.02]">
                  <p className="text-[10px] text-rose-400 font-bold">⚠️ Warning: Homepage is Empty!</p>
                  <p className="text-[8px] text-slate-500 mt-1">ไม่มีข้อมูลหมวดหมู่สินค้าแสดงผลเลยในหน้าร้านค้าออนไลน์</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
