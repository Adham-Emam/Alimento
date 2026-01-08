'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import { toast } from 'sonner'
import * as Yup from 'yup'
import type { FoodItem, PaginationProps, Instructions } from '@/types'
import { apiWithAuth } from '@/lib/api'
import axios from 'axios'
import Loader from '@/components/ui/loader'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { set } from 'date-fns'

type Ingredient = {
  food_item: number
  quantity: number
  unit: 'g' | 'kg' | 'ml' | 'l' | 'pcs'
}

type RecipeFormValues = {
  name: string
  description: string
  is_public: boolean
  ingredients: Ingredient[]
  instructions: Instructions[]
}

export default function RecipeCreateComponent() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const getFoodItems = async () => {
    setIsLoading(true)
    try {
      const res = await apiWithAuth.get<PaginationProps<FoodItem>>(
        '/api/foods/'
      )
      setFoodItems(res.data.results)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to load food items')
      } else {
        setError('Unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getFoodItems()
  }, [])

  const initialValues: RecipeFormValues = {
    name: '',
    description: '',
    is_public: false,
    ingredients: [
      {
        food_item: 0,
        quantity: 0,
        unit: 'g',
      },
    ],
    instructions: [
      {
        step_number: 1,
        text: '',
      },
    ],
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Recipe name is required'),
    description: Yup.string().required('Description is required'),
    ingredients: Yup.array()
      .of(
        Yup.object({
          food_item: Yup.number()
            .required('Select a food item')
            .moreThan(0, 'Select a valid food item'),
          quantity: Yup.number().required('Quantity is required').min(0.1),
          unit: Yup.string()
            .oneOf(['g', 'kg', 'ml', 'l', 'pcs'], 'Invalid unit')
            .required('Unit is required'),
        })
      )
      .min(1, 'At least one ingredient is required'),

    instructions: Yup.array()
      .of(
        Yup.object({
          step_number: Yup.number().required(),
          text: Yup.string().required('Instruction text is required'),
        })
      )
      .min(1, 'At least one instruction is required'),
  })

  const handleSubmit = async (values: RecipeFormValues) => {
    const payload = {
      ...values,
      ingredients: values.ingredients.map((ing) => ({
        food_item_id: ing.food_item,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
    }

    try {
      await apiWithAuth.post('/api/foods/recipes/create/', payload)
      toast.success('Recipe created!')
      router.push('/food/recipes')
    } catch (err: any) {
      console.log(err)
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to create recipe')
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
      <h2 className="text-xl font-bold mb-4">Create Recipe</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Name */}
            <div>
              <label className="block font-medium">Recipe Name</label>
              <Field
                name="name"
                className="border p-2 w-full rounded-2xl"
                placeholder="Enter recipe name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium">Description</label>
              <Field
                as="textarea"
                name="description"
                className="border p-2 w-full rounded-2xl"
                placeholder="Enter description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Ingredients */}
            <FieldArray name="ingredients">
              {({ push, remove }) => (
                <div>
                  <h3 className="font-medium mb-2">Ingredients</h3>
                  {values.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 items-center mb-2">
                      {/* Food Item Select */}
                      <Select
                        value={ingredient.food_item.toString()}
                        onValueChange={(val) =>
                          setFieldValue(
                            `ingredients.${index}.food_item`,
                            Number(val)
                          )
                        }
                      >
                        <SelectTrigger className="w-full border-foreground">
                          <SelectValue placeholder="Select food item" />
                        </SelectTrigger>
                        <SelectContent>
                          {foodItems
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {/* Quantity */}
                      <Field
                        name={`ingredients.${index}.quantity`}
                        type="number"
                        placeholder="Quantity"
                        className="border p-1 w-20 rounded-lg"
                      />
                      {/* Unit Select */}
                      <Select
                        value={ingredient.unit}
                        onValueChange={(val) =>
                          setFieldValue(`ingredients.${index}.unit`, val)
                        }
                      >
                        <SelectTrigger className="w-24 border-foreground">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {['g', 'kg', 'ml', 'l', 'pcs'].map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Remove button */}
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
                      push({ food_item: 0, quantity: 0, unit: 'g' })
                    }
                    className="mt-2 text-blue-500 font-bold"
                  >
                    + Add Ingredient
                  </button>
                </div>
              )}
            </FieldArray>

            {/* Instructions */}
            <FieldArray name="instructions">
              {({ push, remove }) => (
                <div>
                  <h3 className="font-medium mb-2">Instructions</h3>

                  {values.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2 items-start mb-2">
                      <span className="mt-2 font-semibold">{index + 1}.</span>

                      <Field
                        as="textarea"
                        name={`instructions.${index}.text`}
                        placeholder="Describe this step..."
                        className="border p-2 w-full rounded-xl"
                      />

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 font-bold mt-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      push({
                        step_number: values.instructions.length + 1,
                        text: '',
                      })
                    }
                    className="mt-2 text-blue-500 font-bold"
                  >
                    + Add Step
                  </button>
                </div>
              )}
            </FieldArray>

            <Button type="submit" className="p-2 rounded mt-4 w-full">
              Create Recipe
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
