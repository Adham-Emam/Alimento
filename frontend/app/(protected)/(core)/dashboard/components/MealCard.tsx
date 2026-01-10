'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { MealLog } from '@/types'
import { Flame, Beef, Wheat, Droplet, X } from 'lucide-react'

type MealCardProps = MealLog & {
  onDelete?: (id: number) => void
}

export default function MealCard({ onDelete, ...mealLog }: MealCardProps) {
  const meal = mealLog.meal

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
        filter: 'blur(10px)',
        boxShadow: 'none',
      }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0, filter: 'blur(10px)', boxShadow: 'none' }}
      whileTap={{ y: 4, boxShadow: 'none' }}
      whileHover={{ y: -4, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col mt-4  max-h-[250px]  h-[250px] rounded-2xl bg-card p-5 shadow-soft border"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">{meal.name}</h4>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          {onDelete && (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(mealLog.id)
              }}
              className="rounded-full p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Calories */}
      <div className="mt-auto">
        <div className="text-3xl font-bold">{meal.calories}</div>
        <span className="text-sm text-muted-foreground">kcal</span>
      </div>

      {/* Macros */}
      <div className="mt-auto grid grid-cols-3 gap-3  text-sm">
        <div className="flex items-center gap-1">
          <Beef className="w-4 h-4 text-red-500" />
          {meal.protein_g}g
        </div>
        <div className="flex items-center gap-1">
          <Wheat className="w-4 h-4 text-yellow-500" />
          {meal.carbs_g}g
        </div>
        <div className="flex items-center gap-1">
          <Droplet className="w-4 h-4 text-blue-500" />
          {meal.fats_g}g
        </div>
      </div>

      <Button
        asChild
        variant="secondary"
        className="w-full block text-center mt-5 rounded-xl"
      >
        <Link href={`/food/meals/meal/${meal.slug}`}>View Meal</Link>
      </Button>
    </motion.div>
  )
}
