'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { FormEvent, useEffect, useState } from 'react'
import type { Meal, PaginationProps } from '@/types'
import { toast } from 'sonner'
import axios from 'axios'
import { apiWithAuth } from '@/lib/api'

export interface Props {
  mealTitle: string
  handleSubmit: (e: FormEvent, mealId?: number) => void
  onClose: () => void
}

export default function MealPopup({ mealTitle, handleSubmit, onClose }: Props) {
  const [selectedMeal, setSelectedMeal] = useState<number | null>(null)
  const [meals, setMeals] = useState<Meal[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getMeals = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiWithAuth.get<PaginationProps<Meal>>(
        `/api/foods/meals?search=${mealTitle}`
      )

      setMeals(res.data.results)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data.detail ||
          err.response?.data.message ||
          'Failed to load food data'

        setError(message)
      } else {
        console.error('Network error or no response')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMeals()
  }, [mealTitle])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => onClose()}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed z-60 top-1/2 left-1/2 w-[90vw] md:w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl p-6 space-y-6 -translate-x-1/2 -translate-y-1/2"
      >
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-full bg-foreground/20" />
            <Skeleton className="h-4 w-full bg-foreground/20" />
            <Skeleton className="h-4 w-[90%] bg-foreground/20" />
          </>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-bold">Add {mealTitle} meal</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-2 hover:bg-accent transition cursor-pointer"
                onClick={() => onClose()}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            {meals && meals.length > 0 ? (
              <form
                onSubmit={(e: FormEvent) =>
                  selectedMeal ? (
                    handleSubmit(e, selectedMeal)
                  ) : (
                    <>
                      {handleSubmit(e)}
                      {setError('You Need to select meal first.')}
                    </>
                  )
                }
              >
                <Select
                  value={selectedMeal?.toString()}
                  onValueChange={(val: string) =>
                    setSelectedMeal(parseInt(val))
                  }
                >
                  <SelectTrigger className="w-full p-2 mb-5 border-foreground rounded">
                    <SelectValue placeholder="Select Meal" />
                  </SelectTrigger>
                  <SelectContent className="z-300">
                    {meals.map((item, index) => (
                      <SelectItem key={index} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="w-full" type="submit">
                  Add Meal
                </Button>
              </form>
            ) : (
              <p className="text-sm">No meals found, Create one first.</p>
            )}
          </>
        )}
      </motion.div>
    </>
  )
}
