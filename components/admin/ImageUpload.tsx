'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

interface ImageUploadProps {
  defaultValue?: string
  name?: string
  label?: string
}

export default function ImageUpload({ defaultValue = '', name = 'image', label = 'Product Image *' }: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Gallery states
  const [showGallery, setShowGallery] = useState(false)
  const [galleryFiles, setGalleryFiles] = useState<{ name: string; publicUrl: string }[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    setImageSrc(defaultValue)
  }, [defaultValue])

  // Compress and resize image using HTML5 Canvas
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new window.Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          // Maintain aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Canvas context could not be created'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Canvas conversion to blob failed'))
              }
            },
            'image/webp',
            0.82 // 82% quality compression
          )
        }
        img.onerror = (err) => reject(err)
      }
      reader.onerror = (err) => reject(err)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file.')
      return
    }

    setUploading(true)
    setErrorMsg('')

    try {
      // 1. Compress image client-side to WebP
      const compressedBlob = await compressImage(file)

      // 2. Upload to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '3600',
        })

      if (error) {
        throw error
      }

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      setImageSrc(publicUrl)
    } catch (err: any) {
      console.error('Upload failed:', err)
      setErrorMsg(err.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setImageSrc('')
    setErrorMsg('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const fetchGalleryFiles = async () => {
    try {
      setLoadingGallery(true)
      const { data, error } = await supabase.storage
        .from('product-images')
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        })
      if (error) throw error

      const files = (data ?? [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(f.name)
          return {
            name: f.name,
            publicUrl
          }
        })
      setGalleryFiles(files)
    } catch (e) {
      console.error('Failed to fetch gallery files:', e)
      setErrorMsg('ไม่สามารถดึงข้อมูลจากคลังรูปภาพได้')
    } finally {
      setLoadingGallery(false)
    }
  }

  const handleSelectFromGallery = (url: string) => {
    setImageSrc(url)
    setShowGallery(false)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {/* Image input container */}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {imageSrc ? (
          // Preview Container
          <div className="relative w-40 h-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group shadow-sm flex items-center justify-center">
            <Image
              src={imageSrc}
              alt="Product preview"
              fill
              className="object-contain p-2"
              unoptimized
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          // Upload Placeholder Box
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-40 h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary/70 rounded-xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                <span className="text-xs font-medium text-slate-500">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors mb-2" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">Upload WebP</span>
                <span className="text-[10px] text-slate-400 mt-1">Max 5MB (auto compress)</span>
              </>
            )}
          </button>
        )}

        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {imageSrc ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-primary hover:text-primary-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Change Image
                </button>
                <span className="text-slate-300 dark:text-slate-700 text-xs">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowGallery(true)
                    fetchGalleryFiles()
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-450 dark:hover:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  เลือกจากคลังรูปภาพ
                </button>
              </div>
              <p className="text-[10px] text-slate-500 max-w-xs break-all">
                URL: {imageSrc}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  อัปโหลดรูปภาพใหม่จากอุปกรณ์ของคุณ
                </p>
                <p className="text-[10px] text-slate-450 mt-0.5">
                  ระบบจะบีบอัดและแปลงเป็นฟอร์แมต WebP ที่มีขนาดเบาโดยอัตโนมัติ
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setShowGallery(true)
                  fetchGalleryFiles()
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-450 dark:hover:text-emerald-400 hover:underline border border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                หรือ เลือกจากคลังรูปภาพระบบ
              </button>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-rose-500 mt-1 font-medium">
              {errorMsg}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          หรือระบุที่อยู่ลิงก์รูปภาพ (Image URL / Local Path)
        </label>
        <input
          type="text"
          name={name}
          value={imageSrc}
          onChange={(e) => setImageSrc(e.target.value)}
          placeholder="เช่น /images/hero/banner-thai.webp หรือลิงก์ภายนอก https://..."
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Gallery Selector Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setShowGallery(false)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">เลือกจากคลังรูปภาพ (Select from Gallery)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">คลิกที่รูปภาพเพื่อเลือกรูปภาพมาใช้งาน</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowGallery(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 min-h-[350px] max-h-[60vh]">
              {loadingGallery ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                  <span className="text-xs font-semibold">กำลังโหลดคลังรูปภาพ...</span>
                </div>
              ) : galleryFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <span className="text-sm font-semibold">ไม่มีรูปภาพในคลังในขณะนี้</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {galleryFiles.map((file) => (
                    <div 
                      key={file.publicUrl}
                      onClick={() => handleSelectFromGallery(file.publicUrl)}
                      className="group flex flex-col cursor-pointer border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 p-2 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-square w-full bg-white dark:bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-850">
                        <img 
                          src={file.publicUrl} 
                          alt={file.name} 
                          className="object-contain w-full h-full p-1 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1 text-center font-medium" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
