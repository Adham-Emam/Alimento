'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useOnboarding } from '@/redux/hooks/onboarding'
import Loader from './ui/loader'

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
  const [ready, setReady] = useState(false)
  const { isComplete, isChecked, checkOnboardingStatus, isLoading } =
    useOnboarding()

  useEffect(() => {
    if (!isChecked && !PUBLIC_ROUTES.includes(pathname)) {
      checkOnboardingStatus()
    } else if (PUBLIC_ROUTES.includes(pathname)) {
      setReady(true)
    }
  }, [isChecked, pathname, checkOnboardingStatus])

  useEffect(() => {
    if (isLoading || !isChecked) return

    if (isComplete) {
      if (pathname === '/onboarding') {
        router.push('/dashboard')
        return
      }
    } else {
      if (pathname !== '/onboarding' && !PUBLIC_ROUTES.includes(pathname)) {
        router.push('/onboarding')
        return
      }
    }

    setReady(true)
  }, [isComplete, isChecked, pathname, router, isLoading])

  if (!ready) return <Loader />

  return <>{children}</>
}

export { useOnboarding }
