'use client'

import { Trash2 } from 'lucide-react'
import { deleteTikTokVideo } from '@/app/actions/homepage_tiktok'
import { useTransition } from 'react'

export default function DeleteVideoButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบวิดีโอนี้?')) {
      startTransition(async () => {
        const formData = new FormData()
        formData.append('id', id)
        await deleteTikTokVideo(formData)
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-450 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
      title="ลบ"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  )
}

