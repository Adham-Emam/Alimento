import { Metadata } from 'next'
import { Suspense } from 'react'
import FeedsComponent from './FeedsComponent'
import Loader from '@/components/ui/loader'

export const metadata: Metadata = {
  title: 'Feeds | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function FeedsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <FeedsComponent />
    </Suspense>
  )
}
