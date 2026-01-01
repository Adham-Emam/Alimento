import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
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

interface OnboardingState {
  step: number
  totalSteps: number
  data: OnboardingData
  isComplete: boolean
  isLoading: boolean
  isChecked: boolean
  error: string | null
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

const TOTAL_STEPS = 6

const initialState: OnboardingState = {
  step: 1,
  totalSteps: TOTAL_STEPS,
  data: defaultData,
  isComplete: false,
  isLoading: false,
  isChecked: false,
  error: null,
}

// Helper functions
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

// Async thunks
export const checkOnboardingStatus = createAsyncThunk(
  'onboarding/checkOnboardingStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiWithAuth.get<UserApiResponse>(
        '/api/auth/users/me/'
      )
      return response.data
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response?.status === 401) {
        return rejectWithValue('Unauthorized')
      }
      throw err
    }
  }
)

export const completeOnboarding = createAsyncThunk(
  'onboarding/complete',
  async (data: OnboardingData, { rejectWithValue }) => {
    const validation = validateOnboardingData(data)
    if (!validation.isValid) {
      return rejectWithValue(validation.errors.join(', '))
    }

    const apiData = convertToApiFormat(data)

    try {
      await apiWithAuth.patch('/api/auth/users/me/', apiData)
      return true
    } catch (err) {
      const axiosError = err as AxiosError<{
        detail?: string | Record<string, string[]>
        message?: string
        [key: string]: unknown
      }>

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

      return rejectWithValue(errorMessage)
    }
  }
)

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.step = Math.min(state.step + 1, TOTAL_STEPS)
    },
    prevStep: (state) => {
      state.step = Math.max(state.step - 1, 1)
    },
    setUserData: (
      state,
      action: PayloadAction<{ first_name?: string; last_name?: string }>
    ) => {
      state.data = { ...state.data, ...action.payload }
    },
    setProfileData: (state, action: PayloadAction<Partial<ProfileData>>) => {
      state.data.profile = { ...state.data.profile, ...action.payload }
    },
    setHealthData: (state, action: PayloadAction<Partial<HealthData>>) => {
      state.data.health_data = { ...state.data.health_data, ...action.payload }
    },
    reset: (state) => {
      state.step = 1
      state.data = defaultData
      state.isComplete = false
      state.isChecked = false
      state.error = null
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkOnboardingStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(checkOnboardingStatus.fulfilled, (state, action) => {
        const userData = action.payload
        const profileComplete = isProfileComplete(userData.profile)
        const healthComplete = isHealthDataComplete(userData.health_data)
        const onboardingComplete = profileComplete && healthComplete

        const parsedData = parseApiDataToOnboardingData(userData)
        state.data = parsedData
        state.isComplete = onboardingComplete
        state.isLoading = false
        state.isChecked = true
      })
      .addCase(checkOnboardingStatus.rejected, (state, action) => {
        state.isLoading = false
        state.isChecked = true
        if (action.payload === 'Unauthorized') {
          // Handle unauthorized - maybe redirect to login
        } else {
          state.error =
            action.error.message || 'Failed to check onboarding status'
        }
      })
      .addCase(completeOnboarding.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.isComplete = true
        state.isLoading = false
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          (action.payload as string) || 'Failed to complete onboarding'
      })
  },
})

export const {
  nextStep,
  prevStep,
  setUserData,
  setProfileData,
  setHealthData,
  reset,
  setStep,
} = onboardingSlice.actions

export default onboardingSlice.reducer
