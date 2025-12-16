import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
// Token keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// ============ Token Utilities ============
export const tokenUtils = {
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    }
    return null
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    }
    return null
  },

  setTokens: (accessToken: string, refreshToken?: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      }
    }
  },

  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  },

  isAuthenticated: (): boolean => {
    return !!tokenUtils.getAccessToken()
  },
}

// ============ Base Axios Instance (No Auth) ============
export const axiosPublic: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// ============ Axios Instance with Auth ============
export const axiosPrivate: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - Add access token to requests
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token refresh
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    const currentPath = window.location.pathname + window.location.search

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenUtils.getRefreshToken()

        if (!refreshToken) {
          tokenUtils.clearTokens()
          window.location.href = `/login?next=${encodeURIComponent(
            currentPath
          )}`
          return Promise.reject(error)
        }

        // Call refresh endpoint
        const response = await axiosPublic.post('/token/refresh/', {
          refresh: refreshToken,
        })

        const { access, refresh } = response.data
        tokenUtils.setTokens(access, refresh)

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`
        }

        return axiosPrivate(originalRequest)
      } catch (refreshError) {
        tokenUtils.clearTokens()
        window.location.href = `/login?next=${encodeURIComponent(currentPath)}`
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ============ Fetch Functions ============
export const api = {
  // Public requests (no auth required)
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosPublic.get<T>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosPublic.post<T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosPublic.put<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosPublic.delete<T>(url, config),
}

export const apiWithAuth = {
  // Protected requests (auth required)
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosPrivate.get<T>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosPrivate.post<T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosPrivate.put<T>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosPrivate.patch<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosPrivate.delete<T>(url, config),
}

export default axiosPrivate
