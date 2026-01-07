'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { tokenUtils } from '@/lib/api'
import Loader from '@/components/ui/loader'

const safeNextRegex = /^\/(?!\/)[\w\-./?=#%]*$/

export default function AuthRedirection({
  children,
  redirectTo = '/dashboard',
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const isAuth = tokenUtils.isAuthenticated()
    const rawNext = searchParams.get('next')

    const next =
      rawNext &&
      safeNextRegex.test(rawNext) &&
      !rawNext.startsWith('/login') &&
      !rawNext.startsWith('/register')
        ? rawNext
        : redirectTo

    if (isAuth) {
      router.replace(next)
      return
    }

    setReady(true)
  }, [router, searchParams, redirectTo])

  if (!ready) {
    return <Loader />
  }

  return <>{children}</>
}
