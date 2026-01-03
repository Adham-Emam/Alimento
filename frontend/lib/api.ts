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
    const token = tokenUtils.getAccessToken()
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
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

let isRefreshing = false
let refreshQueue: ((token: string) => void)[] = []

const processQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

// Response interceptor - Handle token refresh
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    const currentPath =
      typeof window !== 'undefined'
        ? window.location.pathname + window.location.search
        : '/'

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = tokenUtils.getRefreshToken()

      if (!refreshToken) {
        tokenUtils.clearTokens()
        window.location.href = `/login?next=${encodeURIComponent(currentPath)}`
        return Promise.reject(error)
      }

      //  If refresh already in progress, queue request
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(axiosPrivate(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        const response = await axiosPublic.post('/api/auth/jwt/refresh/', {
          refresh: refreshToken,
        })

        const { access, refresh } = response.data

        tokenUtils.setTokens(access, refresh)
        processQueue(access)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`
        }

        return axiosPrivate(originalRequest)
      } catch (refreshError) {
        tokenUtils.clearTokens()
        window.location.href = `/login?next=${encodeURIComponent(currentPath)}`
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
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
