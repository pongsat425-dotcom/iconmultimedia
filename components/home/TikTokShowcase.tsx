'use client'

import { useState } from 'react'
import { Play, X, Video } from 'lucide-react'

interface TikTokVideo {
  id: string
  name: string
  description: string
  specs?: Record<string, any>
}

interface TikTokShowcaseProps {
  videos: TikTokVideo[]
}

export default function TikTokShowcase({ videos }: TikTokShowcaseProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  if (!videos || videos.length === 0) return null

  // Extract TikTok video ID from URL
  const getTikTokVideoId = (url: string) => {
    if (!url) return null
    const cleaned = url.trim()
    
    // Match /video/12345
    const videoMatch = cleaned.match(/\/video\/(\d+)/)
    if (videoMatch && videoMatch[1]) return videoMatch[1]
    
    // Match /v/12345
    const vMatch = cleaned.match(/\/v\/(\d+)/)
    if (vMatch && vMatch[1]) return vMatch[1]
    
    // Match embed/12345
    const embedMatch = cleaned.match(/\/embed\/(?:v2\/)?(\d+)/)
    if (embedMatch && embedMatch[1]) return embedMatch[1]
    
    // Match numeric input
    if (/^\d+$/.test(cleaned)) return cleaned
    
    return null
  }

  return (
    <div className="mb-16 mt-6">
      {/* Header section with brand accent */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-rose-500 rounded-full animate-pulse"></span>
            วิดีโอแนะนำจาก TikTok
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
            รับชมรีวิวผลงานการซ่อม ขั้นตอนการดูแลรักษา และวิดีโอแนะนำจากทางร้าน
          </p>
        </div>
        
        <a 
          href="https://www.tiktok.com/@iconmultimedia?is_from_webapp=1&sender_device=pc" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer"
        >
          <Play className="h-4 w-4 fill-current text-rose-500" />
          <span>ติดตามเราบน TikTok</span>
        </a>
      </div>

      {/* Decorative media grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => {
          const rawUrl = vid.specs?.['TikTok URL'] || ''
          const videoId = getTikTokVideoId(rawUrl)
          
          if (!videoId) return null

          return (
            <div 
              key={vid.id}
              onClick={() => setActiveVideoId(videoId)}
              className="group relative bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/30 rounded-3xl p-6 h-64 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
            >
              {/* Animated glow background element */}
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all duration-500" />
              <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500" />

              {/* Top Row: TikTok style badge */}
              <div className="flex items-center justify-between z-10">
                <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase bg-slate-800/80 px-3 py-1.5 rounded-full backdrop-blur-xs">
                  <Video className="h-3 w-3 text-rose-500" />
                  TikTok Video
                </span>
                
                {/* Visual pulse indicator */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              </div>

              {/* Middle Row: Play icon with neon glow */}
              <div className="flex justify-center my-4 z-10">
                <div className="w-14 h-14 bg-white/95 text-slate-900 rounded-full flex items-center justify-center shadow-lg transform scale-100 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                  <Play className="h-6 w-6 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Row: Text content */}
              <div className="space-y-1 z-10">
                <h3 className="font-extrabold text-white text-base group-hover:text-rose-400 transition-colors line-clamp-1">
                  {vid.name}
                </h3>
                {vid.description && (
                  <p className="text-slate-400 text-xs line-clamp-1">
                    {vid.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Modal Player (Standard dynamic modal) */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
