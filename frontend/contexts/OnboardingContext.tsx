'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useOnboarding } from '@/store/hooks/onboarding'

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
]

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isComplete, isChecked, checkOnboardingStatus } = useOnboarding()

  useEffect(() => {
    if (!isChecked && !PUBLIC_ROUTES.includes(pathname)) {
      checkOnboardingStatus()
    }
  }, [isChecked, pathname, checkOnboardingStatus])

  useEffect(() => {
    if (isChecked) {
      if (isComplete) {
        if (pathname === '/onboarding') {
          router.push('/dashboard')
        }
      } else {
        if (pathname !== '/onboarding' && !PUBLIC_ROUTES.includes(pathname)) {
          router.push('/onboarding')
        }
      }
    }
  }, [isComplete, isChecked, pathname, router])

  return <>{children}</>
}

// Re-export the hook for convenience
export { useOnboarding }
