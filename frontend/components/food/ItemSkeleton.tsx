import { Skeleton } from '../ui/skeleton'

export default function ItemSkeleton() {
  return (
    <div className="bg-card p-4 rounded-2xl border shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 bg-card-foreground/20 w-40 rounded-md" />
        <Skeleton className="h-5 bg-card-foreground/20 w-16 rounded-full" />
      </div>

      {/* Macros */}
      <div className="grid grid-cols-2 gap-3 text-sm mt-4">
        <Skeleton className="h-4 bg-card-foreground/20 w-20 rounded-md" />
        <Skeleton className="h-4 bg-card-foreground/20 w-28 rounded-md" />
        <Skeleton className="h-4 bg-card-foreground/20 w-24 rounded-md" />
        <Skeleton className="h-4 bg-card-foreground/20 w-20 rounded-md" />
      </div>

      {/* Ingredients / Recipes count */}
      <div className="flex justify-end mt-4">
        <Skeleton className="h-4 bg-card-foreground/20 w-24 rounded-md" />
      </div>
    </div>
  )
}
