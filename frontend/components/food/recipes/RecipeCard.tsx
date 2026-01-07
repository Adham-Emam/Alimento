import type { Recipe, Ingredient } from '@/types'

const PROTEIN_TYPE_COLORS: Record<string, string> = {
  dairy: 'bg-blue-500/40 border-blue-500',
  vegan: 'bg-green-500/40 border-green-500',
  meat: 'bg-destructive/40 border-destructive',
  other: 'bg-gray-500/40 border-gray-500',
}

function getProteinType(ingredients: Ingredient[]): string {
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

export default function RecipeCard(recipe: Recipe) {
  const proteinType = getProteinType(recipe.ingredients)

  return (
    <div className="bg-card p-4 rounded-2xl border shadow-lg hover:scale-105 hover:shadow-xl transition cursor-pointer">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold truncate">{recipe.name}</h3>
        <span
          className={`${PROTEIN_TYPE_COLORS[proteinType]} border text-sm font-bold px-2 rounded-full capitalize`}
        >
          {proteinType}
        </span>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-2 items-center gap-3 text-sm mt-4">
        <p className="text-orange-500">
          {recipe.calories} <span className="font-bold">kcal</span>
        </p>
        <p className="text-muted-foreground">
          <span className="font-bold">Protein:</span> {recipe.protein_g}g
        </p>
        <p className="text-muted-foreground">
          <span className="font-bold">Carbs:</span> {recipe.carbs_g}g
        </p>
        <p className="text-muted-foreground">
          <span className="font-bold">Fats:</span> {recipe.fats_g}g
        </p>
      </div>

      {/* Ingredients count */}
      <p className="text-right text-card-foreground font-bold mt-4 text-sm">
        {recipe.ingredients.length} ingredients
      </p>
    </div>
  )
}
