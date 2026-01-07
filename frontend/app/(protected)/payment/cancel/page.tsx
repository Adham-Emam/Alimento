import { Metadata } from 'next'
import CancelComponent from './CancelComponent'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Cancel Payment | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelComponent />
    </Suspense>
  )
}
