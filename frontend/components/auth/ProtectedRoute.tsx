// components/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { ImSpinner8 } from 'react-icons/im'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallbackUrl?: string
  requireOnboarding?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackUrl = '/login',
  requireOnboarding = true,
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    isComplete,
    isLoading: onboardingLoading,
    isChecked,
    checkOnboardingStatus,
  } = useOnboarding()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentPath = pathname + window.location.search
      router.push(`${fallbackUrl}?next=${encodeURIComponent(currentPath)}`)
    }
  }, [isAuthenticated, authLoading, router, fallbackUrl, pathname])

  // Check onboarding status once authenticated
  useEffect(() => {
    if (isAuthenticated && !isChecked && requireOnboarding) {
      checkOnboardingStatus()
    }
  }, [isAuthenticated, isChecked, requireOnboarding, checkOnboardingStatus])

  // Handle onboarding redirect
  useEffect(() => {
    if (
      isAuthenticated &&
      isChecked &&
      !isComplete &&
      requireOnboarding &&
      pathname !== '/onboarding'
    ) {
      router.push('/onboarding')
    }
  }, [
    isAuthenticated,
    isChecked,
    isComplete,
    requireOnboarding,
    pathname,
    router,
  ])

  // Show loading state
  if (authLoading || (requireOnboarding && !isChecked && onboardingLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ImSpinner8 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Don't render if onboarding is required but not complete
  if (
    requireOnboarding &&
    isChecked &&
    !isComplete &&
    pathname !== '/onboarding'
  ) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
