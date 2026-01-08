'use client'

import { useState, useEffect } from 'react'
import NotFound from '@/app/not-found'
import { useParams } from 'next/navigation'
import { apiWithAuth } from '@/lib/api'
import axios from 'axios'
import { toast } from 'sonner'
import type { Recipe } from '@/types'
import Loader from '@/components/ui/loader'

export default function RecipeDetailComponent() {
  const { slug } = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getRecipe = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await apiWithAuth.get<Recipe>(`/api/foods/recipes/${slug}`)
      setRecipe(res.data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to load recipe')
      } else {
        setError('Unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return
    getRecipe()
  }, [slug])

  useEffect(() => {
    if (recipe) {
      window.scrollTo(0, 0)
      window.document.title = recipe.name
    }
  }, [recipe])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  if (isLoading) return <Loader />

  if (!recipe) return <NotFound />

  return (
    <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1 bg-card border border-foreground/40 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-lg">Nutrition</h3>

        <Stat label="Calories" value={recipe.calories} />
        <Stat label="Protein" value={`${recipe.protein_g} g`} />
        <Stat label="Carbs" value={`${recipe.carbs_g} g`} />
        <Stat label="Fats" value={`${recipe.fats_g} g`} />

        <p className="text-xs text-muted-foreground">
          Created {new Date(recipe.created_at).toLocaleDateString()}
        </p>
      </aside>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{recipe.name}</h1>
          {recipe.description && (
            <p className="text-muted-foreground mt-2">{recipe.description}</p>
          )}
        </div>

        {/* Ingredients */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((item) => (
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
        </section>

        {/* Instructions */}
        {recipe.instructions.length > 0 ? (
          <section>
            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
            <ul className="space-y-4">
              {recipe.instructions
                .sort((a, b) => a.step_number - b.step_number)
                .map((step) => (
                  <li
                    key={step.step_number}
                    className="bg-foreground/10 py-2 px-4 rounded-full border shadow-md flex items-center gap-3"
                  >
                    <span className="border text-foreground dark:text-background rounded-full bg-accent font-extrabold text-lg w-8 h-8 flex items-center justify-center">
                      {step.step_number}
                    </span>
                    {step.text}
                  </li>
                ))}
            </ul>
          </section>
        ) : (
          <p className="text-sm">No instructions available</p>
        )}
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
