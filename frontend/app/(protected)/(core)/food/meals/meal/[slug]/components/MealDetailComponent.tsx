'use client'

import { useState, useEffect } from 'react'
import NotFound from '@/app/not-found'
import { useParams } from 'next/navigation'
import { apiWithAuth } from '@/lib/api'
import axios from 'axios'
import { toast } from 'sonner'
import type { Meal, Ingredient, MealIngredient } from '@/types'
import Loader from '@/components/ui/loader'
import Link from 'next/link'

export default function MealDetailComponent() {
  const { slug } = useParams()
  const [meal, setMeal] = useState<Meal | null>(null)
  const [ingredients, setIngredients] = useState<
    (Ingredient | MealIngredient)[]
  >([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getMeal = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const res = await apiWithAuth.get<Meal>(`/api/foods/meals/${slug}`)
      setMeal(res.data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to load meal')
      } else {
        setError('Unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return
    getMeal()
  }, [slug])

  useEffect(() => {
    if (meal) {
      window.scrollTo(0, 0)
      document.title = meal.name

      const recipeIngredients = meal.recipes
        .map((recipe) => recipe.ingredients)
        .flat()
      setIngredients(
        Array.from(new Set([...meal.ingredients, ...recipeIngredients]))
      )
    }
  }, [meal])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  if (isLoading) return <Loader />
  if (!meal) return <NotFound />

  return (
    <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1 bg-card border border-foreground/40 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-lg capitalize">
          {meal.meal_type} meal
        </h3>

        <Stat label="Ingredients" value={meal.ingredients.length.toString()} />
        <Stat label="Recipes" value={meal.recipes.length.toString()} />

        <p className="text-xs text-muted-foreground">
          Created {new Date(meal.created_at).toLocaleDateString()}
        </p>
      </aside>

      {/* Main */}
      <div className="lg:col-span-3 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{meal.name}</h1>
        </div>

        {/* Ingredients */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>

          {meal.ingredients.length ? (
            <ul className="space-y-2">
              {ingredients.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between border-b last:border-b-0 border-foreground/20 pb-2 text-sm"
                >
                  <span>{item.food_item.name}</span>
                  <span className="text-muted-foreground">
                    {item.quantity} {item.unit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No ingredients added
            </p>
          )}
        </section>

        {/* Recipes */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Recipes</h2>

          {meal.recipes.length ? (
            <ul className="space-y-3">
              {meal.recipes.map((recipe) => (
                <li
                  className="bg-foreground/10 p-0 rounded-xl border shadow-sm"
                  key={recipe.id}
                >
                  <Link
                    className="block px-4 py-3"
                    href={`/food/recipes/recipe/${recipe.slug}`}
                  >
                    <h4 className="font-semibold">{recipe.name}</h4>
                    {recipe.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {recipe.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No recipes attached</p>
          )}
        </section>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
