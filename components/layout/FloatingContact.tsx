'use client'

import { useState } from 'react'
import { MessageCircle, Phone, X, HelpCircle, FileText } from 'lucide-react'
import Link from 'next/link'

// Default export returns null to disable the floating button on the web page.
export default function FloatingContact() {
  return null;
}

// Original implementation for backup/future use.
export function FloatingContactOriginal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 select-none">
      {/* Contact Menu Popover */}
      {isOpen && (
        <div className="w-56 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3 shadow-2xl animate-fade-in flex flex-col gap-2 origin-bottom-left">
          <div className="flex items-center justify-between px-2 pb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ติดต่อร้านค้า</span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* LINE */}
          <a
            href="https://line.me/ti/p/~icon0815971155"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4.5 w-4.5" />
            <span>คุยผ่าน LINE</span>
          </a>

          {/* Facebook Page */}
          <a
            href="https://www.facebook.com/iconnakhon/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all hover:-translate-y-0.5"
          >
            <svg className="h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            <span>Facebook Page</span>
          </a>

          {/* Call Phone */}
          <a
            href="tel:0815971155"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5"
          >
            <Phone className="h-4.5 w-4.5 text-primary" />
            <span>โทร: 081 597 1155</span>
          </a>

          {/* Repair Service Link */}
          <Link
            href="/repairs"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-600 shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            <FileText className="h-4.5 w-4.5" />
            <span>แจ้งซ่อมออนไลน์</span>
          </Link>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 ${
          isOpen
            ? 'bg-slate-800 dark:bg-slate-700 shadow-slate-900/20 rotate-90'
            : 'bg-primary hover:bg-primary-600 shadow-primary/30 relative'
        }`}
        aria-label="ติดต่อเรา"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageCircle className="h-5.5 w-5.5 animate-pulse" />
            {/* Little notification dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-slate-50 dark:border-slate-950 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          </>
        )}
      </button>
    </div>
  )
}
