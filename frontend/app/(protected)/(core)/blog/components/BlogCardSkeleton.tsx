import { Skeleton } from '@/components/ui/skeleton'

const BlogCardSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto border rounded-2xl overflow-hidden bg-card shadow-sm p-6 space-y-6">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[250px] w-full rounded-xl bg-background" />
        <div className="space-y-2 mb-5">
          <Skeleton className="h-4 w-full bg-background" />
          <Skeleton className="h-4 w-full bg-background" />
          <Skeleton className="h-4 w-full bg-background" />
          <Skeleton className="h-4 w-full bg-background" />
          <Skeleton className="h-4 w-[90%] bg-background" />
        </div>
        <div className="space-y-2 mb-5">
          <Skeleton className="h-4 w-full bg-background" />
          <Skeleton className="h-4 w-full bg-background" />
          <Skeleton className="h-4 w-[40%] bg-background" />
        </div>
      </div>
    </div>
  )
}

export default BlogCardSkeleton
