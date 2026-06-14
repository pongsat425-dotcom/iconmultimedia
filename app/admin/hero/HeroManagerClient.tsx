'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Plus, Edit, Trash2, X, Sliders, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/lib/toast/toast-context'
import ImageUpload from '@/components/admin/ImageUpload'
import { upsertHeroSlide, deleteHeroSlide } from '@/app/actions/hero'

interface DBHeroSlide {
  id: string
  title: string | null
  subtitle: string | null
  description: string | null
  button_text_1: string | null
  button_link_1: string | null
  button_text_2: string | null
  button_link_2: string | null
  image_url: string
  order_index: number
  created_at?: string
}

interface HeroManagerClientProps {
  initialSlides: DBHeroSlide[]
}

export default function HeroManagerClient({ initialSlides }: HeroManagerClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { error: toastError } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlide, setSelectedSlide] = useState<DBHeroSlide | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Handle errors from query params
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      let message = 'An error occurred'
      if (errorParam === 'missing_image') message = 'Please upload a slide image'
      else if (errorParam === 'update_failed') message = 'Failed to update the slide'
      else if (errorParam === 'create_failed') message = 'Failed to create the slide'
      else if (errorParam === 'missing_id') message = 'Slide ID is missing'
      else if (errorParam === 'delete_failed') message = 'Failed to delete the slide'
      
      toastError(message)
      // Clean query params
      router.replace('/admin/hero')
    }
  }, [searchParams, toastError, router])

  const handleOpenAddModal = () => {
    setSelectedSlide(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (slide: DBHeroSlide) => {
    setSelectedSlide(slide)
    setIsModalOpen(true)
  }

  const handleFormSubmit = () => {
    setSubmitting(true)
    // The server action redirects on success or failure, which triggers router changes.
    // Close modal after submission starts.
    setTimeout(() => {
      setIsModalOpen(false)
      setSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Hero Slides
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage slide show banners on the storefront homepage ({initialSlides.length} slides)
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Slide
        </button>
      </div>

      {initialSlides.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <ImageIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No slides yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Create slides to replace default banner images.</p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialSlides.map((slide) => {
            const hasContent = slide.title || slide.description
            return (
              <div 
                key={slide.id} 
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow"
              >
                {/* Image Preview Container */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                  {slide.image_url ? (
                    <Image
                      src={slide.image_url}
                      alt={slide.title || 'Hero Banner'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-slate-400" />
                  )}
                  {/* Order Index Badge */}
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
                    Order: {slide.order_index}
                  </span>
                  {/* Style Indicator */}
                  <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    hasContent 
                      ? 'bg-emerald-500/80 text-white border-emerald-400/20' 
                      : 'bg-blue-500/80 text-white border-blue-400/20'
                  }`}>
                    {hasContent ? 'Text Overlay' : 'Image Only'}
                  </span>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {slide.subtitle && (
                      <span className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                        {slide.subtitle}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                      {slide.title || <span className="text-slate-400 dark:text-slate-600 italic">No Title</span>}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {slide.description || <span className="text-slate-400 dark:text-slate-600 italic">No description</span>}
                    </p>
                  </div>

                  {/* Buttons Info */}
                  {(slide.button_text_1 || slide.button_text_2) && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {slide.button_text_1 && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">CTA 1:</span>
                          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                            {slide.button_text_1}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="truncate max-w-[120px] font-mono">{slide.button_link_1}</span>
                        </div>
                      )}
                      {slide.button_text_2 && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">CTA 2:</span>
                          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                            {slide.button_text_2}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="truncate max-w-[120px] font-mono">{slide.button_link_2}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditModal(slide)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit Slide
                    </button>

                    <form 
                      action={deleteHeroSlide}
                      onSubmit={(e) => {
                        if (!confirm('Are you sure you want to delete this slide?')) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={slide.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Slide Edit/Add Drawer/Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-emerald-600" />
                {selectedSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form 
              key={selectedSlide?.id || 'new'}
              action={upsertHeroSlide}
              onSubmit={handleFormSubmit}
              className="p-6 space-y-4 flex-1"
            >
              {selectedSlide?.id && <input type="hidden" name="id" value={selectedSlide.id} />}

              {/* Title, Subtitle, description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Title (Main Heading)
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={selectedSlide?.title || ''}
                    className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. Next-Gen Computing Power"
                  />
                </div>
                <div>
                  <label htmlFor="subtitle" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Subtitle (Badge Title)
                  </label>
                  <input
                    id="subtitle"
                    name="subtitle"
                    type="text"
                    defaultValue={selectedSlide?.subtitle || ''}
                    className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. Mega Sale 2026"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Description Text
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  defaultValue={selectedSlide?.description || ''}
                  className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Slide description text here..."
                />
              </div>

              {/* Call-to-Action Button 1 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                  Primary Action Button (Button 1)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="buttonText1" className="block text-[10px] text-slate-400 font-medium mb-1">
                      Button Text
                    </label>
                    <input
                      id="buttonText1"
                      name="buttonText1"
                      type="text"
                      defaultValue={selectedSlide?.button_text_1 || ''}
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. ช้อปเลย"
                    />
                  </div>
                  <div>
                    <label htmlFor="buttonLink1" className="block text-[10px] text-slate-400 font-medium mb-1">
                      Button Link URL (ลิงก์หลัก / คลิกที่รูปแบนเนอร์แล้วไปหน้านี้)
                    </label>
                    <input
                      id="buttonLink1"
                      name="buttonLink1"
                      type="text"
                      defaultValue={selectedSlide?.button_link_1 || ''}
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. /shop"
                    />
                  </div>
                </div>
              </div>

              {/* Call-to-Action Button 2 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                  Secondary Action Button (Button 2)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="buttonText2" className="block text-[10px] text-slate-400 font-medium mb-1">
                      Button Text
                    </label>
                    <input
                      id="buttonText2"
                      name="buttonText2"
                      type="text"
                      defaultValue={selectedSlide?.button_text_2 || ''}
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. ติดต่อ"
                    />
                  </div>
                  <div>
                    <label htmlFor="buttonLink2" className="block text-[10px] text-slate-400 font-medium mb-1">
                      Button Link URL
                    </label>
                    <input
                      id="buttonLink2"
                      name="buttonLink2"
                      type="text"
                      defaultValue={selectedSlide?.button_link_2 || ''}
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g. /contact"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="orderIndex" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Display Order Index
                  </label>
                  <input
                    id="orderIndex"
                    name="orderIndex"
                    type="number"
                    min="0"
                    defaultValue={selectedSlide?.order_index ?? 0}
                    required
                    className="w-full px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Image Upload using custom ImageUpload component */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <ImageUpload 
                  defaultValue={selectedSlide?.image_url || ''} 
                  name="image" 
                  label="Slide Image Banner *" 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 font-medium py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary-700 text-white font-medium py-2 px-5 rounded-lg transition-colors text-sm shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
