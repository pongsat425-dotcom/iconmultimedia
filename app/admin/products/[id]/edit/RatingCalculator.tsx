'use client'

import { useState } from 'react'

interface RatingCalculatorProps {
  initialRating: number
  initialReviewsCount: number
}

export default function RatingCalculator({
  initialRating,
  initialReviewsCount
}: RatingCalculatorProps) {
  const [rating, setRating] = useState<number>(initialRating || 0)
  const [reviewsCount, setReviewsCount] = useState<number>(initialReviewsCount || 0)

  // Calculate total stars automatically (rating * reviewsCount)
  const totalStars = Math.round(rating * reviewsCount)

  const handleRatingChange = (val: string) => {
    const num = parseFloat(val) || 0
    setRating(Math.min(5, Math.max(0, num)))
  }

  const handleReviewsChange = (val: string) => {
    const num = parseInt(val, 10) || 0
    setReviewsCount(Math.max(0, num))
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          จัดการรีวิวสินค้า (Reviews & Rating)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          คะแนนเฉลี่ย: <span className="font-bold text-primary">{rating % 1 === 0 ? rating.toString() : rating.toFixed(1)}</span> / 5.0 ({reviewsCount} รีวิว)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">
            คะแนนความพึงพอใจ (Rating) *
          </label>
          <input
            type="number"
            step="0.1"
            min={0}
            max={5}
            value={rating || ''}
            onChange={(e) => handleRatingChange(e.target.value)}
            placeholder="เช่น 4.5"
            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            กรอกคะแนนเฉลี่ยโดยตรง (0.0 - 5.0)
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">
            จำนวนผู้รีวิวทั้งหมด (Reviews Count) *
          </label>
          <input
            type="number"
            min={0}
            value={reviewsCount || ''}
            onChange={(e) => handleReviewsChange(e.target.value)}
            placeholder="เช่น 100"
            className="w-full px-3 py-2.5 border border-slate-350 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            กรอกจำนวนคนรีวิวโดยตรง
          </p>
        </div>
      </div>

      {/* Calculated Total Stars display */}
      <div className="border-t border-slate-205 dark:border-slate-800 pt-3">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 block">
          คะแนนดาวสะสมทั้งหมด (Total Stars): <span className="font-bold text-slate-900 dark:text-white">{totalStars}</span>
        </span>
        <span className="text-[10px] text-slate-400 block mt-0.5">
          ผลรวมของคะแนนดาวที่ได้รับทั้งหมด (เช่น รีวิว 4.5 ดาว 100 คน = 450 คะแนน)
        </span>
      </div>

      {/* Hidden inputs submitted to the form action */}
      <input type="hidden" name="rating" value={rating} />
      <input type="hidden" name="reviews" value={reviewsCount} />
    </div>
  )
}
