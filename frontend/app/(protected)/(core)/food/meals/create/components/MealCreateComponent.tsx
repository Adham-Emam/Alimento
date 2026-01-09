'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import axios from 'axios'

import type { FoodItem, Recipe, PaginationProps } from '@/types'
import { apiWithAuth } from '@/lib/api'
import Loader from '@/components/ui/loader'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Ingredient = {
  food_item?: number
  quantity: number
  unit: 'g' | 'kg' | 'ml' | 'l' | 'pcs'
}

type MealFormValues = {
  name: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ingredients: Ingredient[]
  recipes: number[]
}

/* ---------------- Component ---------------- */

export default function MealCreateComponent() {
  const router = useRouter()

  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ---------------- Fetch Data ---------------- */

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [foodsRes, recipesRes] = await Promise.all([
        apiWithAuth.get<PaginationProps<FoodItem>>('/api/foods/'),
        apiWithAuth.get<Recipe[]>('/api/foods/recipes/selectable/'),
      ])

      setFoodItems(foodsRes.data.results)
      setRecipes(recipesRes.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to load data')
      } else {
        setError('Unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* ---------------- Form ---------------- */

  const initialValues: MealFormValues = {
    name: '',
    meal_type: 'breakfast',
    ingredients: [],
    recipes: [],
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Meal name is required'),
    meal_type: Yup.string()
      .oneOf(['breakfast', 'lunch', 'dinner', 'snack'])
      .required(),

    ingredients: Yup.array()
      .of(
        Yup.object({
          food_item: Yup.number()
            .typeError('Select a food item')
            .required('Select a food item')
            .moreThan(0),
          quantity: Yup.number().min(0.1).required(),
          unit: Yup.string().required(),
        })
      )
      .min(1, 'Add at least one ingredient'),
    recipes: Yup.array().of(Yup.number()),
  })

  const handleSubmit = async (values: MealFormValues) => {
    const payload = {
      ...values,
      ingredients: values.ingredients
        .filter((i) => typeof i.food_item === 'number')
        .map((ing) => ({
          food_item_id: ing.food_item!,
          quantity: ing.quantity,
          unit: ing.unit,
        })),
    }

    try {
      await apiWithAuth.post('/api/foods/meals/create/', payload)
      toast.success('Meal created successfully')
      router.push('/food/meals')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to create meal')
      } else {
        setError('Unexpected error occurred')
      }
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      setError(null)
    }
  }, [error])

  if (isLoading) return <Loader />

  return (
    <div className="bg-card border rounded-2xl max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">Create Meal</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-5">
            {/* Name */}
            <div>
              <label className="block font-medium">Meal Name</label>
              <Field
                name="name"
                className="border p-2 w-full rounded-xl"
                placeholder="Enter meal name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Meal Type */}
            <div>
              <label className="block font-medium">Meal Type</label>
              <Select
                value={values.meal_type}
                onValueChange={(val) => setFieldValue('meal_type', val)}
              >
                <SelectTrigger className="w-full border-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ingredients */}
            <FieldArray name="ingredients">
              {({ push, remove }) => (
                <div>
                  <h3 className="font-medium mb-2">Ingredients</h3>

                  {values.ingredients.map((ing, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <Select
                        value={ing.food_item ? ing.food_item.toString() : ''}
                        onValueChange={(val) =>
                          setFieldValue(
                            `ingredients.${index}.food_item`,
                            Number(val)
                          )
                        }
                      >
                        <SelectTrigger className="w-full border-foreground">
                          <SelectValue placeholder="Food item" />
                        </SelectTrigger>
                        <SelectContent>
                          {foodItems.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Field
                        name={`ingredients.${index}.quantity`}
                        type="number"
                        className="border p-1 w-20 rounded-lg"
                      />

                      <Select
                        value={ing.unit}
                        onValueChange={(val) =>
                          setFieldValue(`ingredients.${index}.unit`, val)
                        }
                      >
                        <SelectTrigger className="w-24 border-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['g', 'kg', 'ml', 'l', 'pcs'].map((u) => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 font-bold"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      push({ food_item: undefined, quantity: 1, unit: 'g' })
                    }
                    className="text-blue-500 font-bold mt-2"
                  >
                    + Add Ingredient
                  </button>
                </div>
              )}
            </FieldArray>

            {/* Recipes (Multi-select) */}
            <div>
              <h3 className="font-medium mb-2">Recipes</h3>

              <div className="space-y-2 max-h-56 overflow-auto border rounded-xl p-2">
                {recipes.map((recipe) => (
                  <label
                    key={recipe.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={values.recipes.includes(recipe.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFieldValue('recipes', [
                            ...values.recipes,
                            recipe.id,
                          ])
                        } else {
                          setFieldValue(
                            'recipes',
                            values.recipes.filter((id) => id !== recipe.id)
                          )
                        }
                      }}
                    />
                    {recipe.name}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Meal
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
