'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/loader'
import { XCircle } from 'lucide-react'

export default function CancelComponent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  if (!plan) {
    return <Loader />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 text-center">
        <XCircle className="mx-auto h-16 w-16 text-destructive mb-4" />

        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>

        <p className="text-muted-foreground mb-6">
          Your payment was failed. No charges were made.
        </p>

        <div className="flex flex-col gap-3">
          <Link href={`/payment/billing?plan=${plan}`}>
            <Button className="w-full">Try Again</Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
