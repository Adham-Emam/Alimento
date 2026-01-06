import BillingComponent from './BillingComponent'
import { Suspense } from 'react'

export default function BillingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillingComponent />
    </Suspense>
  )
}
