import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Sex = 'male' | 'female'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active'

export type Goal = 'maintenance' | 'cutting' | 'bulking' | 'recomp'

export interface MacroTargets {
  calories: number
  protein_g: number
  carbs_g: number
  fats_g: number
}

export interface UserProfile {
  weight_kg: number
  height_cm: number
  birth_date: string
  sex: Sex
  activity_level: ActivityLevel
  goal: Goal
}

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
}

const CALORIE_ADJUSTMENTS: Record<Goal, number> = {
  maintenance: 0,
  cutting: -500,
  bulking: 300,
  recomp: -200,
}

const PROTEIN_FACTORS: Record<Goal, number> = {
  maintenance: 1.5,
  cutting: 2.0,
  bulking: 1.7,
  recomp: 2.2,
}

const FAT_CALORIE_PERCENTAGE = 0.25

const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * Men: 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
 * Women: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
 */
function calculateBMR(
  weight_kg: number,
  height_cm: number,
  age: number,
  sex: Sex
): number {
  const baseBMR = 10 * weight_kg + 6.25 * height_cm - 5 * age

  return sex === 'male' ? baseBMR + 5 : baseBMR - 161
}

/**
 * Calculate macro targets based on user profile
 * Returns: { calories, protein_g, carbs_g, fats_g }
 */
export function calculateMacroTargets(profile: UserProfile): MacroTargets {
  const { weight_kg, height_cm, birth_date, sex, activity_level, goal } =
    profile

  const age = calculateAge(birth_date)

  const bmr = calculateBMR(weight_kg, height_cm, age, sex)

  const activityFactor = ACTIVITY_FACTORS[activity_level] || 1.55
  const tdee = bmr * activityFactor

  const calorieAdjustment = CALORIE_ADJUSTMENTS[goal] || 0
  const calories = Math.round(tdee + calorieAdjustment)

  const proteinFactor = PROTEIN_FACTORS[goal] || 1.5

  const protein_g = Math.round(weight_kg * proteinFactor)

  const fatCalories = calories * FAT_CALORIE_PERCENTAGE

  const fats_g = Math.round(fatCalories / CALORIES_PER_GRAM.fat)

  const proteinCalories = protein_g * CALORIES_PER_GRAM.protein

  const remainingCalories = calories - proteinCalories - fatCalories
  const carbs_g = Math.max(
    0,
    Math.round(remainingCalories / CALORIES_PER_GRAM.carbs)
  )

  return {
    calories,
    protein_g,
    carbs_g,
    fats_g,
  }
}

/**
 * Default macro targets (fallback when profile is incomplete)
 */
export const DEFAULT_MACRO_TARGETS: MacroTargets = {
  calories: 2000,
  protein_g: 150,
  carbs_g: 200,
  fats_g: 55,
}
