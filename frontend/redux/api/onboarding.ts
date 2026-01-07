import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiWithAuth } from '@/lib/api'
import { AxiosError } from 'axios'
import type { OnboardingData, UserApiResponse } from '@/types/onboarding'
import { validateOnboardingData, convertToApiFormat } from '@/lib/onboarding'

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
