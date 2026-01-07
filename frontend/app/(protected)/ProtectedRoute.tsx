'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import Loader from '@/components/ui/loader'
import { tokenUtils } from '@/lib/api'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallbackUrl?: string
  requireOnboarding?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackUrl = '/login',
}) => {
  const { isLoading: authLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (authLoading) return

    const isAuth = tokenUtils.isAuthenticated()

    if (!isAuth) {
      router.replace(`${fallbackUrl}?next=${encodeURIComponent(pathname)}`)
      return
    }

    setAllowed(true)
  }, [router, fallbackUrl, pathname, authLoading])

  if (!allowed) {
    return <Loader />
  }

  return <>{children}</>
}

export default ProtectedRoute
