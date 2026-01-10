'use client'

import { useState, useEffect, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { apiWithAuth } from '@/lib/api'
import { checkAuth } from '@/redux/api/auth'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { NutritionBar } from '@/app/(protected)/(core)/dashboard/components/NutritionBadge'
import { format, addDays, subDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import type { UserProps, MealLog, MacrosProps, Meal } from '@/types'
import Loader from '@/components/ui/loader'
import { Plus } from 'lucide-react'
import { MealCard } from './MealCard'
import axios from 'axios'
import { toast } from 'sonner'
import MealPopup from './MealPopup'

export default function DashboardComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [targetMacros, setTargetMacros] = useState<MacrosProps | null>(null)
  const [consumedMacros, setConsumedMacros] = useState<MacrosProps | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [currMeal, setCurrMeal] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const [dayMeals, setDayMeals] = useState<{
    Breakfast: MealLog | null
    Lunch: MealLog | null
    Dinner: MealLog | null
    Snack: MealLog[] | null
  }>({
    Breakfast: null,
    Lunch: null,
    Dinner: null,
    Snack: null,
  })
  const dispatch = useAppDispatch()

  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuth())
    }
  }, [dispatch, isAuthenticated])
  const getTargetMacros = async () => {
    try {
      const res = await apiWithAuth.get<UserProps>('/api/auth/users/me/')
      const data: any = res.data
      setTargetMacros(data.health_data.target_macros)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data.detail ||
          err.response?.data.message ||
          'Failed to load food data'

        setError(message)
      } else {
        setError('Network error or no response')
      }
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
          acc.calories += log.meal.calories
          acc.protein_g += log.meal.protein_g
          acc.carbs_g += log.meal.carbs_g
          acc.fats_g += log.meal.fats_g
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

      const mealsByType: {
        Breakfast: MealLog | null
        Lunch: MealLog | null
        Dinner: MealLog | null
        Snack: MealLog[] | null
      } = {
        Breakfast: null,
        Lunch: null,
        Dinner: null,
        Snack: null,
      }

      logs.forEach((log) => {
        const type = log.meal.meal_type

        if (type === 'breakfast') mealsByType.Breakfast = log
        if (type === 'lunch') mealsByType.Lunch = log
        if (type === 'dinner') mealsByType.Dinner = log
        if (type === 'snack') {
          if (mealsByType.Snack) {
            mealsByType.Snack.push(log)
          } else {
            mealsByType.Snack = [log]
          }
        }
      })

      setDayMeals(mealsByType)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data.detail ||
          err.response?.data.message ||
          'Failed to load user data'

        setError(message)
      } else {
        setError('Network error or no response')
      }
    }
  }

  const toggleOpen = (mealTitle?: string) => {
    if (mealTitle) {
      setIsOpen(true)
      setCurrMeal(mealTitle)
    } else {
      setIsOpen(false)
      setCurrMeal(null)
    }
  }

  const handleAddMeal = async (e: FormEvent, mealId?: number) => {
    e.preventDefault()
    if (!mealId) return
    try {
      await apiWithAuth.post<MealLog>('/api/user/logs/create/', {
        meal_id: mealId,
        consumed_at: format(selectedDate, 'yyyy-MM-dd'),
      })

      await getConsumedMacros()

      setSuccess(`${currMeal} added successfully`)
      setIsOpen(false)
      setCurrMeal(null)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data.detail ||
          err.response?.data.message ||
          'Failed to add meal'

        setError(message)
      } else {
        setError('Network error or no response')
      }
    }
  }

  const handleDeleteMeal = async (mealId: number) => {
    try {
      await apiWithAuth.delete(`/api/user/logs/${mealId}/`)

      await getConsumedMacros()

      setSuccess('Meal deleted successfully')
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data.detail ||
          err.response?.data.message ||
          'Failed to delete meal'

        setError(message)
      } else {
        setError('Network error or no response')
      }
    }
  }

  useEffect(() => {
    getTargetMacros()
  }, [])

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
    getConsumedMacros()
  }, [selectedDate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      setError(null)
    } else if (success) {
      toast.success(success)
      setSuccess(null)
    }
  }, [error, success])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (isLoading) return <Loader />

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
          <Link
            href={
              user?.subscription?.is_pro
                ? '/meal-plans'
                : '/payment/billing?plan=pro'
            }
          >
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
            {consumedMacros?.calories?.toFixed(1) || 0}
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-16"
      >
        {[
          { title: 'Breakfast', mealData: dayMeals.Breakfast },
          { title: 'Lunch', mealData: dayMeals.Lunch },
          { title: 'Dinner', mealData: dayMeals.Dinner },
        ].map((item, index) => (
          <div key={index} className="">
            <h3 className="text-2xl font-bold">{item.title}</h3>

            {item.mealData ? (
              <MealCard onDelete={handleDeleteMeal} {...item.mealData} />
            ) : (
              <div
                className="w-full h-[250px] mt-5 rounded-2xl border flex items-center justify-center cursor-pointer"
                onClick={() => toggleOpen(item.title)}
              >
                <Plus />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Snacks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <h3 className="text-2xl font-bold">Snacks</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {dayMeals.Snack &&
            dayMeals.Snack.length > 0 &&
            dayMeals.Snack.map((item, index) => (
              <div key={index}>
                <MealCard onDelete={handleDeleteMeal} {...item} />
              </div>
            ))}
          <div
            className="w-full h-[250px] mt-5 rounded-2xl border flex items-center justify-center cursor-pointer"
            onClick={() => toggleOpen('Snack')}
          >
            <Plus />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && currMeal && (
          <MealPopup
            mealTitle={currMeal}
            onClose={() => toggleOpen()}
            handleSubmit={handleAddMeal}
          />
        )}
      </AnimatePresence>
    </>
  )
}
