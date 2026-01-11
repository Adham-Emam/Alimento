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
  profile: ProfileData
  health_data: HealthData
}

// API Response types
export interface ApiProfileData {
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

export interface ApiHealthData {
  dietary_preferences: string[] | null
  allergies: string[] | null
  medical_conditions: string[] | null
  target_macros: TargetMacros | null
}

export interface UserApiResponse {
  first_name: string
  last_name: string
  profile: ApiProfileData | null
  health_data: ApiHealthData | null
}

// API Request types
export interface ApiProfileRequest {
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

export interface ApiHealthDataRequest {
  dietary_preferences: string[]
  allergies: string[]
  medical_conditions: string[]
  target_macros: TargetMacros
}

export interface UserApiRequest {
  first_name?: string
  last_name?: string
  profile: ApiProfileRequest
  health_data: ApiHealthDataRequest
}

export interface OnboardingState {
  step: number
  totalSteps: number
  data: OnboardingData
  isComplete: boolean
  isLoading: boolean
  isChecked: boolean
  error: string | null
}
