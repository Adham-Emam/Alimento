import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  ProfileData,
  HealthData,
  OnboardingData,
  OnboardingState,
} from '@/types/onboarding'
import {
  isProfileComplete,
  isHealthDataComplete,
  parseApiDataToOnboardingData,
} from '@/lib/onboarding'
import { DEFAULT_MACRO_TARGETS } from '@/lib/onboarding'
import { checkOnboardingStatus, completeOnboarding } from '../api/onboarding'

const TOTAL_STEPS = 6

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
    target_macros: DEFAULT_MACRO_TARGETS,
  },
}

const initialState: OnboardingState = {
  step: 1,
  totalSteps: TOTAL_STEPS,
  data: defaultData,
  isComplete: false,
  isLoading: false,
  isChecked: false,
  error: null,
}

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
