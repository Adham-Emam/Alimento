import { apiWithAuth } from './api'
import type {
  ActivityLevelType,
  ProfileData,
  TargetMacros,
  OnboardingData,
  ApiProfileData,
  ApiHealthData,
  UserApiResponse,
  UserApiRequest,
  GoalType,
  SexType,
} from '@/types/onboarding'
import type { Recipe } from '@/types'

const ACTIVITY_FACTORS: Record<ActivityLevelType, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
}

const CALORIE_ADJUSTMENTS: Record<GoalType, number> = {
  maintenance: 0,
  cutting: -500,
  bulking: 300,
  recomp: -200,
  '': 0,
}

const PROTEIN_FACTORS: Record<GoalType, number> = {
  maintenance: 1.5,
  cutting: 2.0,
  bulking: 1.7,
  recomp: 2.2,
  '': 0,
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
  sex: SexType
): number {
  const baseBMR = 10 * weight_kg + 6.25 * height_cm - 5 * age

  return sex === 'male' ? baseBMR + 5 : baseBMR - 161
}

/**
 * Calculate macro targets based on user profile
 * Returns: { calories, protein_g, carbs_g, fats_g }
 */
export function calculateMacroTargets(
  profile: Partial<ProfileData>
): TargetMacros {
  const { weight_kg, height_cm, birth_date, sex, activity_level, goal } =
    profile

  if (
    !birth_date ||
    weight_kg === undefined ||
    height_cm === undefined ||
    !sex ||
    !activity_level ||
    !goal
  ) {
    throw new Error('Missing required profile data for macro calculation')
  }

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
export const DEFAULT_MACRO_TARGETS: TargetMacros = {
  calories: 2000,
  protein_g: 150,
  carbs_g: 200,
  fats_g: 55,
}

export function safeJsonParse<T>(
  value: T | string | null | undefined,
  fallback: T
): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') {
    if (value === 'string' || value === '') return fallback
    try {
      return JSON.parse(value)
    } catch {
      return fallback
    }
  }
  return value
}

export function isProfileComplete(profile: ApiProfileData | null): boolean {
  if (!profile) return false

  return !!(
    profile.birth_date &&
    profile.sex &&
    profile.height_cm &&
    profile.height_cm > 0 &&
    profile.weight_kg &&
    profile.weight_kg > 0 &&
    profile.activity_level &&
    profile.goal
  )
}

export function isHealthDataComplete(
  healthData: ApiHealthData | null
): boolean {
  if (!healthData) return false

  const macros = healthData.target_macros
  return !!(macros?.calories && macros.calories > 0)
}

export function parseApiDataToOnboardingData(
  apiData: UserApiResponse
): OnboardingData {
  const profile = apiData.profile
  const healthData = apiData.health_data

  return {
    profile: {
      profile_image: profile?.profile_image || '',
      display_name: profile?.display_name || '',
      preferred_currency: profile?.preferred_currency || 'EGP',
      birth_date: profile?.birth_date || '',
      sex: profile?.sex || '',
      height_cm: profile?.height_cm || 0,
      weight_kg: profile?.weight_kg || 0,
      measurement_units: profile?.measurement_units || 'metric',
      activity_level: profile?.activity_level || 'sedentary',
      goal: profile?.goal || '',
    },
    health_data: {
      dietary_preferences: safeJsonParse<string[]>(
        healthData?.dietary_preferences,
        []
      ),
      allergies: safeJsonParse<string[]>(healthData?.allergies, []),
      medical_conditions: safeJsonParse<string[]>(
        healthData?.medical_conditions,
        []
      ),
      target_macros: safeJsonParse<TargetMacros>(
        healthData?.target_macros,
        DEFAULT_MACRO_TARGETS
      ),
    },
  }
}

export function convertToApiFormat(data: OnboardingData): UserApiRequest {
  // Validate sex - must be 'male' or 'female' (Django doesn't have 'other')
  const validSex = ['male', 'female'].includes(data.profile.sex)
    ? (data.profile.sex as 'male' | 'female')
    : 'male' // Default to 'male' if empty or invalid

  // Validate goal - must be one of the Django choices
  const validGoal = ['maintenance', 'cutting', 'bulking', 'recomp'].includes(
    data.profile.goal
  )
    ? data.profile.goal
    : 'maintenance'

  return {
    profile: {
      profile_image: data.profile.profile_image || undefined,
      display_name: data.profile.display_name || undefined,
      preferred_currency: data.profile.preferred_currency || 'EGP',
      birth_date: data.profile.birth_date,
      sex: validSex,
      height_cm: Math.round(data.profile.height_cm) || 170,
      weight_kg: Math.round(data.profile.weight_kg * 100) / 100 || 70,
      measurement_units: data.profile.measurement_units || 'metric',
      activity_level: data.profile.activity_level || 'sedentary',
      goal: validGoal as GoalType,
    },
    health_data: {
      dietary_preferences: data.health_data.dietary_preferences || [],
      allergies: data.health_data.allergies || [],
      medical_conditions: data.health_data.medical_conditions || [],
      target_macros: data.health_data.target_macros || DEFAULT_MACRO_TARGETS,
    },
  }
}

export function validateOnboardingData(data: OnboardingData): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!data.profile.birth_date) {
    errors.push('Birth date is required')
  }

  if (!data.profile.sex || !['male', 'female'].includes(data.profile.sex)) {
    errors.push('Please select your sex')
  }

  if (!data.profile.height_cm || data.profile.height_cm <= 0) {
    errors.push('Height must be greater than 0')
  }

  if (!data.profile.weight_kg || data.profile.weight_kg <= 0) {
    errors.push('Weight must be greater than 0')
  }

  if (
    !data.profile.goal ||
    !['maintenance', 'cutting', 'bulking', 'recomp'].includes(data.profile.goal)
  ) {
    errors.push('Please select a goal')
  }

  if (
    !data.health_data.target_macros.calories ||
    data.health_data.target_macros.calories <= 0
  ) {
    errors.push('Daily calories must be set')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
