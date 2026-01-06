import CancelComponent from './CancelComponent'
import { Suspense } from 'react'

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelComponent />
    </Suspense>
  )
}
