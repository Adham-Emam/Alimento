'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { ImSpinner8 } from 'react-icons/im'
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
  }, [router, fallbackUrl, pathname])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center  fixed top-0 left-0 z-50 min-h-screen w-full">
        <ImSpinner8 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    )
  }
  if (!tokenUtils.isAuthenticated()) return null

  return <>{children}</>
}

export default ProtectedRoute
