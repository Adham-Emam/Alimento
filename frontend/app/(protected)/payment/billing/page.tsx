import { Metadata } from 'next'
import BillingComponent from './BillingComponent'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Billing | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillingComponent />
    </Suspense>
  )
}
