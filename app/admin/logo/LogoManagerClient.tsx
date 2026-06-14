'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Upload, Check, Loader2, ArrowLeft, Settings, Image as ImageIcon, X } from 'lucide-react'
import { useToast } from '@/lib/toast/toast-context'
import { uploadLogo, setLogoFromGallery } from '@/app/actions/logo'
import { getLogoSettings, updateLogoSettings } from '@/app/actions/settings'
import { createClient } from '@/utils/supabase/client'

export default function LogoManagerClient() {
  const { success: toastSuccess, error: toastError } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cacheBuster, setCacheBuster] = useState<number | null>(null)
  const [currentLogoSrc, setCurrentLogoSrc] = useState('/logo.png')
  const [logoWidth, setLogoWidth] = useState(160)
  const [logoHeight, setLogoHeight] = useState(40)
  const [savingSize, setSavingSize] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gallery states
  const [showGallery, setShowGallery] = useState(false)
  const [galleryFiles, setGalleryFiles] = useState<{ name: string; publicUrl: string }[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)
  const supabase = createClient()

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
        .filter(f => f.name !== '.emptyFolderPlaceholder' && f.name !== 'logo.png')
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
      toastError('ไม่สามารถดึงข้อมูลจากคลังรูปภาพได้')
    } finally {
      setLoadingGallery(false)
    }
  }

  const handleSelectFromGallery = async (fileName: string) => {
    setLoading(true)
    setShowGallery(false)
    try {
      const res = await setLogoFromGallery(fileName)
      if (res.error) {
        toastError(res.error)
      } else {
        toastSuccess('เปลี่ยนโลโก้จากคลังรูปภาพสำเร็จแล้ว!')
        setCacheBuster(Date.now())
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('logo-updated'))
        }
      }
    } catch (err: any) {
      toastError(err.message || 'เกิดข้อผิดพลาดในการตั้งค่าโลโก้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCacheBuster(Date.now())
    async function loadSizeSettings() {
      const size = await getLogoSettings()
      setLogoWidth(size.width)
      setLogoHeight(size.height)
    }
    loadSizeSettings()
  }, [])

  useEffect(() => {
    if (cacheBuster) {
      setCurrentLogoSrc(`https://lpurpvlrcmzwkdmojahy.supabase.co/storage/v1/object/public/product-images/logo.png?t=${cacheBuster}`)
    }
  }, [cacheBuster])

  const handleSaveSize = async () => {
    setSavingSize(true)
    try {
      const res = await updateLogoSettings({ width: logoWidth, height: logoHeight })
      if (res.error) {
        toastError(res.error)
      } else {
        toastSuccess('บันทึกขนาดโลโก้ใหม่สำเร็จแล้ว!')
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('logo-updated'))
        }
      }
    } catch (err: any) {
      toastError(err.message || 'เกิดข้อผิดพลาดในการบันทึกขนาดโลโก้')
    } finally {
      setSavingSize(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const selectedFile = files[0]
    if (!selectedFile.type.startsWith('image/')) {
      toastError('กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง')
      return
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const handleClear = () => {
    setFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('logo', file)

    try {
      const res = await uploadLogo(formData)
      if (res.error) {
        toastError(res.error)
      } else {
        toastSuccess('อัปโหลดโลโก้ใหม่สำเร็จแล้ว!')
        setCacheBuster(Date.now())
        handleClear()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('logo-updated'))
        }
      }
    } catch (err: any) {
      toastError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          Logo Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage and upload your storefront brand logo (stored in Supabase storage for cloud compatibility)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Logo Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-between space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-350 self-start">Current Store Logo</h2>
          
          <div className="relative w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center p-4">
            <Image
              src={currentLogoSrc}
              alt="Current Logo"
              width={logoWidth}
              height={logoHeight}
              className="object-contain dark:brightness-110 transition-all duration-300"
              style={{ height: `${logoHeight}px`, width: `${logoWidth}px` }}
              unoptimized
              onError={() => {
                if (currentLogoSrc !== '/logo.png') {
                  setCurrentLogoSrc('/logo.png')
                }
              }}
            />
          </div>
          
          <p className="text-xs text-slate-500 text-center">
            This logo is displayed in the navigation bar header on all pages.
          </p>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-350">Upload New Logo</h2>
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!file ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400/70 rounded-lg flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-all cursor-pointer group"
              >
                <Upload className="h-8 w-8 text-slate-400 group-hover:text-emerald-500 transition-colors mb-2" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">Select Image File</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, SVG or WebP</span>
              </button>
            ) : (
              <div className="relative w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col items-center justify-center p-4">
                {previewUrl && (
                  <div className="relative w-full h-20 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Logo preview"
                      className="max-h-20 w-auto object-contain"
                      style={{ maxHeight: '80px', width: 'auto' }}
                    />
                  </div>
                )}
                <span className="text-[10px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Ready to upload: {file.name}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {file && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-305 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!file || loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Logo'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Logo Size Settings Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm max-w-xl space-y-5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-355">ปรับขนาดการแสดงผลโลโก้ (Logo Size Settings)</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">ปรับความกว้างและความสูงในการแสดงผลบนแถบนำทางหน้าร้าน สามารถขยับแถบเลื่อนเพื่อดูตัวอย่างด้านบนแบบเรียลไทม์</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
              <span>ความกว้าง: <strong className="text-emerald-600 dark:text-emerald-400">{logoWidth}px</strong></span>
              <span className="text-slate-450">ค่าแนะนำ: 140px - 200px</span>
            </div>
            <input
              type="range"
              min="80"
              max="300"
              value={logoWidth}
              onChange={(e) => setLogoWidth(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-450 mb-1.5">
              <span>ความสูง: <strong className="text-emerald-600 dark:text-emerald-400">{logoHeight}px</strong></span>
              <span className="text-slate-450">ค่าแนะนำ: 30px - 60px</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={logoHeight}
              onChange={(e) => setLogoHeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={handleSaveSize}
          disabled={savingSize}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {savingSize ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              กำลังบันทึกขนาดโลโก้...
            </>
          ) : (
            'บันทึกขนาดโลโก้'
          )}
        </button>
      </div>

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
                  เลือกโลโก้จากคลังรูปภาพ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  คลิกที่รูปภาพเพื่อบันทึกตั้งเป็นโลโก้ของระบบร้านค้า
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
                      onClick={() => handleSelectFromGallery(file.name)}
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
