'use client'

import { apiWithAuth } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Loader from '@/components/ui/loader'

interface CheckoutUrl {
  checkout_url: string
}

export default function BillingComponent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const plan = searchParams.get('plan')

  const checkout = async (p: string) => {
    try {
      const res = await apiWithAuth.post<CheckoutUrl>(
        `/api/subscriptions/checkout/?plan=${p}`
      )
      const checkoutUrl = res.data.checkout_url
      if (!checkoutUrl) {
        router.replace(`/payment/cancel?plan=${p}`)
        return
      }
      router.replace(checkoutUrl)
    } catch (err: any) {
      console.error(err)
      router.replace(`/payment/cancel?plan=${p}`)
    }
  }

  useEffect(() => {
    if (plan) {
      checkout(plan)
    }
  }, [plan])

  return <Loader />
}
