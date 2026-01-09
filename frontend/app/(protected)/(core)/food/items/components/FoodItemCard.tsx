import type { FoodItemProps } from '@/types'

const PROTEIN_TYPE_COLORS = {
  dairy: 'bg-blue-500/40 border-blue-500',
  vegan: 'bg-green-500/40 border-green-500',
  meat: 'bg-destructive/40 border-destructive',
  other: 'bg-grey-500/40 border-gray-500',
}

export default function FoodItemCard(item: FoodItemProps) {
  const proteinType = item.nutrition?.protein_type || 'other'

  return (
    <div className="bg-card p-4 rounded-2xl border shadow-lg hover:scale-105 hover:shadow-xl transition cursor-pointer">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{item.name}</h3>
        <span
          className={`${PROTEIN_TYPE_COLORS[proteinType]} border text-sm font-bold px-2 rounded-full`}
        >
          {proteinType}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm mt-4">
        <p className="text-orange-500">
          {item.nutrition?.calories || 'N/A'} kcal
        </p>
        <p className="text-muted-foreground">
          {item.nutrition?.nutrition_basis}
        </p>
      </div>

      <p className="text-right text-card-foreground font-bold mt-4">
        ${(item.price_per_gram_protein ?? 0).toFixed(2)}/gram
      </p>
    </div>
  )
}
