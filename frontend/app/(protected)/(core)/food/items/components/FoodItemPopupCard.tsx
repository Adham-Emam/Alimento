import type { FoodItemPopupProps } from '@/types'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function FoodItemPopupCard({
  item,
  onClose,
}: FoodItemPopupProps) {
  if (!item) return null

  const {
    name,
    price,
    price_quantity,
    price_unit,
    serving_size,
    nutrition,
    price_per_gram_protein,
  } = item

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-100 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="
          fixed z-200 top-1/2 left-1/2
          w-[90vw] md:w-full max-w-xl max-h-[90vh]
          overflow-y-auto rounded-2xl bg-card shadow-2xl p-6 space-y-6
          -translate-x-1/2 -translate-y-1/2
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-accent transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between bg-accent/40 rounded-xl p-4">
          <p className="text-lg font-semibold">${price}</p>
          <p className="text-sm text-muted-foreground">
            per {price_quantity}
            {price_unit}
          </p>
        </div>

        {/* Serving Size */}
        {serving_size?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Serving Size</h3>
            <div className="space-y-2">
              {serving_size.map((s, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm bg-muted/50 rounded-lg p-3"
                >
                  <span>{s.description}</span>
                  <span className="font-medium">
                    {s.quantity} {s.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition */}
        {nutrition && (
          <div>
            <h3 className="font-semibold mb-3">
              Nutrition (per {nutrition.nutrition_basis})
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <NutritionItem
                label="Calories"
                value={`${nutrition.calories} kcal`}
              />
              <NutritionItem label="Protein" value={`${nutrition.protein} g`} />
              <NutritionItem
                label="Carbs"
                value={`${nutrition.carbohydrates} g`}
              />
              <NutritionItem label="Fats" value={`${nutrition.fats} g`} />
              <NutritionItem label="Fiber" value={`${nutrition.fiber} g`} />
              <NutritionItem label="Sugar" value={`${nutrition.sugar} g`} />
              <NutritionItem label="Sodium" value={`${nutrition.sodium} mg`} />
              <NutritionItem label="Iron" value={`${nutrition.iron} mg`} />
              <NutritionItem
                label="Calcium"
                value={`${nutrition.calcium} mg`}
              />
              <NutritionItem
                label="Potassium"
                value={`${nutrition.potassium} mg`}
              />
              <NutritionItem label="Zinc" value={`${nutrition.zinc} mg`} />
              <NutritionItem
                label="Magnesium"
                value={`${nutrition.magnesium} mg`}
              />
              <NutritionItem
                label="Vitamin A"
                value={`${nutrition.vitamin_a}`}
              />
              <NutritionItem
                label="Vitamin C"
                value={`${nutrition.vitamin_c} mg`}
              />
            </div>

            {/* Protein Type */}
            <div className="mt-4 text-sm">
              <span className="font-medium">Protein Type:</span>{' '}
              <span className="capitalize">{nutrition.protein_type}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Price / g protein</span>
          <span className="font-semibold">
            ${(price_per_gram_protein ?? 0).toFixed(2)}
          </span>
        </div>
      </motion.div>
    </>
  )
}

/* Small reusable row */
function NutritionItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between bg-muted/40 rounded-lg px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
