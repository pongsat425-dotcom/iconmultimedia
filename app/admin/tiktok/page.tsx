import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Play, ArrowLeft, Video } from 'lucide-react'
import { createTikTokVideo, updateTikTokVideo } from '@/app/actions/homepage_tiktok'
import DeleteVideoButton from '@/components/admin/DeleteVideoButton'

export const metadata = {
  title: 'Manage Homepage TikTok Videos | Icon Multimedia Admin',
}

export default async function AdminTikTokPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; error?: string }>
}) {
  const params = await searchParams
  const editId = params.edit
  const error = params.error

  const supabase = await createClient()

  // Fetch all homepage TikTok videos
  const { data, error: dbError } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'homepage_tiktok')
    .order('created_at', { ascending: true })

  const videos = data || []

  // If in edit mode, fetch the video details
  let editVideo = null
  if (editId) {
    editVideo = videos.find((v: any) => v.id === editId) || null
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">จัดการวิดีโอ TikTok หน้าแรก</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            จัดการวิดีโอตกแต่ง/รีวิวจาก TikTok เพื่อนำไปแสดงเป็นสื่อตกแต่งบนหน้าแรกของเว็บไซต์
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error === 'missing_url' && 'กรุณากรอกลิ้งค์ TikTok Video URL'}
          {error === 'create_failed' && 'ไม่สามารถเพิ่มวิดีโอได้ กรุณาลองอีกครั้ง'}
          {error === 'update_failed' && 'ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองอีกครั้ง'}
          {error === 'delete_failed' && 'ไม่สามารถลบวิดีโอได้ กรุณาลองอีกครั้ง'}
          {error === 'missing_fields' && 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form (Create or Edit) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="h-5 w-5 text-emerald-500" />
              {editVideo ? 'แก้ไขข้อมูลวิดีโอ' : 'เพิ่มวิดีโอใหม่'}
            </h2>

            <form key={editVideo ? editVideo.id : 'new'} action={editVideo ? updateTikTokVideo : createTikTokVideo} className="space-y-4">
              {editVideo && <input type="hidden" name="id" value={editVideo.id} />}

              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">
                  หัวข้อวิดีโอ / คำโปรย *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editVideo?.name || ''}
                  placeholder="เช่น รีวิวซ่อมปริ้นเตอร์บอร์ดพัง"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">
                  รายละเอียดสั้นๆ (แสดงใต้คลิป)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  defaultValue={editVideo?.description || ''}
                  placeholder="เช่น อาการยอดฮิตพร้อมขั้นตอนการแก้ไขเสร็จในวันเดียว..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="tiktokUrl" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">
                  TikTok Video URL *
                </label>
                <input
                  id="tiktokUrl"
                  name="tiktokUrl"
                  type="url"
                  required
                  defaultValue={editVideo?.specs?.['TikTok URL'] || ''}
                  placeholder="เช่น https://www.tiktok.com/@username/video/..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  สามารถคัดลอกจากเบราว์เซอร์หรือใช้ลิ้งค์สั้นมือถือ เช่น vt.tiktok.com/xxxxxx ได้
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer text-center"
                >
                  {editVideo ? 'บันทึกการแก้ไข' : 'เพิ่มลงหน้าแรก'}
                </button>
                {editVideo && (
                  <Link
                    href="/admin/tiktok"
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors"
                  >
                    ยกเลิก
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: List of existing TikTok videos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">รายการวิดีโอแนะนำหน้าแรก ({videos.length})</h2>

            {videos.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                ยังไม่มีวิดีโอแนะนำหน้าแรกในระบบ
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((vid: any) => {
                  const rawUrl = vid.specs?.['TikTok URL'] || ''
                  
                  // Extract video id to render a tiny preview
                  const videoMatch = rawUrl.match(/\/video\/(\d+)/)
                  const videoId = videoMatch ? videoMatch[1] : null

                  return (
                    <div
                      key={vid.id}
                      className="border border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 p-4 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{vid.name}</h3>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                            <Play className="h-2.5 w-2.5 fill-current" />
                            TikTok
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{vid.description || 'ไม่มีคำบรรยาย'}</p>
                        
                        {videoId ? (
                          <div className="aspect-[9/16] w-full max-w-[150px] mx-auto rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-black mt-2">
                            <iframe
                              src={`https://www.tiktok.com/embed/v2/${videoId}`}
                              className="w-full h-full border-0 scale-95"
                              allow="encrypted-media"
                            />
                          </div>
                        ) : (
                          <div className="h-24 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                            (ไม่สามารถประมวลผลลิ้งค์เพื่อพรีวิวได้)
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[180px]" title={rawUrl}>
                          {rawUrl}
                        </div>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/tiktok?edit=${vid.id}`}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                          
                          <DeleteVideoButton id={vid.id} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
