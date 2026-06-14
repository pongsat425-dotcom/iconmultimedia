'use client'

import { Trash2 } from 'lucide-react'
import { deleteSectionBanner } from '@/app/actions/section_banners'
import { useTransition } from 'react'

export default function DeleteBannerButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบป้ายนี้?')) {
      startTransition(async () => {
        const formData = new FormData()
        formData.append('id', id)
        await deleteSectionBanner(formData)
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 dark:text-rose-450 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
      title="ลบ"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}

