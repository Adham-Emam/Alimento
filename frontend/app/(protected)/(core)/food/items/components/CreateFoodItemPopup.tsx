'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import type { FoodItemProps, CreateFoodItemPopupProps } from '@/types'
import { useState, useEffect } from 'react'
import { apiWithAuth } from '@/lib/api'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import axios from 'axios'
import { toast } from 'sonner'

const FoodItemSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  price: Yup.number().required('Price is required').min(0),
  price_quantity: Yup.number().required('Quantity is required').min(0),
  serving_size: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required('Description required'),
      quantity: Yup.number().required('Quantity required').min(0),
      unit: Yup.string()
        .oneOf(['g', 'ml', 'serving', 'piece'])
        .required('Unit required'),
    })
  ),
  nutrition: Yup.object().shape({
    nutrition_basis: Yup.string().required(),
    calories: Yup.number().required(),
    protein: Yup.number().required(),
    protein_type: Yup.string()
      .oneOf(['vegan', 'meat', 'dairy', 'other'])
      .required(),
    carbohydrates: Yup.number().required(),
    fats: Yup.number().required(),
    fiber: Yup.number().required(),
    sugar: Yup.number().required(),
    sodium: Yup.number().required(),
    iron: Yup.number().required(),
    calcium: Yup.number().required(),
    potassium: Yup.number().required(),
    zinc: Yup.number().required(),
    magnesium: Yup.number().required(),
    vitamin_a: Yup.number().required(),
    vitamin_c: Yup.number().required(),
  }),
})

export default function CreateFoodItemPopup({
  isOpen,
  setIsOpen,
}: CreateFoodItemPopupProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const initialValues: FoodItemProps = {
    name: '',
    price: 0,
    price_quantity: 0,
    price_unit: '',
    serving_size: [{ description: '', quantity: 0, unit: '' }],
    nutrition: {
      nutrition_basis: '',
      calories: 0,
      protein: 0,
      protein_type: 'vegan',
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      iron: 0,
      calcium: 0,
      potassium: 0,
      zinc: 0,
      magnesium: 0,
      vitamin_a: 0,
      vitamin_c: 0,
    },
  }

  const handleSubmit = async (values: FoodItemProps) => {
    try {
      setError(null)
      setSuccess(null)
      await apiWithAuth.post('/api/foods/create/', values)
      setSuccess('Food item added successfully!')
      setIsOpen(false)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to add food item')
      } else {
        setError('Unexpected error occurred')
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Prevent background scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll
      document.body.style.overflow = ''
    }

    // Cleanup just in case
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (error) {
      toast.error(error)
    } else if (success) {
      toast.success(success)
    }
  }, [error, success])

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed z-60 top-1/2 left-1/2 w-[90vw] md:w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl p-6 space-y-6 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold">Add Food Item</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 hover:bg-accent transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={FoodItemSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Field name="name" className="w-full p-2 border rounded" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Price & Quantity */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Price</label>
                  <Field
                    name="price"
                    type="number"
                    className="w-full p-2 border rounded"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue('price', Number(e.target.value))
                    }
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium">Quantity</label>
                  <Field
                    name="price_quantity"
                    type="number"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="price_quantity"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium">Unit</label>
                  <Select
                    value={values.price_unit}
                    onValueChange={(val) => setFieldValue('price_unit', val)}
                  >
                    <SelectTrigger className="w-full p-2 bg-transparent! h-[42px]! border-foreground rounded">
                      <SelectValue placeholder="Select a Unit" />
                    </SelectTrigger>
                    <SelectContent className="z-300">
                      <SelectGroup>
                        <SelectItem value="g">Gram</SelectItem>
                        <SelectItem value="ml">Millilitre</SelectItem>
                        <SelectItem value="serving">Serving</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="price_unit"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>

              {/* Serving Sizes */}
              <FieldArray name="serving_size">
                {({ push, remove }) => (
                  <div>
                    <h3 className="font-semibold mb-2">Serving Sizes</h3>
                    {values.serving_size.map((s, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Field
                          name={`serving_size[${idx}].description`}
                          placeholder="Description"
                          className="flex-1 p-2 border rounded"
                        />
                        <Field
                          name={`serving_size[${idx}].quantity`}
                          type="number"
                          placeholder="Qty"
                          className="w-20 p-2 border rounded"
                        />
                        <Field
                          name={`serving_size[${idx}].unit`}
                          placeholder="Unit"
                          className="w-20 p-2 border rounded"
                        />
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="text-red-500"
                        >
                          x
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        push({ description: '', quantity: 0, unit: '' })
                      }
                      className="text-blue-500 text-sm"
                    >
                      + Add Serving
                    </button>
                  </div>
                )}
              </FieldArray>

              {/* Nutrition */}
              <div>
                <h3 className="font-semibold mb-2">Nutrition</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(values.nutrition).map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium">{key}</label>
                      {key === 'protein_type' ? (
                        <Select
                          value={values.nutrition.protein_type}
                          onValueChange={(val) =>
                            setFieldValue('nutrition.protein_type', val)
                          }
                        >
                          <SelectTrigger className="w-full p-2 bg-transparent! h-[42px]! border-foreground rounded">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent className="z-300">
                            <SelectGroup>
                              <SelectItem value="vegan">Vegan</SelectItem>
                              <SelectItem value="meat">Meat</SelectItem>
                              <SelectItem value="dairy">Dairy</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Field
                          name={`nutrition.${key}`}
                          type="number"
                          className="w-full p-2 border rounded"
                        />
                      )}
                      <ErrorMessage
                        name={`nutrition.${key}`}
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </>
  )
}
