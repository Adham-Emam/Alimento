// components/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ImSpinner8 } from 'react-icons/im'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallbackUrl?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackUrl = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackUrl)
    }
  }, [isAuthenticated, isLoading, router, fallbackUrl])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ImSpinner8 className="animate-spin" />
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
