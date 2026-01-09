import type { Meal, MealIngredient } from '@/types'

const PROTEIN_TYPE_COLORS: Record<string, string> = {
  dairy: 'bg-blue-500/40 border-blue-500',
  vegan: 'bg-green-500/40 border-green-500',
  meat: 'bg-destructive/40 border-destructive',
  other: 'bg-gray-500/40 border-gray-500',
}

function getProteinType(ingredients: MealIngredient[]): string {
  const priority = ['meat', 'dairy', 'vegan']

  for (const type of priority) {
    if (
      ingredients.some((ing) => ing.food_item.nutrition?.protein_type === type)
    ) {
      return type
    }
  }

  return 'other'
}

export default function MealCard(meal: Meal) {
  const proteinType = getProteinType(meal.ingredients)

  const recipeIngredients = meal.recipes
    .map((recipe) => recipe.ingredients)
    .flat()
  const totalIngredients = Array.from(
    new Set([...meal.ingredients, ...recipeIngredients])
  )

  return (
    <div className="bg-card p-4 rounded-2xl border shadow-lg hover:scale-105 hover:shadow-xl transition cursor-pointer">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold truncate">{meal.name}</h3>

        <span
          className={`${PROTEIN_TYPE_COLORS[proteinType]} border text-sm font-bold px-2 rounded-full capitalize`}
        >
          {proteinType}
        </span>
      </div>

      {/* Meal type */}
      <p className="text-xs text-muted-foreground capitalize mt-1">
        {meal.meal_type}
      </p>

      {/* Macros */}
      <div className="grid grid-cols-2 items-center gap-3 text-sm mt-4">
        <p className="text-orange-500">
          {meal.calories} <span className="font-bold">kcal</span>
        </p>
        <p className="text-muted-foreground">
          <span className="font-bold">Protein:</span> {meal.protein_g}g
        </p>
        <p className="text-muted-foreground">
          <span className="font-bold">Carbs:</span> {meal.carbs_g}g
        </p>
        <p className="text-muted-foreground">
          <span className="font-bold">Fats:</span> {meal.fats_g}g
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center mt-4 text-sm font-bold text-card-foreground">
        <span>{totalIngredients.length} ingredients</span>
      </div>
    </div>
  )
}
