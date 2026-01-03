import {
  createSlice,
  createAsyncThunk,
  AsyncThunkConfig,
} from '@reduxjs/toolkit'
import { api, apiWithAuth, tokenUtils } from '@/lib/api'
import { useRouter } from 'next/navigation'
import type { UserProps } from '@/types'

interface AuthState {
  user: UserProps | null
  isLoading: boolean
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
}

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      tokenUtils.clearTokens()
      state.user = null
      state.isAuthenticated = false
      const router = useRouter()
      router.push('/login')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.isLoading = false
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.isLoading = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
