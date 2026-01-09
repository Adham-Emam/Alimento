'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { checkAuth } from '@/redux/api/auth'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Check, X } from 'lucide-react'
import { plans } from '@/constants/plans'
import { motion } from 'framer-motion'
import { Button } from '../../../../../components/ui/button'
import Loader from '../../../../../components/ui/loader'

export default function PlansComponent() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuth())
    } else {
      const plan = user?.subscription?.is_pro
        ? 'pro'
        : user?.subscription?.is_coach
        ? 'coach'
        : null
      setCurrentPlan(plan)
    }
  }, [dispatch, isAuthenticated])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
          className="relative rounded-2xl border p-6 pb-16 shadow-sm bg-card hover:shadow-md"
        >
          <h2 className="text-xl font-bold">{plan.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{plan.subtitle}</p>

          <p className="text-2xl font-bold mt-4">{plan.price}</p>

          <ul className="mt-6 space-y-3">
            {plan.features.map((feature, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-3 text-sm ${
                  feature.available
                    ? 'text-foreground'
                    : 'text-muted-foreground line-through'
                }`}
              >
                {feature.available ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                {feature.label}
              </li>
            ))}
          </ul>

          {plan.id !== 'free' &&
            (plan.id === currentPlan ? (
              <button className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[85%] rounded-xl border px-4 bg-card-foreground text-card py-2 text-sm font-medium opacity-50 cursor-not-allowed">
                Current Plan
              </button>
            ) : (
              <Button
                className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[85%] rounded-xl border px-4 bg-card-foreground text-card py-2 text-sm font-medium"
                variant="outline"
                asChild
              >
                <Link href={`/payment/billing?plan=${plan.id}`}>
                  {plan.id === 'coach' ? 'Apply as Coach' : 'Choose Plan'}
                </Link>
              </Button>
            ))}
        </motion.div>
      ))}
    </div>
  )
}
