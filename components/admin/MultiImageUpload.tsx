'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

interface MultiImageUploadProps {
  defaultValue?: string[]
  name?: string
  label?: string
}

export default function MultiImageUpload({
  defaultValue = [],
  name = 'images',
  label = 'Product Detail Images (optional)'
}: MultiImageUploadProps) {
  const [imagesSrc, setImagesSrc] = useState<string[]>(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Gallery states
  const [showGallery, setShowGallery] = useState(false)
  const [galleryFiles, setGalleryFiles] = useState<{ name: string; publicUrl: string }[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Use JSON.stringify to compare values instead of array reference identities.
  // This prevents infinite loops when default empty arrays or inline arrays are passed.
  const defaultValueString = JSON.stringify(defaultValue)

  useEffect(() => {
    try {
      const parsed = JSON.parse(defaultValueString)
      if (Array.isArray(parsed)) {
        setImagesSrc(parsed)
      }
    } catch (e) {
      console.error('Failed to parse defaultValueString:', e)
    }
  }, [defaultValueString])


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

    setUploading(true)
    setErrorMsg('')

    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) {
          continue
        }

        // 1. Compress image client-side to WebP
        const compressedBlob = await compressImage(file)

        // 2. Upload to Supabase Storage
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`
        const { error } = await supabase.storage
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

        uploadedUrls.push(publicUrl)
      }

      setImagesSrc((prev) => [...prev, ...uploadedUrls])
    } catch (err: any) {
      console.error('Multiple upload failed:', err)
      setErrorMsg(err.message || 'Failed to upload some images. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (indexToRemove: number) => {
    setImagesSrc((prev) => prev.filter((_, idx) => idx !== indexToRemove))
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
    if (!imagesSrc.includes(url)) {
      setImagesSrc((prev) => [...prev, url])
    }
    setShowGallery(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => {
            setShowGallery(true)
            fetchGalleryFiles()
          }}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-450 dark:hover:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          เลือกจากคลังรูปภาพที่มีอยู่
        </button>
      </div>

      {/* Hidden field containing the serialized images JSON array for form submission */}
      <input type="hidden" name={name} value={JSON.stringify(imagesSrc)} />

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {imagesSrc.map((src, index) => (
          <div
            key={src + index}
            className="relative aspect-square bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group shadow-sm flex items-center justify-center"
          >
            <Image
              src={src}
              alt={`Product preview ${index + 1}`}
              fill
              className="object-contain p-2"
              unoptimized
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Upload Trigger Button Box */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary/70 rounded-xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 text-primary animate-spin mb-1" />
              <span className="text-[10px] font-medium text-slate-500">Uploading...</span>
            </>
          ) : (
            <>
              <Plus className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors mb-1" />
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
                เพิ่มรูปภาพย่อย
              </span>
            </>
          )}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {errorMsg && (
        <p className="text-xs text-rose-500 mt-1 font-medium">{errorMsg}</p>
      )}

      {/* Gallery Selector Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setShowGallery(false)}
          />

          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  เลือกจากคลังรูปภาพ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  คลิกที่รูปภาพเพื่อเลือกรูปภาพมาใช้เป็นรูปประกอบ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 min-h-[350px] max-h-[60vh]">
              {loadingGallery ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                  <span className="text-xs font-semibold">
                    กำลังโหลดคลังรูปภาพ...
                  </span>
                </div>
              ) : galleryFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <span className="text-sm font-semibold">
                    ไม่มีรูปภาพในคลังในขณะนี้
                  </span>
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
                      <span
                        className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1 text-center font-medium"
                        title={file.name}
                      >
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
