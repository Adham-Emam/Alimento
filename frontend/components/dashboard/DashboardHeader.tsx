'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { apiWithAuth } from '@/lib/api'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { NutritionBar } from '@/components/dashboard/NutritionBadge'
import { format, addDays, subDays } from 'date-fns'
import { Button } from '@/components/ui/button'

interface UserDataProps {
  first_name: string
  last_name: string
  profile: {
    display_name: string
    preferred_currency: string
    birth_date: Date
    sex: 'male' | 'female'
    height_cm: number
    weight_kg: number
    measurement_units: 'metric' | 'imperial'
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active'
    goal: 'maintenance' | 'cutting' | 'bulking' | 'recomp'
  }
  health_data: {
    dietary_preferences: string
    allergies: string
    medical_conditions: string
    target_macros: string
  }
}

interface MacrosProps {
  calories?: number
  protein_g?: number
  carbs_g?: number
  fats_g?: number
}
interface MealLog {
  id: number
  meal: {
    calories: number
    protein_g: number
    carbs_g: number
    fats_g: number
  }
  consumed_at: string
}

const DashboardHeader = () => {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [targetMacros, setTargetMacros] = useState<MacrosProps | null>(null)
  const [consumedMacros, setConsumedMacros] = useState<MacrosProps | null>(null)

  const getTargetMacros = async () => {
    try {
      const res = await apiWithAuth.get<Promise<UserDataProps>>(
        '/api/auth/users/me/'
      )
      const data: any = await res.data
      setTargetMacros(data.health_data.target_macros)
    } catch (err: any) {
      console.error(err?.response?.data?.detail || 'Failed to load user data')
    }
  }

  const getConsumedMacros = async () => {
    try {
      const res = await apiWithAuth.get<MealLog[]>(
        `/api/user/logs?date=${format(selectedDate, 'yyyy-MM-dd')}&interval=day`
      )

      const logs = res.data

      const totals = logs.reduce(
        (acc, log) => {
          acc.calories += log.meal.calories / 100
          acc.protein_g += log.meal.protein_g / 100
          acc.carbs_g += log.meal.carbs_g / 100
          acc.fats_g += log.meal.fats_g / 100
          return acc
        },
        {
          calories: 0,
          protein_g: 0,
          carbs_g: 0,
          fats_g: 0,
        }
      )

      setConsumedMacros(totals)
    } catch (err: any) {
      throw new Error(err?.response?.data?.detail || 'Failed to load user data')
    }
  }
  useEffect(() => {
    getTargetMacros()
  }, [])

  useEffect(() => {
    getConsumedMacros()
  }, [selectedDate])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {greeting()}, {user?.first_name}!
          </h1>
          <p className="text-muted-foreground">
            Here's your nutrition overview for today
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/meal-plans">
            <Sparkles className="w-4 h-4" />
            Generate Meal Plan
          </Link>
        </Button>
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-4 mt-8"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDate(subDays(selectedDate, 1))}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card shadow-soft">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">
            {format(selectedDate, 'EEEE, MMMM d')}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Nutrition Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-9"
      >
        {/* Calories - Large Card */}
        <div className="col-span-2 rounded-2xl bg-card-foreground/50 p-5 text-background shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold opacity-80">Calories</span>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <div className="text-4xl font-bold mb-1">
            {consumedMacros?.calories || 0}
          </div>
          <div className="text-sm opacity-80">
            of {targetMacros?.calories} kcal
          </div>
          <div className="h-2 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-card-foreground rounded-full duration-300"
              style={{
                width: `${Math.min(
                  ((consumedMacros?.calories || 0) /
                    (targetMacros?.calories || 1)) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Macros */}
        <div className="rounded-2xl bg-card p-5 shadow-soft">
          <NutritionBar
            current={consumedMacros?.protein_g || 0}
            target={targetMacros?.protein_g || 120}
            type="protein"
          />
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-soft">
          <NutritionBar
            current={consumedMacros?.carbs_g || 0}
            target={targetMacros?.carbs_g || 250}
            type="carbs"
          />
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-soft">
          <NutritionBar
            current={consumedMacros?.fats_g || 0}
            target={targetMacros?.fats_g || 65}
            type="fats"
          />
        </div>
      </motion.div>
    </>
  )
}

export default DashboardHeader
