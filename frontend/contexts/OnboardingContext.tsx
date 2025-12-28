'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { apiWithAuth } from '@/lib/api'
import { AxiosError } from 'axios'

export type SexType = 'male' | 'female' | ''

export type MeasurementUnitsType = 'metric' | 'imperial'

export type ActivityLevelType = 'sedentary' | 'light' | 'moderate' | 'active'

export type GoalType = 'maintenance' | 'cutting' | 'bulking' | 'recomp' | ''

export interface ProfileData {
  profile_image?: string
  display_name?: string
  preferred_currency: string
  birth_date: string
  sex: SexType
  height_cm: number
  weight_kg: number
  measurement_units: MeasurementUnitsType
  activity_level: ActivityLevelType
  goal: GoalType
}

export interface TargetMacros {
  calories: number
  protein_g: number
  carbs_g: number
  fats_g: number
}

export interface HealthData {
  dietary_preferences: string[]
  allergies: string[]
  medical_conditions: string[]
  target_macros: TargetMacros
}

export interface OnboardingData {
  first_name: string
  last_name: string
  profile: ProfileData
  health_data: HealthData
}

// API Response types
interface ApiProfileData {
  profile_image: string | null
  display_name: string | null
  preferred_currency: string
  birth_date: string | null
  sex: SexType | null
  height_cm: number | null
  weight_kg: number | null
  measurement_units: MeasurementUnitsType
  activity_level: ActivityLevelType
  goal: GoalType | null
}

interface ApiHealthData {
  dietary_preferences: string[] | null
  allergies: string[] | null
  medical_conditions: string[] | null
  target_macros: TargetMacros | null
}

interface UserApiResponse {
  first_name: string
  last_name: string
  profile: ApiProfileData | null
  health_data: ApiHealthData | null
}

// API Request types
interface ApiProfileRequest {
  profile_image?: string
  display_name?: string
  preferred_currency: string
  birth_date: string
  sex: 'male' | 'female'
  height_cm: number
  weight_kg: number
  measurement_units: MeasurementUnitsType
  activity_level: ActivityLevelType
  goal: GoalType
}

interface ApiHealthDataRequest {
  dietary_preferences: string[]
  allergies: string[]
  medical_conditions: string[]
  target_macros: TargetMacros
}

interface UserApiRequest {
  first_name?: string
  last_name?: string
  profile: ApiProfileRequest
  health_data: ApiHealthDataRequest
}

interface OnboardingContextType {
  step: number
  totalSteps: number
  data: OnboardingData
  isComplete: boolean
  isLoading: boolean
  isChecked: boolean
  error: string | null
  nextStep: () => void
  prevStep: () => void
  setUserData: (data: { first_name?: string; last_name?: string }) => void
  setProfileData: (data: Partial<ProfileData>) => void
  setHealthData: (data: Partial<HealthData>) => void
  complete: () => Promise<void>
  reset: () => void
  refetch: () => Promise<void>
  checkOnboardingStatus: () => Promise<void>
}

const defaultTargetMacros: TargetMacros = {
  calories: 2000,
  protein_g: 150,
  carbs_g: 200,
  fats_g: 65,
}

const defaultData: OnboardingData = {
  first_name: '',
  last_name: '',
  profile: {
    profile_image: '',
    display_name: '',
    preferred_currency: 'EGP',
    birth_date: '',
    sex: '',
    height_cm: 0,
    weight_kg: 0,
    measurement_units: 'metric',
    activity_level: 'sedentary',
    goal: '',
  },
  health_data: {
    dietary_preferences: [],
    allergies: [],
    medical_conditions: [],
    target_macros: defaultTargetMacros,
  },
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
)

const TOTAL_STEPS = 6

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
]

// Helper function to safely parse JSON or return array/object
function safeJsonParse<T>(
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

function isProfileComplete(profile: ApiProfileData | null): boolean {
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

function isHealthDataComplete(healthData: ApiHealthData | null): boolean {
  if (!healthData) return false

  const macros = healthData.target_macros
  return !!(macros?.calories && macros.calories > 0)
}

function parseApiDataToOnboardingData(
  apiData: UserApiResponse
): OnboardingData {
  const profile = apiData.profile
  const healthData = apiData.health_data

  return {
    first_name: apiData.first_name || '',
    last_name: apiData.last_name || '',
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
        defaultTargetMacros
      ),
    },
  }
}

function convertToApiFormat(data: OnboardingData): UserApiRequest {
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
    first_name: data.first_name || undefined,
    last_name: data.last_name || undefined,
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
      target_macros: data.health_data.target_macros || defaultTargetMacros,
    },
  }
}

function validateOnboardingData(data: OnboardingData): {
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

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const [step, setStep] = useState(1)
  const [data, setDataState] = useState<OnboardingData>(defaultData)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkOnboardingStatus = useCallback(async () => {
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsChecked(true)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await apiWithAuth.get<UserApiResponse>(
        '/api/auth/users/me/'
      )

      const userData = response.data

      const profileComplete = isProfileComplete(userData.profile)
      const healthComplete = isHealthDataComplete(userData.health_data)
      const onboardingComplete = profileComplete && healthComplete

      const parsedData = parseApiDataToOnboardingData(userData)
      setDataState(parsedData)

      if (onboardingComplete) {
        setIsComplete(true)

        if (pathname === '/onboarding') {
          router.push('/dashboard')
        }
      } else {
        setIsComplete(false)

        if (pathname !== '/onboarding') {
          router.push('/onboarding')
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError

      if (axiosError.response?.status === 401) {
        setIsChecked(true)
        setIsLoading(false)
        return
      }

      console.error('Error fetching user data:', err)
      setError(
        axiosError.message || 'An error occurred while fetching user data'
      )
    } finally {
      setIsLoading(false)
      setIsChecked(true)
    }
  }, [pathname, router])

  const nextStep = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const setUserData = (newData: {
    first_name?: string
    last_name?: string
  }) => {
    setDataState((prev) => ({
      ...prev,
      ...newData,
    }))
  }

  const setProfileData = (newData: Partial<ProfileData>) => {
    setDataState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...newData },
    }))
  }

  const setHealthData = (newData: Partial<HealthData>) => {
    setDataState((prev) => ({
      ...prev,
      health_data: { ...prev.health_data, ...newData },
    }))
  }

  const complete = async () => {
    try {
      setError(null)

      const validation = validateOnboardingData(data)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const apiData = convertToApiFormat(data)

      await apiWithAuth.patch('/api/auth/users/me/', apiData)

      setIsComplete(true)
    } catch (err) {
      const axiosError = err as AxiosError<{
        detail?: string | Record<string, string[]>
        message?: string
        [key: string]: unknown
      }>

      console.error('Error completing onboarding:', err)

      let errorMessage = 'Failed to complete onboarding'

      if (axiosError.response?.data) {
        const responseData = axiosError.response.data

        if (typeof responseData.detail === 'string') {
          errorMessage = responseData.detail
        } else if (typeof responseData.detail === 'object') {
          const fieldErrors = Object.entries(responseData.detail)
            .map(
              ([field, errors]) =>
                `${field}: ${
                  Array.isArray(errors) ? errors.join(', ') : errors
                }`
            )
            .join('; ')
          errorMessage = fieldErrors
        } else if (responseData.message) {
          errorMessage = responseData.message
        } else {
          const allErrors: string[] = []
          Object.entries(responseData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              allErrors.push(`${key}: ${value.join(', ')}`)
            } else if (typeof value === 'string') {
              allErrors.push(`${key}: ${value}`)
            }
          })
          if (allErrors.length > 0) {
            errorMessage = allErrors.join('; ')
          }
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const reset = () => {
    setStep(1)
    setDataState(defaultData)
    setIsComplete(false)
    setIsChecked(false)
    setError(null)
  }

  const refetch = async () => {
    setIsChecked(false)
    await checkOnboardingStatus()
  }

  const value: OnboardingContextType = {
    step,
    totalSteps: TOTAL_STEPS,
    data,
    isComplete,
    isLoading,
    isChecked,
    error,
    nextStep,
    prevStep,
    setUserData,
    setProfileData,
    setHealthData,
    complete,
    reset,
    refetch,
    checkOnboardingStatus,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
