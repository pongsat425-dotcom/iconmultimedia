import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden h-full">
      {/* Image Area */}
      <Skeleton className="aspect-square rounded-none" />
      
      {/* Content Area */}
      <div className="flex flex-col flex-grow p-4 md:p-5">
        <Skeleton className="h-4 w-1/4 mb-4" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4 mb-4" />
        
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div className="w-full">
            <Skeleton className="h-3 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        </div>
        
        <div className="mt-3">
           <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  )
}
