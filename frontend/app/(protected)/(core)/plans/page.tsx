import { Metadata } from 'next'
import PlansComponent from '@/components/plans/PlansComponent'

export const metadata: Metadata = {
  title: 'Plans | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function PlansPage() {
  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Choose the plan that fits you
        </h1>

        <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground">
          Start for free, upgrade for advanced features, or become a coach and
          help others reach their goals.
        </p>
      </div>
      <PlansComponent />
    </>
  )
}
