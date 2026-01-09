import ItemSkeleton from './ItemSkeleton'

export function SkeletonGrid() {
  return (
    <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ItemSkeleton key={i} />
      ))}
    </div>
  )
}
