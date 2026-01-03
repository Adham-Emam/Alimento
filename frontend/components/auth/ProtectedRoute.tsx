'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import Loader from '../ui/loader'
import { tokenUtils } from '@/lib/api'

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
  const { isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  )
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!tokenUtils.isAuthenticated()) {
      router.replace(`${fallbackUrl}?next=${encodeURIComponent(pathname)}`)
    }
  }, [router, fallbackUrl, pathname, isAuthenticated])

  if (authLoading) {
    return <Loader />
  }

  return <>{children}</>
}

export default ProtectedRoute
