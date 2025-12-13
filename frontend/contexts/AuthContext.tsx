'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { api, tokenUtils } from '@/lib/api'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
}

interface RegisterFormProps {
  first_name?: string
  last_name?: string
  email: string
  password: string
}

interface LoginFormProps {
  email: string
  password: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (formData: LoginFormProps) => Promise<void>
  logout: () => void
  register: (formData: RegisterFormProps) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenUtils.getAccessToken()

      if (token) {
        try {
          // Fetch user profile
          const response = await api.get<User>('api/auth/users/me/', {
            headers: { Authorization: `Bearer ${token}` },
          })
          setUser(response.data)
        } catch (error) {
          tokenUtils.clearTokens()
          setUser(null)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (formData: LoginFormProps) => {
    const response = await api.post<{
      access: string
      refresh: string
      user: User
    }>('/api/auth/jwt/create/', formData)

    const { access, refresh, user: userData } = response.data
    tokenUtils.setTokens(access, refresh)
    setUser(userData)
  }

  const logout = () => {
    tokenUtils.clearTokens()
    setUser(null)
    router.push('/login')
  }

  const register = async (formData: RegisterFormProps) => {
    await api.post('/api/auth/users/', formData)
    // auto-login after registration
    await login(formData)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
