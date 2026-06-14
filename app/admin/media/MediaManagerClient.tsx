'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Copy, Check, Trash2, Upload, Loader2, Images, ExternalLink } from 'lucide-react'
import { useToast } from '@/lib/toast/toast-context'
import { createClient } from '@/utils/supabase/client'
import { deleteMediaFile } from '@/app/actions/media'

interface MediaFile {
  name: string
  id: string
  size: number
  created_at: string
  publicUrl: string
}

interface MediaManagerClientProps {
  initialFiles: MediaFile[]
}

export default function MediaManagerClient({ initialFiles }: MediaManagerClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const { success: toastSuccess, error: toastError } = useToast()

  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedName, setCopiedName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Compress image client-side to WebP (same logic as ImageUpload)
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new window.Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1200 // Higher resolution for media gallery
          const MAX_HEIGHT = 1200
          let width = img.width
          let height = img.height

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
              if (blob) resolve(blob)
              else reject(new Error('Canvas conversion to blob failed'))
            },
            'image/webp',
            0.85 // 85% quality
          )
        }
        img.onerror = (err) => reject(err)
      }
      reader.onerror = (err) => reject(err)
    })
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      toastError('กรุณาเลือกไฟล์ภาพที่ถูกต้อง')
      return
    }

    setUploading(true)
    try {
      // 1. Compress image client-side
      const compressedBlob = await compressImage(file)

      // 2. Upload to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '3600',
        })

      if (error) throw error

      toastSuccess('อัปโหลดไฟล์เข้ารูปภาพเรียบร้อยแล้ว!')
      router.refresh() // Refresh layout server-side data
    } catch (err: any) {
      console.error('Upload failed:', err)
      toastError(err.message || 'ไม่สามารถอัปโหลดไฟล์ภาพได้')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (fileName: string, id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้ออกจากคลัง? การลบนี้จะมีผลทันทีและรูปภาพบนหน้าเว็บที่เรียกใช้ลิงก์นี้จะหายไป')) {
      return
    }

    setDeletingId(id)
    try {
      const res = await deleteMediaFile(fileName)
      if (res.error) {
        toastError(res.error)
      } else {
        toastSuccess('ลบรูปภาพออกจากคลังเรียบร้อยแล้ว!')
        router.refresh()
      }
    } catch (err: any) {
      toastError(err.message || 'เกิดข้อผิดพลาดในการลบไฟล์')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopyLink = (url: string, name: string) => {
    navigator.clipboard.writeText(url)
    setCopiedName(name)
    toastSuccess('คัดลอกลิงก์รูปภาพลงในคลิปบอร์ดแล้ว!')
    setTimeout(() => setCopiedName(null), 2000)
  }

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Images className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Media Gallery
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            คลังเก็บรูปภาพสินค้าและสไลด์แบนเนอร์ทั้งหมดบนระบบ ({initialFiles.length} รูปภาพ)
          </p>
        </div>

        {/* Upload box triggers hidden input */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังอัปโหลด...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                อัปโหลดรูปภาพใหม่
              </>
            )}
          </button>
        </div>
      </div>

      {initialFiles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Images className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">ไม่มีรูปภาพในคลัง</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">เริ่มโดยการอัปโหลดไฟล์ภาพแรกของคุณเข้าระบบ</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4" /> อัปโหลดรูปภาพ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {initialFiles.map((file) => {
            const isCopied = copiedName === file.name
            const isDeleting = deletingId === file.id

            return (
              <div 
                key={file.id} 
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow relative"
              >
                {/* Visual Preview */}
                <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-2 border-b border-slate-100 dark:border-slate-850">
                  <Image
                    src={file.publicUrl}
                    alt={file.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-contain p-2 transition-transform group-hover:scale-105"
                    unoptimized
                  />
                  {/* Actions overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                    <button
                      onClick={() => handleCopyLink(file.publicUrl, file.name)}
                      className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg shadow transition-colors cursor-pointer"
                      title="คัดลอกลิงก์ (Copy Link)"
                    >
                      {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <a
                      href={file.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg shadow transition-colors"
                      title="เปิดดูรูปเต็ม (Open in new tab)"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(file.name, file.id)}
                      disabled={isDeleting}
                      className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow transition-colors cursor-pointer disabled:opacity-50"
                      title="ลบรูปภาพ (Delete)"
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="p-3 space-y-1 bg-white dark:bg-slate-900">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{formatSize(file.size)}</span>
                    <span>
                      {new Date(file.created_at).toLocaleDateString('th-TH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
