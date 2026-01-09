import { createAsyncThunk, AsyncThunkConfig } from '@reduxjs/toolkit'
import { api, apiWithAuth, tokenUtils } from '@/lib/api'
import type { UserProps } from '@/types'

export const checkAuth = createAsyncThunk<UserProps, void, AsyncThunkConfig>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiWithAuth.get<UserProps>('api/auth/users/me/')
      return response.data
    } catch (error) {
      tokenUtils.clearTokens()
      return rejectWithValue(null)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (
    formData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const tokenRes = await api.post<{ access: string; refresh: string }>(
        '/api/auth/jwt/create/',
        formData
      )
      const { access, refresh } = tokenRes.data

      tokenUtils.setTokens(access, refresh)

      const userRes = await apiWithAuth.get<UserProps>('/api/auth/users/me/')
      const user = userRes.data

      return user
    } catch (err) {
      tokenUtils.clearTokens()
      return rejectWithValue('Invalid email or password')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (
    formData: {
      first_name: string
      last_name: string
      email: string
      password: string
    },
    { dispatch }
  ) => {
    await api.post('/api/auth/users/', formData)
    await dispatch(login(formData))
  }
)
